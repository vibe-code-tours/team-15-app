"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Clock, MapPin, User, Loader2, Check, X, ChevronRight, Calendar, BadgeCheck, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDonorRequests, acceptRequest, rejectRequest } from "@/features/account/services/account"
import { timeSlotLabel } from "@/lib/categories"
import type { DonorRequest } from "@/features/account/services/account"
import type { PickupRequest } from "@/features/pickups/types"

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

  async function handleAccept(pickupId: number, requestId: number) {
    setProcessingId(requestId)
    try {
      await acceptRequest(pickupId, requestId)
      setRequests(
        requests.map((r) => {
          if (r.id !== pickupId) return r
          return {
            ...r,
            requests: r.requests.map((req) =>
              req.id === requestId
                ? { ...req, status: "accepted" }
                : { ...req, status: "rejected" }
            ),
            status: "accepted",
          }
        })
      )
    } catch (error) {
      console.error("Failed to accept request:", error)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleReject(pickupId: number, requestId: number) {
    setProcessingId(requestId)
    try {
      await rejectRequest(pickupId, requestId)
      setRequests(
        requests.map((r) => {
          if (r.id !== pickupId) return r
          const updatedRequests = r.requests.map((req) =>
            req.id === requestId ? { ...req, status: "rejected" } : req
          )
          const hasPending = updatedRequests.some((req) => req.status === "pending")
          return {
            ...r,
            requests: updatedRequests,
            status: hasPending ? r.status : "available",
          }
        })
      )
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
        {displayItems.map((item) => {
          const pendingRequests = item.requests.filter((r) => r.status === "pending")
          const hasAccepted = item.requests.some((r) => r.status === "accepted")

          return (
            <div
              key={item.id}
              className="rounded-lg border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.deviceName}</p>
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <Users className="size-3" />
                      {item.requests.length}
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
                  </div>

                  {/* Show first pending request */}
                  {pendingRequests.length > 0 && (
                    <RequestSummary
                      request={pendingRequests[0]}
                      pickupId={item.id}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      processingId={processingId}
                    />
                  )}

                  {/* Show accepted request */}
                  {hasAccepted && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                      <BadgeCheck className="size-3.5" />
                      Request accepted
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function RequestSummary({
  request,
  pickupId,
  onAccept,
  onReject,
  processingId,
}: {
  request: PickupRequest
  pickupId: number
  onAccept: (pickupId: number, requestId: number) => void
  onReject: (pickupId: number, requestId: number) => void
  processingId: number | null
}) {
  const isProcessing = processingId === request.id

  return (
    <div className="mt-2 space-y-2">
      {request.requester && (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
          <User className="size-3.5 text-muted-foreground" />
          <span className="text-sm">{request.requester.name}</span>
        </div>
      )}
      {(request.pickupFrom || request.timeSlot) && (
        <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {request.pickupFrom && request.pickupTo && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {request.pickupFrom} – {request.pickupTo}
              </span>
            )}
            {request.timeSlot && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {timeSlotLabel(request.timeSlot)}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(pickupId, request.id)}
          disabled={isProcessing}
          className="text-destructive hover:text-destructive"
        >
          {isProcessing ? <Loader2 className="size-3 animate-spin" /> : <X className="size-3" />}
          Reject
        </Button>
        <Button
          size="sm"
          onClick={() => onAccept(pickupId, request.id)}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
          Accept
        </Button>
      </div>
    </div>
  )
}
