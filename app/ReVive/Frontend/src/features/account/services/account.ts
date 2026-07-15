"use server"

import { apiGet, apiPatch } from "@/lib/api/client"
import type { Pickup, PickupRequest } from "@/features/pickups/types"

export type DonorRequest = Pickup & {
  requests: PickupRequest[]
}

/** Get pickups that the user has requested from other donors */
export async function getRequestedItems(): Promise<(Pickup & { request: PickupRequest })[]> {
  const data = await apiGet<(Pickup & { request: PickupRequest })[]>("/api/pickups/requested")
  return Array.isArray(data) ? data : []
}

/** Get pickups where other users have made requests (donor view with all requests) */
export async function getDonorRequests(): Promise<DonorRequest[]> {
  const data = await apiGet<DonorRequest[]>("/api/pickups/donor-requests")
  return Array.isArray(data) ? data : []
}

/** Accept a specific request on donor's item */
export async function acceptRequest(pickupId: number, requestId: number) {
  await apiPatch(`/api/pickups/${pickupId}`, { action: "accept", requestId })
  return { success: true }
}

/** Reject a specific request on donor's item */
export async function rejectRequest(pickupId: number, requestId: number) {
  await apiPatch(`/api/pickups/${pickupId}`, { action: "reject", requestId })
  return { success: true }
}
