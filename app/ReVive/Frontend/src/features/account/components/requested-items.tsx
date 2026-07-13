"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Clock, MapPin, Loader2, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getRequestedItems } from "@/features/account/services/account"
import type { Pickup } from "@/features/pickups/types"

const MAX_ITEMS = 3

export function RequestedItems() {
  const [items, setItems] = useState<Pickup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getRequestedItems()
        setItems(data)
      } catch (error) {
        console.error("Failed to fetch requested items:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Package className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No requested items</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Items you request from other donors will appear here.
          </p>
        </div>
      </Card>
    )
  }

  const displayItems = items.slice(0, MAX_ITEMS)
  const hasMore = items.length > MAX_ITEMS

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Requested Items</h3>
        {hasMore && (
          <Link
            href="/account/requested"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All ({items.length})
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{item.deviceName}</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    item.status === "requested"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Package className="size-3" />
                  {item.category}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {item.address}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {item.availableFrom} – {item.availableTo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
