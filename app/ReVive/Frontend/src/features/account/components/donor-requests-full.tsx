"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Clock, MapPin, User, Loader2, Check, X, ArrowLeft, Calendar, BadgeCheck, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDonorRequests, acceptRequest, rejectRequest } from "@/features/account/services/account"
import { timeSlotLabel } from "@/lib/categories"
import type { DonorRequest } from "@/features/account/services/account"
import type { PickupRequest } from "@/features/pickups/types"

export function DonorRequestsFull() {
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
      // Update local state: mark this request as accepted, others as rejected
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
      // Update local state: mark this request as rejected
      setRequests(
        requests.map((r) => {
          if (r.id !== pickupId) return r
          const updatedRequests = r.requests.map((req) =>
            req.id === requestId ? { ...req, status: "rejected" } : req
          )
          // If no pending requests remain, item goes back to available
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
        <h1 className="text-3xl font-bold tracking-tight">Incoming Requests</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all requests on your items. Multiple users can request the same item.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-8">
            <Package className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No incoming requests</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              When someone requests your items, they will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {requests.map((item) => {
            const pendingRequests = item.requests.filter((r) => r.status === "pending")
            const hasAccepted = item.requests.some((r) => r.status === "accepted")

            return (
              <Card key={item.id} className="p-5">
                {/* Item Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{item.deviceName}</h3>
                      {item.status === "accepted" && (
                        <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                          <BadgeCheck className="size-3.5" />
                          Accepted
                        </span>
                      )}
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

                  {/* Request count badge */}
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    <Users className="size-3.5" />
                    {item.requests.length} request{item.requests.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Requests List */}
                <div className="mt-4 space-y-3">
                  {item.requests.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      pickupId={item.id}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      processingId={processingId}
                      isAccepted={hasAccepted}
                    />
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function RequestCard({
  request,
  pickupId,
  onAccept,
  onReject,
  processingId,
  isAccepted,
}: {
  request: PickupRequest
  pickupId: number
  onAccept: (pickupId: number, requestId: number) => void
  onReject: (pickupId: number, requestId: number) => void
  processingId: number | null
  isAccepted: boolean
}) {
  const isProcessing = processingId === request.id
  const isPending = request.status === "pending"

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        request.status === "accepted"
          ? "border-green-500/30 bg-green-500/5"
          : request.status === "rejected"
          ? "border-muted bg-muted/30 opacity-60"
          : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Requester Info */}
          {request.requester && (
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{request.requester.name}</p>
                <p className="text-xs text-muted-foreground">{request.requester.email}</p>
              </div>
            </div>
          )}

          {/* Requester's Preferred Pickup Details */}
          {(request.pickupFrom || request.timeSlot) && (
            <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
              <p className="text-xs font-medium text-primary mb-1">Requested Pick-up</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
        </div>

        {/* Status / Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {request.status === "accepted" ? (
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
              <BadgeCheck className="size-3.5" />
              Accepted
            </span>
          ) : request.status === "rejected" ? (
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Rejected
            </span>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(pickupId, request.id)}
                disabled={isProcessing}
                className="text-destructive hover:text-destructive"
              >
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <X className="size-4" />
                )}
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onAccept(pickupId, request.id)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                Accept
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
