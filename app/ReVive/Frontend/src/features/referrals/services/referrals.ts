"use server"

import { apiGet, apiPost } from "@/lib/api/client"

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

/** Get or create referral code for a user */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const data = await apiGet<{ code: string }>("/api/referrals/")
  return data.code
}

/** Get referral stats for a user */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const data = await apiGet<{ stats: ReferralStats }>("/api/referrals/")
  return data.stats
}

/** Apply a referral code when a new user signs up */
export async function applyReferralCode(code: string, newUserId: string) {
  const result = await apiPost<{ success: boolean }, { code: string }>(
    "/api/referrals/",
    { code: code.toUpperCase() }
  )
  return { success: true }
}

/** Award double impact points when a referred user completes a donation */
export async function awardDoubleImpactPoints(userId: string, pickupId: number) {
  // This is called internally by the Backend when completing a pickup
  // No direct API call needed -- the Backend handles this in PATCH /api/pickups/{id}
  return { success: true, points: 100, co2Saved: 2.2 }
}

/** Get impact timeline for a user */
export async function getImpactTimeline(userId: string): Promise<ImpactEvent[]> {
  // Backend does not have this endpoint yet -- return empty
  return []
}

/** Get the full referral info (code + stats combined) */
export async function getReferralDashboard(): Promise<ReferralDashboard> {
  const data = await apiGet<ReferralDashboard>("/api/referrals/")
  return data
}
