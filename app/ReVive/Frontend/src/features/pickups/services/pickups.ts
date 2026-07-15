"use server"

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/client"

export type PickupInput = {
  category: string
  deviceName: string
  quantity: number
  condition: string
  availableFrom: string
  availableTo: string
  timeSlot: string
  address: string
  notes?: string
  images?: string[]
}

export type PickupRequest = {
  id: number
  pickupId: number
  requesterId: string
  pickupFrom: string | null
  pickupTo: string | null
  timeSlot: string | null
  status: string
  createdAt: string
  requester?: {
    id: string
    name: string
    email: string
  } | null
}

export type Pickup = {
  id: number
  userId: string
  category: string
  deviceName: string
  quantity: number
  condition: string
  availableFrom: string
  availableTo: string
  timeSlot: string
  address: string
  notes: string | null
  images: string[] | null
  status: string
  createdAt: string
  requests?: PickupRequest[]
}

/** Get current user's own listings */
export async function getPickups(): Promise<Pickup[]> {
  const data = await apiGet<{ items: Pickup[]; total: number }>("/api/pickups/")
  return data.items
}

/** Create a new listing (pass image URLs, not File objects — server actions can't serialize Files) */
export async function createPickup(input: PickupInput) {
  const result = await apiPost<{ success: boolean }>(
    "/api/pickups/",
    {
      category: input.category,
      deviceName: input.deviceName,
      quantity: input.quantity || 1,
      condition: input.condition || "working",
      availableFrom: input.availableFrom,
      availableTo: input.availableTo,
      timeSlot: input.timeSlot,
      address: input.address,
      notes: input.notes,
      images: input.images,
    }
  )
  return { success: true }
}

/** Cancel a listing */
export async function cancelPickup(id: number) {
  await apiPatch(`/api/pickups/${id}`, { action: "cancel" })
}

/** Delete a listing permanently */
export async function deletePickup(id: number) {
  await apiDelete(`/api/pickups/${id}`)
}

/** Mark a listing as picked up */
export async function completePickup(id: number) {
  await apiPatch(`/api/pickups/${id}`, { action: "complete" })
  return { success: true }
}

/** Donor accepts a specific request on their listing */
export async function acceptRequest(pickupId: number, requestId: number) {
  await apiPatch(`/api/pickups/${pickupId}`, { action: "accept", requestId })
  return { success: true }
}

/** Donor rejects a specific request */
export async function declineRequest(pickupId: number, requestId: number) {
  await apiPatch(`/api/pickups/${pickupId}`, { action: "reject", requestId })
  return { success: true }
}
