"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Clock, MapPin, Loader2, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRequestedItems } from "@/features/account/services/account"
import type { Pickup } from "@/features/pickups/types"

export function RequestedItemsFull() {
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/account">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 size-4" />
            Back to Account
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Requested Items</h1>
        <p className="mt-2 text-muted-foreground">
          All items you have requested from other donors.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-8">
            <Package className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No requested items</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Items you request from other donors will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{item.deviceName}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "requested"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "accepted"
                          ? "bg-green-100 text-green-800"
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
