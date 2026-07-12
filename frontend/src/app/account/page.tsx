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

export default async function AccountPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const [userStats, achievementStats] = await Promise.all([
    getUserStats(user.id),
    getAchievementStats(),
  ])

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
