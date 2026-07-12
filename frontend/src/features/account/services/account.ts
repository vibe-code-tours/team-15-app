"use server"

import { apiGet, apiPatch } from "@/lib/api/client"
import type { Pickup } from "@/features/pickups/types"

export type DonorRequest = Pickup & {
  requester: {
    id: string
    name: string
    email: string
  } | null
}

/** Get pickups that the user has requested from other donors */
export async function getRequestedItems(): Promise<Pickup[]> {
  const data = await apiGet<Pickup[]>("/api/pickups/requested")
  return Array.isArray(data) ? data : []
}

/** Get pickups where other users have made requests (donor view) */
export async function getDonorRequests(): Promise<DonorRequest[]> {
  const data = await apiGet<DonorRequest[]>("/api/pickups/donor-requests")
  return Array.isArray(data) ? data : []
}

/** Accept a request on donor's item */
export async function acceptRequest(pickupId: number) {
  await apiPatch(`/api/pickups/${pickupId}`, { action: "accept" })
  return { success: true }
}

/** Reject a request on donor's item */
export async function rejectRequest(pickupId: number) {
  await apiPatch(`/api/pickups/${pickupId}`, { action: "reject" })
  return { success: true }
}
