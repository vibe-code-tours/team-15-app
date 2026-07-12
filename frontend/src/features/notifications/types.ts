export type NotificationType =
  | "pickup_scheduled"
  | "pickup_completed"
  | "pickup_cancelled"
  | "referral_signup"
  | "referral_completed"
  | "milestone_reached"
  | "system"

export interface NotificationMetadata {
  pickupId?: number
  referralCode?: string
  referrerName?: string
  milestone?: string
  [key: string]: unknown
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl: string | null
  metadata: string | null
  createdAt: string
}

export interface NotificationInput {
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  metadata?: NotificationMetadata
}
