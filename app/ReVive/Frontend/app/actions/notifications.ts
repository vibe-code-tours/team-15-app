"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notifications } from "@/lib/db/notification-schema"
import { eq, and, desc, count, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { generateNotificationContent } from "@/lib/notifications/templates"
import type {
  NotificationType,
  NotificationMetadata,
  NotificationInput,
} from "@/lib/notifications/types"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function createNotification(input: NotificationInput) {
  const content = generateNotificationContent(input.type, input.metadata || {})

  await db.insert(notifications).values({
    id: randomUUID(),
    userId: input.userId,
    type: input.type,
    title: input.title || content.title,
    message: input.message || content.message,
    actionUrl: input.actionUrl || content.actionUrl || null,
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    createdAt: new Date().toISOString(),
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getNotifications(limit = 20) {
  const userId = await getUserId()

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
}

export async function getUnreadCount() {
  const userId = await getUserId()

  const result = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.read, false))
    )

  return result[0]?.count || 0
}

export async function markAsRead(id: string) {
  const userId = await getUserId()

  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(eq(notifications.id, id), eq(notifications.userId, userId))
    )

  revalidatePath("/dashboard")
  return { success: true }
}

export async function markAllAsRead() {
  const userId = await getUserId()

  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(eq(notifications.userId, userId), eq(notifications.read, false))
    )

  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteNotification(id: string) {
  const userId = await getUserId()

  await db
    .delete(notifications)
    .where(
      and(eq(notifications.id, id), eq(notifications.userId, userId))
    )

  revalidatePath("/dashboard")
  return { success: true }
}

export async function clearAllNotifications() {
  const userId = await getUserId()

  await db
    .delete(notifications)
    .where(eq(notifications.userId, userId))

  revalidatePath("/dashboard")
  return { success: true }
}

// Helper functions to create specific notification types

export async function notifyPickupScheduled(
  userId: string,
  pickupId: number,
  deviceName: string,
  pickupDate: string
) {
  return createNotification({
    userId,
    type: "pickup_scheduled",
    title: "", // Will use template
    message: "", // Will use template
    metadata: { pickupId, deviceName, pickupDate },
  })
}

export async function notifyPickupCompleted(
  userId: string,
  pickupId: number,
  deviceName: string,
  points: number
) {
  return createNotification({
    userId,
    type: "pickup_completed",
    title: "",
    message: "",
    metadata: { pickupId, deviceName, points },
  })
}

export async function notifyReferralSignup(
  referrerId: string,
  referrerName: string,
  referralCode: string
) {
  return createNotification({
    userId: referrerId,
    type: "referral_signup",
    title: "",
    message: "",
    metadata: { referrerName, referralCode },
  })
}

export async function notifyReferralCompleted(
  referrerId: string,
  points: number
) {
  return createNotification({
    userId: referrerId,
    type: "referral_completed",
    title: "",
    message: "",
    metadata: { points },
  })
}

export async function notifyMilestone(
  userId: string,
  milestone: string
) {
  return createNotification({
    userId,
    type: "milestone_reached",
    title: "",
    message: "",
    metadata: { milestone },
  })
}
