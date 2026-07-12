import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { getReferralDashboard, getImpactTimeline } from "@/features/referrals/services/referrals"
import { AppHeader } from "@/components/app-header"
import { ReferralView } from "@/features/referrals/components/referral-view"

export const metadata = {
  title: "Referral Program",
  description: "Share your referral code and earn double impact points when friends donate e-waste.",
}

export default async function ReferralPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const { code, stats } = await getReferralDashboard()
  const impactTimeline = await getImpactTimeline(user.id)

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <ReferralView code={code} stats={stats} impactTimeline={impactTimeline} />
    </div>
  )
}
