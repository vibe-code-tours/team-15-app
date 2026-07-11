export type AchievementTier = "bronze" | "silver" | "gold" | "platinum"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  tier: AchievementTier
  category: "donation" | "referral" | "impact" | "streak"
  requirement: {
    type: "count" | "points" | "co2" | "referrals" | "consecutive_months"
    threshold: number
  }
  reward?: {
    points: number
    badge?: string
  }
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: string
  seen: boolean
}

export interface AchievementProgress {
  achievement: Achievement
  current: number
  target: number
  percentage: number
  unlocked: boolean
  unlockedAt?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  // Donation Achievements
  {
    id: "first_donation",
    name: "First Steps",
    description: "Complete your first e-waste pickup",
    icon: "🌱",
    tier: "bronze",
    category: "donation",
    requirement: { type: "count", threshold: 1 },
    reward: { points: 100 },
  },
  {
    id: "donation_5",
    name: "Getting Started",
    description: "Complete 5 e-waste pickups",
    icon: "♻️",
    tier: "bronze",
    category: "donation",
    requirement: { type: "count", threshold: 5 },
    reward: { points: 250 },
  },
  {
    id: "donation_10",
    name: "Eco Warrior",
    description: "Complete 10 e-waste pickups",
    icon: "🌍",
    tier: "silver",
    category: "donation",
    requirement: { type: "count", threshold: 10 },
    reward: { points: 500 },
  },
  {
    id: "donation_25",
    name: "Planet Protector",
    description: "Complete 25 e-waste pickups",
    icon: "🛡️",
    tier: "gold",
    category: "donation",
    requirement: { type: "count", threshold: 25 },
    reward: { points: 1000 },
  },
  {
    id: "donation_50",
    name: "Recycling Legend",
    description: "Complete 50 e-waste pickups",
    icon: "👑",
    tier: "platinum",
    category: "donation",
    requirement: { type: "count", threshold: 50 },
    reward: { points: 2500 },
  },

  // Impact Achievements (CO2 saved)
  {
    id: "co2_10",
    name: "Carbon Reducer",
    description: "Save 10kg of CO₂ emissions",
    icon: "💨",
    tier: "bronze",
    category: "impact",
    requirement: { type: "co2", threshold: 10 },
    reward: { points: 150 },
  },
  {
    id: "co2_50",
    name: "Climate Champion",
    description: "Save 50kg of CO₂ emissions",
    icon: "🌤️",
    tier: "silver",
    category: "impact",
    requirement: { type: "co2", threshold: 50 },
    reward: { points: 500 },
  },
  {
    id: "co2_100",
    name: "Carbon Neutral Hero",
    description: "Save 100kg of CO₂ emissions",
    icon: "🏆",
    tier: "gold",
    category: "impact",
    requirement: { type: "co2", threshold: 100 },
    reward: { points: 1000 },
  },
  {
    id: "co2_500",
    name: "Environmental Guardian",
    description: "Save 500kg of CO₂ emissions",
    icon: "🌟",
    tier: "platinum",
    category: "impact",
    requirement: { type: "co2", threshold: 500 },
    reward: { points: 5000 },
  },

  // Referral Achievements
  {
    id: "referral_1",
    name: "Social Butterfly",
    description: "Refer your first friend",
    icon: "🦋",
    tier: "bronze",
    category: "referral",
    requirement: { type: "referrals", threshold: 1 },
    reward: { points: 200 },
  },
  {
    id: "referral_5",
    name: "Network Builder",
    description: "Refer 5 friends",
    icon: "🔗",
    tier: "silver",
    category: "referral",
    requirement: { type: "referrals", threshold: 5 },
    reward: { points: 750 },
  },
  {
    id: "referral_10",
    name: "Community Leader",
    description: "Refer 10 friends",
    icon: "👥",
    tier: "gold",
    category: "referral",
    requirement: { type: "referrals", threshold: 10 },
    reward: { points: 1500 },
  },
  {
    id: "referral_25",
    name: "Movement Starter",
    description: "Refer 25 friends",
    icon: "🚀",
    tier: "platinum",
    category: "referral",
    requirement: { type: "referrals", threshold: 25 },
    reward: { points: 5000 },
  },

  // Streak Achievements
  {
    id: "streak_3",
    name: "Consistent Recycler",
    description: "Donate for 3 consecutive months",
    icon: "📅",
    tier: "bronze",
    category: "streak",
    requirement: { type: "consecutive_months", threshold: 3 },
    reward: { points: 300 },
  },
  {
    id: "streak_6",
    name: "Dedicated Environmentalist",
    description: "Donate for 6 consecutive months",
    icon: "🗓️",
    tier: "silver",
    category: "streak",
    requirement: { type: "consecutive_months", threshold: 6 },
    reward: { points: 750 },
  },
  {
    id: "streak_12",
    name: "Year-Round Hero",
    description: "Donate for 12 consecutive months",
    icon: "🎯",
    tier: "gold",
    category: "streak",
    requirement: { type: "consecutive_months", threshold: 12 },
    reward: { points: 2000 },
  },

  // Points Achievements
  {
    id: "points_1000",
    name: "Point Collector",
    description: "Earn 1,000 impact points",
    icon: "⭐",
    tier: "bronze",
    category: "impact",
    requirement: { type: "points", threshold: 1000 },
    reward: { points: 100 },
  },
  {
    id: "points_5000",
    name: "Impact Master",
    description: "Earn 5,000 impact points",
    icon: "💎",
    tier: "silver",
    category: "impact",
    requirement: { type: "points", threshold: 5000 },
    reward: { points: 500 },
  },
  {
    id: "points_10000",
    name: "Sustainability Star",
    description: "Earn 10,000 impact points",
    icon: "🌈",
    tier: "gold",
    category: "impact",
    requirement: { type: "points", threshold: 10000 },
    reward: { points: 1000 },
  },
]

export const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
  silver: "text-gray-600 bg-gray-100 dark:bg-gray-800/30",
  gold: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
  platinum: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
}

export const CATEGORY_LABELS: Record<string, string> = {
  donation: "Donations",
  impact: "Impact",
  referral: "Referrals",
  streak: "Streaks",
}
