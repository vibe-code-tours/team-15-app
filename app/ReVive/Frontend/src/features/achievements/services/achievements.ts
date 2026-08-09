"use server"

// Achievements functionality not yet available in Backend API
// Stub implementations to prevent import errors

export async function checkAchievements() {
  return { success: true }
}

import type { AchievementProgress } from "@/features/achievements/types"

export async function getProgress(): Promise<AchievementProgress[]> {
  return []
}

export async function dismissAchievement(achievementId: string) {
  return { success: true }
}

export async function getNewAchievements() {
  return []
}

export async function getAchievementStats() {
  return {
    unlocked: 0,
    inProgress: 0,
    locked: 0,
    totalPointsEarned: 0
  }
}
