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

  const pickups = await getPickups()
  const { code, stats: referralStats } = await getReferralDashboard()
  const impactTimeline = await getImpactTimeline(user.id)

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <DashboardView
        pickups={pickups}
        referralCode={code}
        referralStats={referralStats}
        impactTimeline={impactTimeline}
        userName={user.name}
      />
    </div>
  )
}
