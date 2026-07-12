export type AchievementTier = "bronze" | "silver" | "gold" | "platinum"

export type Achievement = {
  id: string
  name: string
  description: string
  tier: AchievementTier
  category: string
  reward?: {
    points: number
  }
  icon?: string
}

export type AchievementProgress = {
  achievement: Achievement
  unlocked: boolean
  percentage: number
  unlockedAt?: string
}

export const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: "text-amber-600",
  silver: "text-gray-400",
  gold: "text-yellow-500",
  platinum: "text-purple-400",
}

export const CATEGORY_LABELS: Record<string, string> = {
  donation: "Donation",
  referral: "Referral",
  social: "Social",
  streak: "Streak",
  milestone: "Milestone",
}
