export type ReferralStats = {
  totalPoints: number
  doublePointsEarned: number
  referralsMade: number
  co2SavedFromReferrals: number
  pendingReferrals: number
}

export type ReferralDashboard = {
  code: string
  stats: ReferralStats
  referralUrl: string
}

export type ImpactEvent = {
  id: string
  type: string
  points: number
  co2Saved: number | null
  createdAt: string
  referredName?: string
}
