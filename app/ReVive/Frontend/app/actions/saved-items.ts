"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { savedItems } from "@/lib/db/message-schema"
import { eq, and } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function saveItem(listingId: number) {
  const userId = await getUserId()

  // Check if already saved
  const existing = await db
    .select()
    .from(savedItems)
    .where(
      and(
        eq(savedItems.userId, userId),
        eq(savedItems.listingId, listingId)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    return { error: "Item already saved" }
  }

  // Save item
  await db.insert(savedItems).values({
    id: randomUUID(),
    userId,
    listingId,
    createdAt: new Date().toISOString(),
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function unsaveItem(listingId: number) {
  const userId = await getUserId()

  await db
    .delete(savedItems)
    .where(
      and(
        eq(savedItems.userId, userId),
        eq(savedItems.listingId, listingId)
      )
    )

  revalidatePath("/dashboard")
  return { success: true }
}

export async function isItemSaved(listingId: number) {
  const userId = await getUserId()

  const existing = await db
    .select()
    .from(savedItems)
    .where(
      and(
        eq(savedItems.userId, userId),
        eq(savedItems.listingId, listingId)
      )
    )
    .limit(1)

  return existing.length > 0
}

export async function getSavedItems() {
  const userId = await getUserId()

  return db
    .select()
    .from(savedItems)
    .where(eq(savedItems.userId, userId))
    .orderBy(savedItems.createdAt)
}
