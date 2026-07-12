import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { getAdminStats, getCategoryBreakdown, getStatusBreakdown } from "@/features/admin/services/admin"
import { AdminAnalyticsView } from "@/features/admin/components/admin-analytics-view"

export const metadata = {
  title: "Analytics - Admin",
  description: "View platform analytics and statistics.",
}

export default async function AdminAnalyticsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const [stats, categoryBreakdown, statusBreakdown] = await Promise.all([
    getAdminStats(),
    getCategoryBreakdown(),
    getStatusBreakdown(),
  ])

  return (
    <AdminAnalyticsView
      stats={stats}
      categoryBreakdown={categoryBreakdown}
      statusBreakdown={statusBreakdown}
    />
  )
}
