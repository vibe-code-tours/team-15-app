"use client"

import { X, Mail, Calendar, Award, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  name: string
  email: string
  createdAt: string
  pickupCount: number
  totalPoints: number
}

export function UserDetailModal({
  user,
  onClose,
}: {
  user: User
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Package className="mx-auto mb-2 size-5 text-muted-foreground" />
            <p className="text-2xl font-bold">{user.pickupCount}</p>
            <p className="text-xs text-muted-foreground">Total Pickups</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Award className="mx-auto mb-2 size-5 text-muted-foreground" />
            <p className="text-2xl font-bold">{user.totalPoints}</p>
            <p className="text-xs text-muted-foreground">Points Earned</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <span>
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
