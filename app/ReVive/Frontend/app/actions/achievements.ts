"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  checkAndUnlockAchievements,
  getAchievementProgress,
  markAchievementSeen,
  getUnseenAchievements,
} from "@/lib/achievements/checker"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function checkAchievements() {
  const userId = await getUserId()
  const newAchievements = await checkAndUnlockAchievements(userId)

  if (newAchievements.length > 0) {
    revalidatePath("/dashboard")
    revalidatePath("/achievements")
  }

  return {
    newAchievements,
    count: newAchievements.length,
  }
}

export async function getProgress() {
  const userId = await getUserId()
  return getAchievementProgress(userId)
}

export async function dismissAchievement(achievementId: string) {
  const userId = await getUserId()
  await markAchievementSeen(userId, achievementId)
  revalidatePath("/dashboard")
  return { success: true }
}

export async function getNewAchievements() {
  const userId = await getUserId()
  return getUnseenAchievements(userId)
}

export async function getAchievementStats() {
  const userId = await getUserId()
  const progress = await getAchievementProgress(userId)

  const unlocked = progress.filter((p) => p.unlocked)
  const inProgress = progress.filter((p) => !p.unlocked && p.percentage > 0)

  return {
    total: progress.length,
    unlocked: unlocked.length,
    inProgress: inProgress.length,
    locked: progress.length - unlocked.length - inProgress.length,
    totalPointsEarned: unlocked.reduce(
      (sum, p) => sum + (p.achievement.reward?.points || 0),
      0
    ),
  }
}
