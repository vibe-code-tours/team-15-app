"use client"

import { X, MapPin, Calendar, Clock, Package, User } from "lucide-react"
import { PickupStatusBadge } from "./pickup-status-badge"
import { Button } from "@/components/ui/button"
import { completePickup, cancelPickup } from "@/features/pickups/services/pickups"

interface Pickup {
  id: number
  userId: string
  category: string
  deviceName: string
  quantity: number
  condition: string
  availableFrom: string
  availableTo: string
  timeSlot: string
  address: string
  notes: string | null
  status: string
  createdAt: string
  userName?: string
  userEmail?: string
}

export function PickupDetailModal({
  pickup,
  onClose,
}: {
  pickup: Pickup
  onClose: () => void
}) {
  const handleComplete = async () => {
    await completePickup(pickup.id)
    onClose()
  }

  const handleCancel = async () => {
    await cancelPickup(pickup.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{pickup.deviceName}</h2>
              <p className="text-sm text-muted-foreground">{pickup.category}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <User className="size-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{pickup.userName || "Unknown User"}</p>
              <p className="text-muted-foreground">{pickup.userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {new Date(pickup.availableFrom).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} – {new Date(pickup.availableTo).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-muted-foreground">{pickup.timeSlot}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <MapPin className="mt-0.5 size-4 text-muted-foreground" />
            <p className="font-medium">{pickup.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Quantity</p>
              <p className="font-medium">{pickup.quantity} items</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Condition</p>
              <p className="font-medium capitalize">{pickup.condition}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <PickupStatusBadge status={pickup.status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
              <p className="font-medium">
                {new Date(pickup.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {pickup.notes && (
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="mb-1 text-xs text-muted-foreground">Notes</p>
              <p className="text-sm">{pickup.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {pickup.status === "scheduled" && (
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel Pickup
            </Button>
            <Button className="flex-1" onClick={handleComplete}>
              Mark Completed
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
