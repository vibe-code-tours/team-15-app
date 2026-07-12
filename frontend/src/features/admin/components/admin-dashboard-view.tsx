import { Package, Users, TrendingUp, Leaf } from "lucide-react"
import { MetricCards } from "@/features/admin/components/metric-cards"
import type { AdminStats } from "@/features/admin/types"

type AdminDashboardViewProps = {
  stats: AdminStats
}

export function AdminDashboardView({ stats }: AdminDashboardViewProps) {
  const metrics = [
    {
      label: "Total Listings",
      value: stats.totalPickups,
      icon: Package,
      description: "All items listed",
      color: "text-blue-500",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      description: "Registered users",
      color: "text-green-500",
    },
    {
      label: "Completed",
      value: stats.completedPickups,
      icon: TrendingUp,
      description: "Successfully rehomed",
      color: "text-purple-500",
    },
    {
      label: "CO₂ Saved",
      value: `${stats.totalCo2Saved}kg`,
      icon: Leaf,
      description: "Environmental impact",
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of platform activity and key metrics.
        </p>
      </div>

      <MetricCards metrics={metrics} />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold">Recent Pickups</h2>
        {stats.recentPickups.length === 0 ? (
          <p className="text-muted-foreground">No pickups yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentPickups.map((pickup) => (
              <div
                key={pickup.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div>
                  <p className="font-medium">{pickup.deviceName}</p>
                  <p className="text-sm text-muted-foreground">
                    {pickup.category} • {pickup.userName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{pickup.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(pickup.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
