"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Clock, MapPin, User, Loader2, Check, X, ArrowLeft, Calendar, BadgeCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDonorRequests, acceptRequest, rejectRequest } from "@/features/account/services/account"
import { timeSlotLabel } from "@/lib/categories"
import type { DonorRequest } from "@/features/account/services/account"

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

  async function handleAccept(pickupId: number) {
    setProcessingId(pickupId)
    try {
      await acceptRequest(pickupId)
      setRequests(
        requests.map((r) =>
          r.id === pickupId ? { ...r, status: "accepted" } : r
        )
      )
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
          View and manage all requests on your items.
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
        <div className="space-y-3">
          {requests.map((item) => (
            <Card key={item.id} className="p-4">
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
                      {item.availableFrom} – {item.availableTo}
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

                  {/* Requester's Preferred Pickup Details */}
                  {(item.requestedPickupFrom || item.requestedTimeSlot) && (
                    <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
                      <p className="text-xs font-medium text-primary mb-1">Requested Pick-up</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {item.requestedPickupFrom && item.requestedPickupTo && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {item.requestedPickupFrom} – {item.requestedPickupTo}
                          </span>
                        )}
                        {item.requestedTimeSlot && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {timeSlotLabel(item.requestedTimeSlot)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "accepted" ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                      <BadgeCheck className="size-3.5" />
                      Accepted
                    </span>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
