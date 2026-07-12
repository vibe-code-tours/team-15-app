"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Clock, MapPin, User, Loader2, Check, X, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDonorRequests, acceptRequest, rejectRequest } from "@/features/account/services/account"
import type { DonorRequest } from "@/features/account/services/account"

const MAX_ITEMS = 3

export function DonorRequests() {
  const [requests, setRequests] = useState<DonorRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    try {
      const data = await getDonorRequests()
      setRequests(data)
    } catch (error) {
      console.error("Failed to fetch donor requests:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept(pickupId: number) {
    setProcessingId(pickupId)
    try {
      await acceptRequest(pickupId)
      setRequests(requests.filter((r) => r.id !== pickupId))
    } catch (error) {
      console.error("Failed to accept request:", error)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleReject(pickupId: number) {
    setProcessingId(pickupId)
    try {
      await rejectRequest(pickupId)
      setRequests(requests.filter((r) => r.id !== pickupId))
    } catch (error) {
      console.error("Failed to reject request:", error)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  if (requests.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Package className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No incoming requests</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            When someone requests your items, they will appear here.
          </p>
        </div>
      </Card>
    )
  }

  const displayItems = requests.slice(0, MAX_ITEMS)
  const hasMore = requests.length > MAX_ITEMS

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Incoming Requests</h3>
        {hasMore && (
          <Link
            href="/account/requests"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All ({requests.length})
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="space-y-3">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-background p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{item.deviceName}</p>
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
                    {item.pickupDate}
                  </span>
                </div>

                {/* Requester Info */}
                {item.requester && (
                  <div className="mt-3 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                    <User className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.requester.name}</p>
                      <p className="text-xs text-muted-foreground">{item.requester.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(item.id)}
                  disabled={processingId === item.id}
                  className="text-destructive hover:text-destructive"
                >
                  {processingId === item.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <X className="size-4" />
                  )}
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAccept(item.id)}
                  disabled={processingId === item.id}
                >
                  {processingId === item.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Accept
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
