"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user, pickups, referrals, userPoints, impactEvents } from "@/lib/db/schema"
import { userSettings } from "@/lib/db/settings-schema"
import { eq, count } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return { userId: session.user.id, user: session.user }
}

export async function updateProfile(data: { name: string }) {
  const { userId } = await getUserId()

  if (!data.name || !data.name.trim()) {
    return { error: "Name is required" }
  }

  await db
    .update(user)
    .set({
      name: data.name.trim(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(user.id, userId))

  revalidatePath("/settings")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function getUserStats(userId: string) {
  // Get pickup count
  const pickupCount = await db
    .select({ count: count() })
    .from(pickups)
    .where(eq(pickups.userId, userId))

  // Get referral count
  const referralCount = await db
    .select({ count: count() })
    .from(referrals)
    .where(eq(referrals.referrerId, userId))

  // Get points
  const points = await db
    .select()
    .from(userPoints)
    .where(eq(userPoints.userId, userId))
    .limit(1)

  return {
    totalPickups: pickupCount[0]?.count || 0,
    totalReferrals: referralCount[0]?.count || 0,
    totalPoints: points[0]?.totalPoints || 0,
  }
}

export async function getNotificationPreferences(userId: string) {
  const settings = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)

  if (settings.length === 0) {
    // Create default settings
    await db.insert(userSettings).values({
      id: randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
    })

    return {
      emailPickupUpdates: true,
      emailReferralAlerts: true,
      emailMilestones: true,
      pushEnabled: false,
    }
  }

  return {
    emailPickupUpdates: settings[0].emailPickupUpdates,
    emailReferralAlerts: settings[0].emailReferralAlerts,
    emailMilestones: settings[0].emailMilestones,
    pushEnabled: settings[0].pushEnabled,
  }
}

export async function updateNotificationPreferences(
  preferences: {
    emailPickupUpdates: boolean
    emailReferralAlerts: boolean
    emailMilestones: boolean
    pushEnabled: boolean
  }
) {
  const { userId } = await getUserId()

  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)

  if (existing.length === 0) {
    await db.insert(userSettings).values({
      id: randomUUID(),
      userId,
      ...preferences,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } else {
    await db
      .update(userSettings)
      .set({
        ...preferences,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userSettings.userId, userId))
  }

  revalidatePath("/settings")
  return { success: true }
}

export async function exportUserData() {
  const { userId } = await getUserId()

  // Get user info
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  // Get pickups
  const userPickups = await db
    .select()
    .from(pickups)
    .where(eq(pickups.userId, userId))

  // Get referrals
  const userReferrals = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))

  // Get points
  const userPointsData = await db
    .select()
    .from(userPoints)
    .where(eq(userPoints.userId, userId))
    .limit(1)

  // Get impact events
  const userImpactEvents = await db
    .select()
    .from(impactEvents)
    .where(eq(impactEvents.userId, userId))

  // Get settings
  const settings = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)

  return {
    exportDate: new Date().toISOString(),
    profile: userData[0]
      ? {
          name: userData[0].name,
          email: userData[0].email,
          createdAt: userData[0].createdAt,
        }
      : null,
    pickups: userPickups,
    referrals: userReferrals,
    points: userPointsData[0] || null,
    impactEvents: userImpactEvents,
    settings: settings[0] || null,
  }
}

export async function deleteAccount() {
  const { userId } = await getUserId()

  // Delete in order (respect foreign key constraints)
  await db.delete(impactEvents).where(eq(impactEvents.userId, userId))
  await db.delete(userSettings).where(eq(userSettings.userId, userId))
  await db.delete(userPoints).where(eq(userPoints.userId, userId))
  await db.delete(referrals).where(eq(referrals.referrerId, userId))
  await db.delete(pickups).where(eq(pickups.userId, userId))

  // Note: We don't delete the user or session records here
  // as Better Auth manages those. In production, you'd want to
  // call auth.api.deleteUser() or similar.

  return { success: true }
}
