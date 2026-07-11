import { db } from "@/lib/db"
import { pickups, referrals, userPoints, impactEvents } from "@/lib/db/schema"
import { userAchievements } from "@/lib/db/achievement-schema"
import { ACHIEVEMENTS } from "./types"
import type { Achievement, AchievementProgress } from "./types"
import { eq, and, count, sum, sql, gte } from "drizzle-orm"
import { randomUUID } from "crypto"

export async function checkAndUnlockAchievements(userId: string) {
  const newAchievements: Achievement[] = []

  // Get user stats
  const stats = await getUserStats(userId)

  // Get already unlocked achievements
  const unlocked = await db
    .select({ achievementId: userAchievements.achievementId })
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId))

  const unlockedIds = new Set(unlocked.map((u) => u.achievementId))

  // Check each achievement
  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.has(achievement.id)) continue

    const progress = getProgress(achievement, stats)
    if (progress.percentage >= 100) {
      // Unlock achievement
      await db.insert(userAchievements).values({
        id: randomUUID(),
        userId,
        achievementId: achievement.id,
        unlockedAt: new Date().toISOString(),
        seen: false,
      })

      // Award bonus points if applicable
      if (achievement.reward?.points) {
        const pointsRecord = await db
          .select()
          .from(userPoints)
          .where(eq(userPoints.userId, userId))
          .limit(1)

        if (pointsRecord.length > 0) {
          await db
            .update(userPoints)
            .set({
              totalPoints: pointsRecord[0].totalPoints + achievement.reward.points,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(userPoints.userId, userId))
        }
      }

      newAchievements.push(achievement)
    }
  }

  return newAchievements
}

async function getUserStats(userId: string) {
  // Get completed pickups count
  const pickupsResult = await db
    .select({ count: count() })
    .from(pickups)
    .where(
      and(eq(pickups.userId, userId), eq(pickups.status, "completed"))
    )

  // Get total points
  const pointsResult = await db
    .select()
    .from(userPoints)
    .where(eq(userPoints.userId, userId))
    .limit(1)

  // Get total CO2 saved
  const co2Result = await db
    .select({
      total: sum(impactEvents.co2Saved),
    })
    .from(impactEvents)
    .where(eq(impactEvents.userId, userId))

  // Get referrals made
  const referralsResult = await db
    .select({ count: count() })
    .from(referrals)
    .where(
      and(
        eq(referrals.referrerId, userId),
        eq(referrals.status, "completed")
      )
    )

  // Calculate consecutive months (simplified - check last 12 months)
  const consecutiveMonths = await calculateConsecutiveMonths(userId)

  return {
    completedPickups: pickupsResult[0]?.count || 0,
    totalPoints: pointsResult[0]?.totalPoints || 0,
    co2Saved: co2Result[0]?.total || 0,
    referralsMade: referralsResult[0]?.count || 0,
    consecutiveMonths,
  }
}

async function calculateConsecutiveMonths(userId: string): Promise<number> {
  // Get pickup dates for the last 12 months
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  const recentPickups = await db
    .select({ pickupDate: pickups.pickupDate })
    .from(pickups)
    .where(
      and(
        eq(pickups.userId, userId),
        eq(pickups.status, "completed"),
        gte(pickups.pickupDate, twelveMonthsAgo.toISOString().split("T")[0])
      )
    )

  if (recentPickups.length === 0) return 0

  // Convert to months and check consecutive
  const months = new Set(
    recentPickups.map((p) => {
      const date = new Date(p.pickupDate)
      return `${date.getFullYear()}-${date.getMonth()}`
    })
  )

  let streak = 0
  const now = new Date()
  let checkDate = new Date(now.getFullYear(), now.getMonth(), 1)

  while (streak < 12) {
    const monthKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}`
    if (months.has(monthKey)) {
      streak++
      checkDate.setMonth(checkDate.getMonth() - 1)
    } else {
      break
    }
  }

  return streak
}

function getProgress(
  achievement: Achievement,
  stats: {
    completedPickups: number
    totalPoints: number
    co2Saved: number
    referralsMade: number
    consecutiveMonths: number
  }
): { current: number; target: number; percentage: number } {
  const { requirement } = achievement
  let current = 0

  switch (requirement.type) {
    case "count":
      current = stats.completedPickups
      break
    case "points":
      current = stats.totalPoints
      break
    case "co2":
      current = stats.co2Saved
      break
    case "referrals":
      current = stats.referralsMade
      break
    case "consecutive_months":
      current = stats.consecutiveMonths
      break
  }

  const percentage = Math.min(100, (current / requirement.threshold) * 100)

  return {
    current,
    target: requirement.threshold,
    percentage,
  }
}

export async function getAchievementProgress(userId: string) {
  const stats = await getUserStats(userId)

  // Get unlocked achievements
  const unlocked = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId))

  const unlockedMap = new Map(
    unlocked.map((u) => [u.achievementId, u.unlockedAt])
  )

  // Calculate progress for each achievement
  const progress: AchievementProgress[] = ACHIEVEMENTS.map((achievement) => {
    const { current, target, percentage } = getProgress(achievement, stats)
    const unlockedAt = unlockedMap.get(achievement.id)

    return {
      achievement,
      current,
      target,
      percentage,
      unlocked: !!unlockedAt,
      unlockedAt,
    }
  })

  // Sort: unlocked first, then by percentage
  progress.sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1
    if (!a.unlocked && b.unlocked) return 1
    return b.percentage - a.percentage
  })

  return progress
}

export async function markAchievementSeen(userId: string, achievementId: string) {
  await db
    .update(userAchievements)
    .set({ seen: true })
    .where(
      and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      )
    )
}

export async function getUnseenAchievements(userId: string) {
  return db
    .select()
    .from(userAchievements)
    .where(
      and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.seen, false)
      )
    )
}
