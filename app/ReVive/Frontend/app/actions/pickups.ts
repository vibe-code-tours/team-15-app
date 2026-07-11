"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pickups, impactEvents, user } from "@/lib/db/schema"
import { and, desc, eq, ne } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { awardDoubleImpactPoints } from "./referrals"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export type PickupInput = {
  category: string
  deviceName: string
  quantity: number
  condition: string
  pickupDate: string
  timeSlot: string
  address: string
  notes?: string
}

/** Get current user's own listings */
export async function getPickups() {
  const userId = await getUserId()
  return db
    .select()
    .from(pickups)
    .where(eq(pickups.userId, userId))
    .orderBy(desc(pickups.createdAt))
}

/** Create a new listing — status starts as "available" for others to find */
export async function createPickup(input: PickupInput) {
  const userId = await getUserId()

  const deviceName = input.deviceName.trim()
  const address = input.address.trim()

  if (!input.category || !deviceName || !input.pickupDate || !input.timeSlot || !address) {
    return { error: "Please fill in all required fields." }
  }

  const quantity = Number.isFinite(input.quantity) && input.quantity > 0 ? Math.floor(input.quantity) : 1

  await db.insert(pickups).values({
    userId,
    category: input.category,
    deviceName,
    quantity,
    condition: input.condition || "working",
    pickupDate: input.pickupDate,
    timeSlot: input.timeSlot,
    address,
    notes: input.notes?.trim() || null,
    status: "available",
    createdAt: new Date().toISOString(),
  })

  revalidatePath("/dashboard")
  revalidatePath("/browse")
  return { success: true }
}

/** Cancel a listing */
export async function cancelPickup(id: number) {
  const userId = await getUserId()
  await db
    .update(pickups)
    .set({ status: "cancelled" })
    .where(and(eq(pickups.id, id), eq(pickups.userId, userId)))
  revalidatePath("/dashboard")
  revalidatePath("/browse")
}

/** Delete a listing permanently */
export async function deletePickup(id: number) {
  const userId = await getUserId()
  await db.delete(pickups).where(and(eq(pickups.id, id), eq(pickups.userId, userId)))
  revalidatePath("/dashboard")
  revalidatePath("/browse")
}

/** Mark a listing as picked up (item exchanged) */
export async function completePickup(id: number) {
  const userId = await getUserId()

  await db
    .update(pickups)
    .set({ status: "picked_up" })
    .where(and(eq(pickups.id, id), eq(pickups.userId, userId)))

  await awardDoubleImpactPoints(userId, id)

  revalidatePath("/dashboard")
  revalidatePath("/referral")
  return { success: true }
}

/** Donor accepts a request on their listing */
export async function acceptRequest(id: number) {
  const userId = await getUserId()
  await db
    .update(pickups)
    .set({ status: "accepted" })
    .where(and(eq(pickups.id, id), eq(pickups.userId, userId)))
  revalidatePath("/dashboard")
  return { success: true }
}

/** Donor declines a request — revert to available */
export async function declineRequest(id: number) {
  const userId = await getUserId()
  await db
    .update(pickups)
    .set({ status: "available" })
    .where(and(eq(pickups.id, id), eq(pickups.userId, userId)))
  revalidatePath("/dashboard")
  return { success: true }
}
