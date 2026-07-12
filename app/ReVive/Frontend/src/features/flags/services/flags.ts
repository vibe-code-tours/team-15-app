"use server"

export type FlagReason =
  | "spam"
  | "scam"
  | "inappropriate"
  | "fake_listing"
  | "harassment"
  | "other"

// Flags/Reports functionality not yet available in Backend API
// Stub implementations to prevent import errors

export async function flagContent(
  targetType: "listing" | "user" | "message",
  targetId: string,
  reason: FlagReason,
  description?: string
) {
  return { success: true }
}

export async function getFlagCount(
  targetType: "listing" | "user" | "message",
  targetId: string
): Promise<number> {
  return 0
}

export async function hasUserFlagged(
  targetType: "listing" | "user" | "message",
  targetId: string
): Promise<boolean> {
  return false
}

export async function getPendingFlags() {
  return []
}

export async function updateFlagStatus(
  flagId: string,
  status: "reviewed" | "resolved" | "dismissed"
) {
  return { success: true }
}
