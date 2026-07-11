"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { referrals, userPoints, impactEvents, pickups, user } from "@/lib/db/schema"
import { eq, and, desc, count } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

// Generate a unique 8-character referral code
function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate or get referral code for a user
export async function getOrCreateReferralCode(userId: string) {
  // Check if user already has a code
  const existing = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))
    .limit(1)

  if (existing.length > 0) {
    return existing[0].referralCode
  }

  // Generate new unique code
  let code = generateCode()
  let isUnique = false

  while (!isUnique) {
    const check = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referralCode, code))
      .limit(1)

    if (check.length === 0) {
      isUnique = true
    } else {
      code = generateCode()
    }
  }

  // Create referral record
  await db.insert(referrals).values({
    id: randomUUID(),
    referrerId: userId,
    referralCode: code,
    status: "pending",
    createdAt: new Date().toISOString(),
  })

  return code
}

// Get referral stats for a user
export async function getReferralStats(userId: string) {
  // Get or create points record
  let pointsRecord = await db
    .select()
    .from(userPoints)
    .where(eq(userPoints.userId, userId))
    .limit(1)

  if (pointsRecord.length === 0) {
    await db.insert(userPoints).values({
      id: randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
    })
    pointsRecord = await db
      .select()
      .from(userPoints)
      .where(eq(userPoints.userId, userId))
      .limit(1)
  }

  // Count pending referrals
  const pendingReferrals = await db
    .select({ count: count() })
    .from(referrals)
    .where(and(eq(referrals.referrerId, userId), eq(referrals.status, "pending")))

  return {
    totalPoints: pointsRecord[0].totalPoints,
    doublePointsEarned: pointsRecord[0].doublePointsEarned,
    referralsMade: pointsRecord[0].referralsMade,
    co2SavedFromReferrals: pointsRecord[0].co2SavedFromReferrals,
    pendingReferrals: pendingReferrals[0].count,
  }
}

// Apply a referral code when a new user signs up
export async function applyReferralCode(code: string, newUserId: string) {
  // Validate input
  if (!code || typeof code !== "string" || code.length !== 8) {
    return { error: "Invalid referral code format" }
  }

  // Verify the caller matches the newUserId (security check)
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user?.id !== newUserId) {
      return { error: "Unauthorized" }
    }
  } catch {
    // During sign-up, session may not exist yet - this is expected
    // The auth form already validates the user ID from the sign-up response
  }

  // Find the referral code
  const referral = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referralCode, code.toUpperCase()))
    .limit(1)

  if (referral.length === 0) {
    return { error: "Invalid referral code" }
  }

  // Check if code is for the same user
  if (referral[0].referrerId === newUserId) {
    return { error: "You cannot use your own referral code" }
  }

  // Check if already used
  if (referral[0].referredId) {
    return { error: "This referral code has already been used" }
  }

  // Update referral record
  await db
    .update(referrals)
    .set({
      referredId: newUserId,
      status: "completed",
      completedAt: new Date().toISOString(),
    })
    .where(eq(referrals.id, referral[0].id))

  // Increment referrer's referral count
  const referrerPoints = await db
    .select()
    .from(userPoints)
    .where(eq(userPoints.userId, referral[0].referrerId))
    .limit(1)

  if (referrerPoints.length > 0) {
    await db
      .update(userPoints)
      .set({
        referralsMade: referrerPoints[0].referralsMade + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userPoints.userId, referral[0].referrerId))
  }

  revalidatePath("/dashboard")
  revalidatePath("/referral")
  return { success: true, referrerId: referral[0].referrerId }
}

// Award double impact points when a referred user completes a donation
// Note: This is exported for use by other server actions, but should not be called from client components
export async function awardDoubleImpactPoints(userId: string, pickupId: number) {
  // Check if this user was referred by someone
  const referral = await db
    .select()
    .from(referrals)
    .where(and(eq(referrals.referredId, userId), eq(referrals.status, "completed")))
    .limit(1)

  // Get the pickup to calculate CO2
  const pickup = await db
    .select()
    .from(pickups)
    .where(eq(pickups.id, pickupId))
    .limit(1)

  if (pickup.length === 0) return { success: false, reason: "Pickup not found" }

  // Estimate CO2 saved (2.2 kg per device, multiplied by quantity)
  const co2Saved = 2.2 * (pickup[0].quantity || 1)

  // If user was referred, award double points to referrer
  if (referral.length > 0) {
    const basePoints = 100
    const doublePoints = basePoints * 2

    // Create impact event for the referrer (double points)
    await db.insert(impactEvents).values({
      id: randomUUID(),
      userId: referral[0].referrerId,
      pickupId,
      type: "double_impact",
      points: doublePoints,
      co2Saved,
      referralId: referral[0].id,
      createdAt: new Date().toISOString(),
    })

    // Update referrer's points
    const referrerPoints = await db
      .select()
      .from(userPoints)
      .where(eq(userPoints.userId, referral[0].referrerId))
      .limit(1)

    if (referrerPoints.length > 0) {
      await db
        .update(userPoints)
        .set({
          totalPoints: referrerPoints[0].totalPoints + doublePoints,
          doublePointsEarned: referrerPoints[0].doublePointsEarned + doublePoints,
          co2SavedFromReferrals: referrerPoints[0].co2SavedFromReferrals + co2Saved,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(userPoints.userId, referral[0].referrerId))
    }
  }

  // Always create impact event for the donating user (single event)
  await db.insert(impactEvents).values({
    id: randomUUID(),
    userId,
    pickupId,
    type: "donation",
    points: 100,
    co2Saved,
    createdAt: new Date().toISOString(),
  })

  // Update donating user's points
  const userPointsRecord = await db
    .select()
    .from(userPoints)
    .where(eq(userPoints.userId, userId))
    .limit(1)

  if (userPointsRecord.length > 0) {
    await db
      .update(userPoints)
      .set({
        totalPoints: userPointsRecord[0].totalPoints + 100,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userPoints.userId, userId))
  }

  return { success: true, points: referral.length > 0 ? 200 : 100, co2Saved }
}

// Get impact timeline for a user
export async function getImpactTimeline(userId: string) {
  const events = await db
    .select({
      id: impactEvents.id,
      type: impactEvents.type,
      points: impactEvents.points,
      co2Saved: impactEvents.co2Saved,
      createdAt: impactEvents.createdAt,
      referredName: user.name,
    })
    .from(impactEvents)
    .leftJoin(referrals, eq(impactEvents.referralId, referrals.id))
    .leftJoin(user, eq(referrals.referredId, user.id))
    .where(eq(impactEvents.userId, userId))
    .orderBy(desc(impactEvents.createdAt))
    .limit(20)

  return events
}

// Get the full referral info (code + stats combined)
export async function getReferralDashboard() {
  const userId = await getUserId()
  const code = await getOrCreateReferralCode(userId)
  const stats = await getReferralStats(userId)

  return { code, stats }
}
