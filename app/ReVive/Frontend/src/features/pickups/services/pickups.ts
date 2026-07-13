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
  status: string
  requestedBy: string | null
  requestedPickupFrom: string | null
  requestedPickupTo: string | null
  requestedTimeSlot: string | null
  createdAt: string
}

/** Get current user's own listings */
export async function getPickups(): Promise<Pickup[]> {
  const data = await apiGet<{ items: Pickup[]; total: number }>("/api/pickups/")
  return data.items
}

/** Create a new listing */
export async function createPickup(input: PickupInput) {
  const result = await apiPost<{ success: boolean }, PickupInput>(
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

/** Donor accepts a request on their listing */
export async function acceptRequest(id: number) {
  await apiPatch(`/api/pickups/${id}`, { action: "accept" })
  return { success: true }
}

/** Donor declines a request */
export async function declineRequest(id: number) {
  await apiPatch(`/api/pickups/${id}`, { action: "decline" })
  return { success: true }
}
