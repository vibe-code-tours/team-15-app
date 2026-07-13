import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { getPickups } from "@/features/pickups/services/pickups"
import { getReferralDashboard, getImpactTimeline } from "@/features/referrals/services/referrals"
import { AppHeader } from "@/components/app-header"
import { DashboardView } from "@/features/dashboard/components/dashboard-view"

export const metadata = {
  title: "My Listings",
  description: "Track your listed items, see who's interested, and view your environmental impact.",
}

export default async function DashboardPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  let pickups: Awaited<ReturnType<typeof getPickups>> = []
  let referralCode = ""
  let referralStats = { totalPoints: 0, doublePointsEarned: 0, referralsMade: 0, co2SavedFromReferrals: 0, pendingReferrals: 0 }
  let impactTimeline: Awaited<ReturnType<typeof getImpactTimeline>> = []

  try {
    pickups = await getPickups()
  } catch {
    // keep empty array
  }

  try {
    const dashboard = await getReferralDashboard()
    referralCode = dashboard.code
    referralStats = dashboard.stats
  } catch {
    // keep defaults
  }

  try {
    impactTimeline = await getImpactTimeline(user.id)
  } catch {
    // keep empty array
  }

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <DashboardView
        pickups={pickups}
        referralCode={referralCode}
        referralStats={referralStats}
        impactTimeline={impactTimeline}
        userName={user.name}
      />
    </div>
  )
}
