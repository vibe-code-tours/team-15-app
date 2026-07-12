import { cn } from "@/lib/utils"

type Status = "available" | "requested" | "accepted" | "picked_up" | "cancelled"

const STATUS_STYLES: Record<Status, string> = {
  available: "bg-primary/15 text-primary",
  requested: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  accepted: "bg-accent/15 text-accent",
  picked_up: "bg-green-500/15 text-green-600 dark:text-green-400",
  cancelled: "bg-muted text-muted-foreground",
}

const STATUS_LABELS: Record<Status, string> = {
  available: "Available",
  requested: "Requested",
  accepted: "Accepted",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
}

export function PickupStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase().replace("-", "_") as Status
  const style = STATUS_STYLES[normalizedStatus] || STATUS_STYLES.available
  const label = STATUS_LABELS[normalizedStatus] || status

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style
      )}
    >
      {label}
    </span>
  )
}
