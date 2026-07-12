"use server"

// Achievements functionality not yet available in Backend API
// Stub implementations to prevent import errors

export async function checkAchievements() {
  return { success: true }
}

export async function getProgress() {
  return { total: 0, unlocked: 0, percentage: 0 }
}

export async function dismissAchievement(achievementId: string) {
  return { success: true }
}

export async function getNewAchievements() {
  return []
}

export async function getAchievementStats() {
  return { total: 0, unlocked: 0, recent: [] }
}
