import { db } from "@/lib/db"
import { pickups } from "@/lib/db/schema"
import { eq, and, or, like, desc, asc, sql, gte, lte, count } from "drizzle-orm"
import type { SearchFilters, SearchOptions, SearchResponse, SearchResult } from "./types"

export async function searchPickups(
  userId: string,
  filters: SearchFilters,
  options: SearchOptions
): Promise<SearchResponse> {
  const { page, limit } = options
  const offset = (page - 1) * limit

  // Build conditions array
  const conditions = [eq(pickups.userId, userId)]

  // Text search across multiple fields
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

  // Status filter
  if (filters.status.length > 0) {
    conditions.push(
      sql`${pickups.status} IN (${sql.join(
        filters.status.map((s) => sql`${s}`),
        sql`, `
      )})`
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

  // Date range filter
  if (filters.dateFrom) {
    conditions.push(gte(pickups.pickupDate, filters.dateFrom))
  }
  if (filters.dateTo) {
    conditions.push(lte(pickups.pickupDate, filters.dateTo))
  }

  // Combine all conditions
  const whereClause = and(...conditions)

  // Determine sort order
  const orderBy =
    filters.sortOrder === "desc"
      ? filters.sortBy === "name"
        ? desc(pickups.deviceName)
        : filters.sortBy === "status"
          ? desc(pickups.status)
          : desc(pickups.createdAt)
      : filters.sortBy === "name"
        ? asc(pickups.deviceName)
        : filters.sortBy === "status"
          ? asc(pickups.status)
          : asc(pickups.createdAt)

  // Execute search query
  const searchResults = await db
    .select()
    .from(pickups)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)

  // Get total count for pagination
  const countResult = await db
    .select({ count: count() })
    .from(pickups)
    .where(whereClause)

  const total = countResult[0]?.count || 0
  const totalPages = Math.ceil(total / limit)

  // Add match highlights
  const resultsWithHighlights = searchResults.map((result) => ({
    ...result,
    matchHighlights: getMatchHighlights(result, filters.query),
  }))

  return {
    results: resultsWithHighlights,
    total,
    page,
    totalPages,
  }
}

function getMatchHighlights(
  result: SearchResult,
  query: string
): SearchResult["matchHighlights"] {
  if (!query) return undefined

  const lowerQuery = query.toLowerCase()
  return {
    deviceName: result.deviceName.toLowerCase().includes(lowerQuery),
    category: result.category.toLowerCase().includes(lowerQuery),
    address: result.address.toLowerCase().includes(lowerQuery),
  }
}

export async function getSearchStats(userId: string) {
  // Get status breakdown
  const statusBreakdown = await db
    .select({
      status: pickups.status,
      count: count(),
    })
    .from(pickups)
    .where(eq(pickups.userId, userId))
    .groupBy(pickups.status)

  // Get category breakdown
  const categoryBreakdown = await db
    .select({
      category: pickups.category,
      count: count(),
    })
    .from(pickups)
    .where(eq(pickups.userId, userId))
    .groupBy(pickups.category)

  // Get condition breakdown
  const conditionBreakdown = await db
    .select({
      condition: pickups.condition,
      count: count(),
    })
    .from(pickups)
    .where(eq(pickups.userId, userId))
    .groupBy(pickups.condition)

  return {
    byStatus: statusBreakdown.reduce(
      (acc, item) => ({ ...acc, [item.status]: item.count }),
      {} as Record<string, number>
    ),
    byCategory: categoryBreakdown.reduce(
      (acc, item) => ({ ...acc, [item.category]: item.count }),
      {} as Record<string, number>
    ),
    byCondition: conditionBreakdown.reduce(
      (acc, item) => ({ ...acc, [item.condition]: item.count }),
      {} as Record<string, number>
    ),
    totalPickups: statusBreakdown.reduce((sum, item) => sum + item.count, 0),
  }
}

export function highlightText(text: string, query: string): string {
  if (!query) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  let result = ""
  let startIndex = 0

  while (true) {
    const index = lowerText.indexOf(lowerQuery, startIndex)
    if (index === -1) {
      result += text.substring(startIndex)
      break
    }
    if (index > startIndex) {
      result += text.substring(startIndex, index)
    }
    const match = text.substring(index, index + query.length)
    result += `<mark>${match}</mark>`
    startIndex = index + query.length
  }

  return result
}
