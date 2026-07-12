"use server"

import { apiPost, apiPatch } from "@/lib/api/client"
import type { BrowseFilters, BrowseResponse } from "@/features/search/types"

/** Get available items from OTHER users (public browse) */
export async function getAvailableItems(
  filters: BrowseFilters,
  page: number = 1,
  limit: number = 12
): Promise<BrowseResponse> {
  const data = await apiPost<{
    items: BrowseResponse["results"]
    total: number
    page: number
    totalPages: number
  }>("/api/browse/", {
    filters: {
      query: filters.query || "",
      categories: filters.categories || [],
      condition: filters.condition || [],
      location: filters.location || "",
      sortBy: filters.sortBy || "newest",
    },
    page,
    limit,
  })

  return {
    results: data.items,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
  }
}

/** Request an item from another user */
export async function requestItem(listingId: number) {
  const result = await apiPatch<{ success: boolean }, { action: string }>(
    `/api/pickups/${listingId}`,
    { action: "request" }
  )
  return { success: true }
}
