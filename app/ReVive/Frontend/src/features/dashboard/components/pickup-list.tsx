"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Package, Trash2, X, Check, User, BadgeCheck, Users } from "lucide-react"
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
import type { Pickup, PickupRequest } from "@/features/pickups/services/pickups"

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
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

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

  const doAction = (id: string, action: () => Promise<unknown>) => {
    setBusyId(id)
    startTransition(async () => {
      await action()
      setBusyId(null)
      router.refresh()
    })
  }

  return (
    <div className="grid gap-4">
      {pickups.map((p, i) => {
        const pendingRequests = p.requests?.filter((r) => r.status === "pending") ?? []
        const acceptedRequest = p.requests?.find((r) => r.status === "accepted")

        return (
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
                    {(p.status === "requested" || p.status === "accepted") && p.requests && p.requests.length > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <Users className="size-3" />
                        {p.requests.length}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {categoryLabel(p.category)} · Qty {p.quantity} · {conditionLabel(p.condition)}
                  </p>

                  {/* Item Images */}
                  {p.images && p.images.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {p.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border"
                        >
                          <img
                            src={img}
                            alt={`${p.deviceName} photo ${idx + 1}`}
                            className="size-full object-cover"
                          />
                          {idx === 0 && p.images!.length > 1 && (
                            <span className="absolute bottom-0.5 left-0.5 rounded bg-primary px-1 py-0.5 text-[9px] font-medium text-primary-foreground">
                              +{p.images!.length - 1}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="size-4 shrink-0 text-primary" />
                      <span>{formatDate(p.availableFrom)} – {formatDate(p.availableTo)}</span>
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

                  {/* Show accepted request */}
                  {acceptedRequest && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                        <BadgeCheck className="size-3.5" />
                        Accepted request
                      </div>
                      {acceptedRequest.requester && (
                        <div className="flex items-center gap-2 rounded-md bg-green-500/5 px-3 py-2">
                          <User className="size-3.5 text-muted-foreground" />
                          <span className="text-sm">{acceptedRequest.requester.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show pending requests */}
                  {pendingRequests.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        {pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""}
                      </p>
                      {pendingRequests.map((req) => (
                        <RequestRow
                          key={req.id}
                          request={req}
                          busyId={busyId}
                          onAccept={(reqId) => doAction(`${p.id}-${reqId}`, () => acceptRequest(p.id, reqId))}
                          onReject={(reqId) => doAction(`${p.id}-${reqId}`, () => declineRequest(p.id, reqId))}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions based on status */}
                <div className="flex shrink-0 flex-col gap-2">
                  {p.status === "available" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending && busyId === String(p.id)}
                      onClick={() => doAction(String(p.id), () => cancelPickup(p.id))}
                    >
                      <X className="size-4" /> Remove
                    </Button>
                  )}

                  {p.status === "accepted" && (
                    <Button
                      size="sm"
                      disabled={isPending && busyId === String(p.id)}
                      onClick={() => doAction(String(p.id), () => completePickup(p.id))}
                    >
                      <Check className="size-4" /> Picked Up
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending && busyId === String(p.id)}
                    onClick={() => doAction(String(p.id), () => deletePickup(p.id))}
                    aria-label="Delete listing"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function RequestRow({
  request,
  busyId,
  onAccept,
  onReject,
}: {
  request: PickupRequest
  busyId: string | null
  onAccept: (requestId: number) => void
  onReject: (requestId: number) => void
}) {
  const isProcessing = busyId === `${request.pickupId}-${request.id}`

  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <User className="size-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{request.requester?.name ?? "Unknown"}</p>
          {(request.pickupFrom || request.timeSlot) && (
            <p className="text-xs text-muted-foreground truncate">
              {request.pickupFrom && request.pickupTo
                ? `${request.pickupFrom} – ${request.pickupTo}`
                : ""}
              {request.pickupFrom && request.timeSlot ? " · " : ""}
              {request.timeSlot ? timeSlotLabel(request.timeSlot) : ""}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          disabled={isProcessing}
          onClick={() => onReject(request.id)}
          className="text-destructive hover:text-destructive h-7 px-2"
        >
          <X className="size-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={isProcessing}
          onClick={() => onAccept(request.id)}
          className="text-green-600 hover:text-green-600 h-7 px-2"
        >
          <Check className="size-3" />
        </Button>
      </div>
    </div>
  )
}
