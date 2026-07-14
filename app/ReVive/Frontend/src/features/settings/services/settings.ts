"use server"

import { apiGet, apiPut, apiDelete } from "@/lib/api/client"

export type UserStats = {
  totalPickups: number
  totalReferrals: number
  totalPoints: number
}

export type NotificationPreferences = {
  emailPickupUpdates: boolean
  emailReferralAlerts: boolean
  emailMilestones: boolean
  pushEnabled: boolean
}

/** Update user profile */
export async function updateProfile(data: { name?: string; image?: string }) {
  const body: Record<string, string> = {}
  if (data.name !== undefined) body.name = data.name
  if (data.image !== undefined) body.profile_picture_url = data.image
  await apiPut("/api/users/me", body)
  return { success: true }
}

/** Get user stats */
export async function getUserStats(userId: string): Promise<UserStats> {
  const data = await apiGet<{ data: UserStats }>("/api/users/me/stats")
  return (data as unknown as { data: UserStats }).data || (data as unknown as UserStats)
}

/** Get notification preferences */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  const data = await apiGet<NotificationPreferences>("/api/users/me/notifications")
  return data
}

/** Update notification preferences */
export async function updateNotificationPreferences(
  preferences: NotificationPreferences
) {
  await apiPut("/api/users/me/notifications", preferences)
  return { success: true }
}

/** Export all user data */
export async function exportUserData() {
  const data = await apiGet<Record<string, unknown>>("/api/users/me/export")
  return data
}

/** Delete user account and all data */
export async function deleteAccount() {
  await apiDelete("/api/users/me")
  return { success: true }
}
