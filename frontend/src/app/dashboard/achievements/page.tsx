import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { AppHeader } from "@/components/app-header"
import { getProgress, getAchievementStats } from "@/features/achievements/services/achievements"
import { AchievementsView } from "@/features/achievements/components/achievements-view"

export const metadata = {
  title: "Achievements - ReVive",
  description: "Track your achievements and milestones.",
}

export default async function AchievementsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const [progress, stats] = await Promise.all([getProgress(), getAchievementStats()])

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <AchievementsView progress={progress} stats={stats} />
    </div>
  )
}
