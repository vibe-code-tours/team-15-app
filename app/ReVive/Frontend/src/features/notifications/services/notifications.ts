"use server"

import { apiGet } from "@/lib/api/client"
import type {
  NotificationType,
  NotificationInput,
} from "@/features/notifications/types"

export type Notification = {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  actionUrl: string | null
  metadata: string | null
  createdAt: string
}

export async function createNotification(input: NotificationInput) {
  // Backend does not have a create notification endpoint yet
  // Stub for now -- notifications are created server-side in the Backend
  return { success: true }
}

export async function getNotifications(limit = 20): Promise<Notification[]> {
  const data = await apiGet<Notification[]>(`/api/notifications/?limit=${limit}`)
  return Array.isArray(data) ? data : []
}

export async function getUnreadCount(): Promise<number> {
  const data = await apiGet<{ items: Notification[] }>("/api/notifications/?unread_only=true")
  return data.items?.length || 0
}

export async function markAsRead(id: string) {
  // Backend does not have a mark-as-read endpoint yet
  return { success: true }
}

export async function markAllAsRead() {
  // Backend does not have a mark-all-as-read endpoint yet
  return { success: true }
}

export async function deleteNotification(id: string) {
  // Backend does not have a delete notification endpoint yet
  return { success: true }
}

export async function clearAllNotifications() {
  // Backend does not have a clear-all endpoint yet
  return { success: true }
}

// Helper functions to create specific notification types

export async function notifyPickupScheduled(
  userId: string,
  pickupId: number,
  deviceName: string,
  availableFrom: string,
  availableTo: string
) {
  return createNotification({
    userId,
    type: "pickup_scheduled",
    title: "",
    message: "",
    metadata: { pickupId, deviceName, availableFrom, availableTo },
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
