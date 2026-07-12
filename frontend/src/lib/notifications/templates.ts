import type { NotificationType, NotificationMetadata } from "./types"

interface NotificationTemplate {
  title: string
  message: (metadata: NotificationMetadata) => string
  actionUrl?: (metadata: NotificationMetadata) => string
}

const templates: Record<NotificationType, NotificationTemplate> = {
  pickup_scheduled: {
    title: "Pickup Scheduled",
    message: (m) =>
      `Your ${m.deviceName || "e-waste"} pickup has been scheduled for ${m.pickupDate || "a future date"}.`,
    actionUrl: () => "/dashboard",
  },
  pickup_completed: {
    title: "Pickup Completed! 🎉",
    message: (m) =>
      `Your ${m.deviceName || "e-waste"} pickup has been completed. You earned ${m.points || 100} impact points!`,
    actionUrl: () => "/dashboard",
  },
  pickup_cancelled: {
    title: "Pickup Cancelled",
    message: (m) =>
      `Your ${m.deviceName || "e-waste"} pickup has been cancelled.`,
    actionUrl: () => "/dashboard",
  },
  referral_signup: {
    title: "New Referral! 🌟",
    message: (m) =>
      `${m.referrerName || "Someone"} signed up using your referral code. You'll earn double points when they complete their first pickup!`,
    actionUrl: () => "/referral",
  },
  referral_completed: {
    title: "Referral Completed! 🎊",
    message: (m) =>
      `Your referral completed their first pickup! You earned ${m.points || 200} double impact points!`,
    actionUrl: () => "/referral",
  },
  milestone_reached: {
    title: "Milestone Achieved! 🏆",
    message: (m) =>
      `Congratulations! You've reached the "${m.milestone || "Eco Warrior"}" milestone!`,
    actionUrl: () => "/dashboard",
  },
  system: {
    title: "System Update",
    message: (m) => m.message || "You have a new notification.",
  },
}

export function getNotificationTemplate(
  type: NotificationType
): NotificationTemplate {
  return templates[type] || templates.system
}

export function generateNotificationContent(
  type: NotificationType,
  metadata: NotificationMetadata
) {
  const template = getNotificationTemplate(type)
  return {
    title: template.title,
    message: template.message(metadata),
    actionUrl: template.actionUrl?.(metadata),
  }
}
