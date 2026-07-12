import type { LucideIcon } from "lucide-react"

interface Metric {
  label: string
  value: string | number
  icon: LucideIcon
  description: string
  color: string
}

export function MetricCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <metric.icon className={`size-5 ${metric.color}`} />
          </div>
          <p className="mt-2 text-3xl font-bold">{metric.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  )
}
