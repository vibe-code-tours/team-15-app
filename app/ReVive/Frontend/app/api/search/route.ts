import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { searchPickups } from "@/lib/search/query-builder"
import type { SearchFilters } from "@/lib/search/types"
import { DEFAULT_FILTERS } from "@/lib/search/types"

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      filters = DEFAULT_FILTERS,
      page = 1,
      limit = 10,
    } = body

    // Validate and sanitize filters
    const sanitizedFilters: SearchFilters = {
      query: typeof filters.query === "string" ? filters.query.slice(0, 200) : "",
      status: Array.isArray(filters.status)
        ? filters.status.filter((s: string) =>
            ["available", "requested", "accepted", "picked_up", "cancelled"].includes(s)
          )
        : [],
      categories: Array.isArray(filters.categories)
        ? filters.categories.filter((c: string) => typeof c === "string")
        : [],
      dateFrom: filters.dateFrom || null,
      dateTo: filters.dateTo || null,
      condition: Array.isArray(filters.condition)
        ? filters.condition.filter((c: string) =>
            ["working", "partial", "broken"].includes(c)
          )
        : [],
      sortBy: ["date", "name", "status"].includes(filters.sortBy)
        ? filters.sortBy
        : "date",
      sortOrder: ["asc", "desc"].includes(filters.sortOrder)
        ? filters.sortOrder
        : "desc",
    }

    // Validate pagination
    const sanitizedPage = Math.max(1, Math.floor(Number(page)) || 1)
    const sanitizedLimit = Math.min(50, Math.max(1, Math.floor(Number(limit)) || 10))

    const results = await searchPickups(
      session.user.id,
      sanitizedFilters,
      {
        page: sanitizedPage,
        limit: sanitizedLimit,
        includeStats: true,
      }
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
