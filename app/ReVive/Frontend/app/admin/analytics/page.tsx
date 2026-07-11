import { getAdminStats, getCategoryBreakdown, getStatusBreakdown } from "@/app/actions/admin"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"

export const metadata = {
  title: "Analytics - Admin",
  description: "View platform analytics and statistics.",
}

export default async function AdminAnalyticsPage() {
  const [stats, categoryBreakdown, statusBreakdown] = await Promise.all([
    getAdminStats(),
    getCategoryBreakdown(),
    getStatusBreakdown(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Platform performance and usage statistics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total CO₂ Saved</p>
          <p className="mt-1 text-3xl font-bold text-emerald-500">
            {stats.totalCo2Saved}kg
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Environmental impact
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="mt-1 text-3xl font-bold text-green-500">
            {stats.totalPickups > 0
              ? Math.round((stats.completedPickups / stats.totalPickups) * 100)
              : 0}
            %
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Of scheduled pickups
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Avg Items/Pickup</p>
          <p className="mt-1 text-3xl font-bold text-blue-500">
            {stats.totalPickups > 0
              ? (stats.totalItems / stats.totalPickups).toFixed(1)
              : 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Devices per request
          </p>
        </div>
      </div>

      {/* Charts */}
      <AnalyticsCharts
        categoryBreakdown={categoryBreakdown}
        statusBreakdown={statusBreakdown}
      />

      {/* Summary */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold">Summary</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium">Platform Growth</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {stats.activeUsers} registered users</li>
              <li>• {stats.totalPickups} total pickups</li>
              <li>• {stats.completedPickups} completed successfully</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Environmental Impact</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• {stats.totalCo2Saved}kg CO₂ diverted</li>
              <li>• {stats.totalItems} devices recycled</li>
              <li>• Equivalent to {Math.round(stats.totalCo2Saved / 21)} trees planted</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
