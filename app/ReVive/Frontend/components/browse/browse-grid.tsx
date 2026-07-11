"use client"

import { useState } from "react"
import { MapPin, Clock, Package, User, Loader2 } from "lucide-react"
import { categoryLabel, conditionLabel } from "@/lib/categories"
import { requestItem } from "@/app/actions/browse"
import type { BrowseItem } from "@/lib/search/types"

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

interface BrowseGridProps {
  items: BrowseItem[]
}

export function BrowseGrid({ items }: BrowseGridProps) {
  const [requestingId, setRequestingId] = useState<number | null>(null)
  const [requestedIds, setRequestedIds] = useState<Set<number>>(new Set())
  const [errorId, setErrorId] = useState<number | null>(null)

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <Package className="mx-auto size-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No items available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back later or adjust your filters.
        </p>
      </div>
    )
  }

  const handleRequest = async (itemId: number) => {
    setRequestingId(itemId)
    setErrorId(null)
    const result = await requestItem(itemId)
    if (result?.error) {
      setErrorId(itemId)
      setRequestingId(null)
      return
    }
    setRequestedIds((prev) => new Set(prev).add(itemId))
    setRequestingId(null)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const isRequested = requestedIds.has(item.id)
        const isRequesting = requestingId === item.id
        const hasError = errorId === item.id

        return (
          <div
            key={item.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/30"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold">
                  {item.deviceName}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {categoryLabel(item.category)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {conditionLabel(item.condition)}
              </span>
            </div>

            {/* Quantity */}
            {item.quantity > 1 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Qty: {item.quantity}
              </p>
            )}

            {/* Meta */}
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{item.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="size-3.5 shrink-0" />
                <span>Listed by {item.donorName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 shrink-0" />
                <span>{timeAgo(item.createdAt)}</span>
              </div>
            </div>

            {/* Notes preview */}
            {item.notes && (
              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground/70 italic">
                &ldquo;{item.notes}&rdquo;
              </p>
            )}

            {/* Request button */}
            <div className="mt-auto pt-4">
              {isRequested ? (
                <div className="w-full rounded-lg bg-accent/10 py-2 text-center text-sm font-medium text-accent">
                  Request sent!
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRequest(item.id)}
                  disabled={isRequesting}
                  className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isRequesting ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="size-3.5 animate-spin" /> Requesting...
                    </span>
                  ) : (
                    "Request Item"
                  )}
                </button>
              )}
              {hasError && (
                <p className="mt-1.5 text-center text-xs text-destructive">
                  Could not request — item may no longer be available.
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
