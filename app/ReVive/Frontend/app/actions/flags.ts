"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { flaggedContent } from "@/lib/db/message-schema"
import { eq, and, count } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export type FlagReason =
  | "spam"
  | "scam"
  | "inappropriate"
  | "fake_listing"
  | "harassment"
  | "other"

export async function flagContent(
  targetType: "listing" | "user" | "message",
  targetId: string,
  reason: FlagReason,
  description?: string
) {
  const userId = await getUserId()

  // Check if already flagged by this user
  const existing = await db
    .select()
    .from(flaggedContent)
    .where(
      and(
        eq(flaggedContent.reporterId, userId),
        eq(flaggedContent.targetType, targetType),
        eq(flaggedContent.targetId, targetId)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    return { error: "You have already reported this content" }
  }

  // Create flag
  const flagId = randomUUID()
  await db.insert(flaggedContent).values({
    id: flagId,
    reporterId: userId,
    targetType,
    targetId,
    reason,
    description: description?.trim() || null,
    createdAt: new Date().toISOString(),
  })

  revalidatePath("/dashboard")
  return { success: true, flagId }
}

export async function getFlagCount(
  targetType: "listing" | "user" | "message",
  targetId: string
) {
  const result = await db
    .select({ count: count() })
    .from(flaggedContent)
    .where(
      and(
        eq(flaggedContent.targetType, targetType),
        eq(flaggedContent.targetId, targetId)
      )
    )

  return result[0]?.count || 0
}

export async function hasUserFlagged(
  targetType: "listing" | "user" | "message",
  targetId: string
) {
  const userId = await getUserId()

  const existing = await db
    .select()
    .from(flaggedContent)
    .where(
      and(
        eq(flaggedContent.reporterId, userId),
        eq(flaggedContent.targetType, targetType),
        eq(flaggedContent.targetId, targetId)
      )
    )
    .limit(1)

  return existing.length > 0
}

// Admin functions
export async function getPendingFlags() {
  const flags = await db
    .select()
    .from(flaggedContent)
    .where(eq(flaggedContent.status, "pending"))
    .orderBy(flaggedContent.createdAt)

  return flags
}

export async function updateFlagStatus(
  flagId: string,
  status: "reviewed" | "resolved" | "dismissed"
) {
  await db
    .update(flaggedContent)
    .set({ status })
    .where(eq(flaggedContent.id, flagId))

  revalidatePath("/admin")
  return { success: true }
}
