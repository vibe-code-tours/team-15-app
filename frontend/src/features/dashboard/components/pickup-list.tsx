"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Package, Trash2, X, Check, User } from "lucide-react"
import {
  cancelPickup,
  deletePickup,
  completePickup,
  acceptRequest,
  declineRequest,
} from "@/features/pickups/services/pickups"
import { categoryLabel, conditionLabel, timeSlotLabel } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Pickup = {
  id: number
  category: string
  deviceName: string
  quantity: number
  condition: string
  pickupDate: string
  timeSlot: string
  address: string
  notes: string | null
  status: string
}

const STATUS_STYLES: Record<string, string> = {
  available: "bg-primary/15 text-primary",
  requested: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  accepted: "bg-accent/15 text-accent",
  picked_up: "bg-green-500/15 text-green-600 dark:text-green-400",
  cancelled: "bg-muted text-muted-foreground",
}

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  requested: "Requested",
  accepted: "Accepted",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function PickupList({ pickups }: { pickups: Pickup[] }) {
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<number | null>(null)

  if (pickups.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Package className="size-7" />
        </span>
        <h3 className="mt-5 text-lg font-semibold">No listings yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Once you list an item, it will show up here so you can track who&apos;s interested.
        </p>
        <a href="/donate" className="mt-6 inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          List your first item
        </a>
      </Card>
    )
  }

  const doAction = (id: number, action: () => Promise<unknown>) => {
    setBusyId(id)
    startTransition(async () => {
      await action()
      setBusyId(null)
    })
  }

  return (
    <div className="grid gap-4">
      {pickups.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-lg font-semibold">{p.deviceName}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_STYLES[p.status] ?? STATUS_STYLES.available
                    }`}
                  >
                    {STATUS_LABELS[p.status] ?? p.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {categoryLabel(p.category)} · Qty {p.quantity} · {conditionLabel(p.condition)}
                </p>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4 shrink-0 text-primary" />
                    <span>{formatDate(p.pickupDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4 shrink-0 text-primary" />
                    <span>{timeSlotLabel(p.timeSlot)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-pretty">{p.address}</span>
                  </div>
                </dl>
              </div>

              {/* Actions based on status */}
              <div className="flex shrink-0 flex-col gap-2">
                {p.status === "available" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending && busyId === p.id}
                    onClick={() => doAction(p.id, () => cancelPickup(p.id))}
                  >
                    <X className="size-4" /> Remove
                  </Button>
                )}

                {p.status === "requested" && (
                  <>
                    <Button
                      size="sm"
                      disabled={isPending && busyId === p.id}
                      onClick={() => doAction(p.id, () => acceptRequest(p.id))}
                    >
                      <Check className="size-4" /> Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending && busyId === p.id}
                      onClick={() => doAction(p.id, () => declineRequest(p.id))}
                    >
                      <X className="size-4" /> Decline
                    </Button>
                  </>
                )}

                {p.status === "accepted" && (
                  <Button
                    size="sm"
                    disabled={isPending && busyId === p.id}
                    onClick={() => doAction(p.id, () => completePickup(p.id))}
                  >
                    <Check className="size-4" /> Picked Up
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending && busyId === p.id}
                  onClick={() => doAction(p.id, () => deletePickup(p.id))}
                  aria-label="Delete listing"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
