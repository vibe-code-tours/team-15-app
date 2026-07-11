"use client"

interface CategoryBreakdown {
  category: string
  count: number
}

interface StatusBreakdown {
  status: string
  count: number
}

export function AnalyticsCharts({
  categoryBreakdown,
  statusBreakdown,
}: {
  categoryBreakdown: CategoryBreakdown[]
  statusBreakdown: StatusBreakdown[]
}) {
  const maxCategoryCount = Math.max(...categoryBreakdown.map((c) => c.count), 1)
  const maxStatusCount = Math.max(...statusBreakdown.map((s) => s.count), 1)

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Category Breakdown */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold">Pickups by Category</h2>
        {categoryBreakdown.length === 0 ? (
          <p className="text-muted-foreground">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {categoryBreakdown.map((item) => (
              <div key={item.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${(item.count / maxCategoryCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Status Breakdown */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold">Pickups by Status</h2>
        {statusBreakdown.length === 0 ? (
          <p className="text-muted-foreground">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {statusBreakdown.map((item) => (
              <div key={item.status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{item.status}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${
                      statusColors[item.status] || "bg-gray-500"
                    }`}
                    style={{
                      width: `${(item.count / maxStatusCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
