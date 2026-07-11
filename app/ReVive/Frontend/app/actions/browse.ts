"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pickups, user } from "@/lib/db/schema"
import { and, desc, eq, ne, like, or, sql, count, asc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import type { BrowseFilters, BrowseResponse, BrowseItem } from "@/lib/search/types"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

/** Get available items from OTHER users (public browse) */
export async function getAvailableItems(
  filters: BrowseFilters,
  page: number = 1,
  limit: number = 12
): Promise<BrowseResponse> {
  const currentUserId = await getUserId()
  const offset = (page - 1) * limit

  // Build conditions
  const conditions = [
    eq(pickups.status, "available"),
    ne(pickups.userId, currentUserId),
  ]

  // Text search
  if (filters.query) {
    const searchTerm = `%${filters.query}%`
    conditions.push(
      or(
        like(pickups.deviceName, searchTerm),
        like(pickups.category, searchTerm),
        like(pickups.address, searchTerm),
        like(pickups.notes, searchTerm)
      )!
    )
  }

  // Category filter
  if (filters.categories.length > 0) {
    conditions.push(
      sql`${pickups.category} IN (${sql.join(
        filters.categories.map((c) => sql`${c}`),
        sql`, `
      )})`
    )
  }

  // Condition filter
  if (filters.condition.length > 0) {
    conditions.push(
      sql`${pickups.condition} IN (${sql.join(
        filters.condition.map((c) => sql`${c}`),
        sql`, `
      )})`
    )
  }

  const whereClause = and(...conditions)

  // Sort
  const orderBy = filters.sortBy === "oldest"
    ? asc(pickups.createdAt)
    : desc(pickups.createdAt)

  // Fetch items with donor name
  const results = await db
    .select({
      id: pickups.id,
      category: pickups.category,
      deviceName: pickups.deviceName,
      quantity: pickups.quantity,
      condition: pickups.condition,
      address: pickups.address,
      notes: pickups.notes,
      status: pickups.status,
      createdAt: pickups.createdAt,
      donorName: user.name,
    })
    .from(pickups)
    .innerJoin(user, eq(pickups.userId, user.id))
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)

  // Total count
  const countResult = await db
    .select({ count: count() })
    .from(pickups)
    .innerJoin(user, eq(pickups.userId, user.id))
    .where(whereClause)

  const total = countResult[0]?.count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    results: results as BrowseItem[],
    total,
    page,
    totalPages,
  }
}

/** Request an item from another user — changes status to "requested" */
export async function requestItem(listingId: number) {
  const currentUserId = await getUserId()

  // Verify the listing exists, is available, and belongs to someone else
  const listing = await db
    .select()
    .from(pickups)
    .where(eq(pickups.id, listingId))
    .limit(1)

  if (!listing.length) {
    return { error: "Item not found." }
  }

  if (listing[0].userId === currentUserId) {
    return { error: "You can't request your own item." }
  }

  if (listing[0].status !== "available") {
    return { error: "This item is no longer available." }
  }

  await db
    .update(pickups)
    .set({ status: "requested" })
    .where(eq(pickups.id, listingId))

  revalidatePath("/browse")
  revalidatePath("/dashboard")
  return { success: true }
}
