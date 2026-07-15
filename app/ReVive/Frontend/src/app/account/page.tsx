import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { AppHeader } from "@/components/app-header"
import { getUserStats } from "@/features/settings/services/settings"
import { getAchievementStats } from "@/features/achievements/services/achievements"
import { AccountView } from "@/features/account/components/account-view"

export const metadata = {
  title: "My Account - ReVive",
  description: "Manage your account, profile, and settings.",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AccountPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  let userStats = { totalPickups: 0, totalReferrals: 0, totalPoints: 0 }
  let achievementStats = { unlocked: 0 }

  try {
    const [fetchedStats, fetchedAchievements] = await Promise.all([
      getUserStats(user.id),
      getAchievementStats(),
    ])
    if (fetchedStats) userStats = fetchedStats
    if (fetchedAchievements) achievementStats = fetchedAchievements
  } catch (error) {
    console.error("Failed to fetch user stats for Account Page:", error)
  }

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <AccountView
        user={user}
        userStats={userStats}
        achievementStats={achievementStats}
      />
    </div>
  )
}
