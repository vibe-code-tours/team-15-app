import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Settings, Bell, Award, Package, Users, TrendingUp, ChevronRight } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { getUserStats } from "@/app/actions/settings"
import { getAchievementStats } from "@/app/actions/achievements"
import { ProfileSummary } from "@/components/account/profile-summary"
import { QuickStats } from "@/components/account/quick-stats"
import { AccountMenu } from "@/components/account/account-menu"

export const metadata = {
  title: "My Account - ReVive",
  description: "Manage your account, profile, and settings.",
}

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const [userStats, achievementStats] = await Promise.all([
    getUserStats(session.user.id),
    getAchievementStats(),
  ])

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={session.user.name} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile, view your impact, and access settings.
          </p>
        </div>

        {/* Profile Summary Card */}
        <section className="mb-8">
          <ProfileSummary
            user={{
              id: session.user.id,
              name: session.user.name || "User",
              email: session.user.email,
              image: session.user.image,
            }}
          />
        </section>

        {/* Quick Stats */}
        <section className="mb-8">
          <QuickStats
            stats={{
              totalPickups: userStats.totalPickups,
              totalPoints: userStats.totalPoints,
              totalReferrals: userStats.totalReferrals,
              achievementsUnlocked: achievementStats.unlocked,
            }}
          />
        </section>

        {/* Account Menu */}
        <section>
          <AccountMenu />
        </section>
      </main>
    </div>
  )
}
