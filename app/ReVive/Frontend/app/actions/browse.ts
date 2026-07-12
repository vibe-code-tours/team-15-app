"use server"

import { apiPost } from "@/lib/api/client"
import type { BrowseFilters, BrowseResponse } from "@/lib/search/types"

/** Get available items from OTHER users (public browse) */
export async function getAvailableItems(
  filters: BrowseFilters,
  page: number = 1,
  limit: number = 12
): Promise<BrowseResponse> {
  const data = await apiPost<{
    results: BrowseResponse["results"]
    total: number
    page: number
    totalPages: number
  }>("/api/search/", {
    filters: {
      query: filters.query || "",
      status: ["available"],
      categories: filters.categories || [],
      dateFrom: null,
      dateTo: null,
      condition: filters.condition || [],
      sortBy: filters.sortBy === "oldest" ? "date" : "date",
      sortOrder: filters.sortBy === "oldest" ? "asc" : "desc",
    },
    page,
    limit,
  })

  return {
    results: data.results,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
  }
}

/** Request an item from another user */
export async function requestItem(listingId: number) {
  // Backend does not have a pickup request endpoint yet
  // This would need a new Backend endpoint
  return { error: "Item request not yet supported via Backend API" }
}
