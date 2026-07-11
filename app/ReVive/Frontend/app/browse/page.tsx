"use client"

import { useState, useEffect, useCallback } from "react"
import { AppHeader } from "@/components/app-header"
import { SearchBar } from "@/components/search/search-bar"
import { BrowseFilters } from "@/components/browse/browse-filters"
import { BrowseGrid } from "@/components/browse/browse-grid"
import { getAvailableItems } from "@/app/actions/browse"
import { DEFAULT_BROWSE_FILTERS } from "@/lib/search/types"
import type { BrowseFilters as BrowseFiltersType, BrowseItem } from "@/lib/search/types"

export default function BrowsePage() {
  const [filters, setFilters] = useState<BrowseFiltersType>(DEFAULT_BROWSE_FILTERS)
  const [items, setItems] = useState<BrowseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchItems = useCallback(async (f: BrowseFiltersType, p: number) => {
    setLoading(true)
    try {
      const data = await getAvailableItems(f, p, 12)
      setItems(data.results)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error("Failed to fetch items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems(filters, page)
  }, [filters, page, fetchItems])

  const handleSearch = () => {
    setPage(1)
    fetchItems(filters, 1)
  }

  const handleClear = () => {
    setFilters(DEFAULT_BROWSE_FILTERS)
    setPage(1)
  }

  const handleFiltersChange = (f: BrowseFiltersType) => {
    setFilters(f)
    setPage(1)
  }

  return (
    <div className="min-h-svh bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Browse Items</h1>
          <p className="mt-2 text-muted-foreground">
            Find electronics others are giving away in your community.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={filters.query}
            onChange={(query) => setFilters({ ...filters, query })}
            onSearch={handleSearch}
            onClear={handleClear}
            isLoading={loading}
            placeholder="Search devices, categories, locations..."
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BrowseFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {loading ? (
            "Loading..."
          ) : (
            <>
              {total} item{total !== 1 ? "s" : ""} available
              {filters.query && (
                <>
                  {" "}for &ldquo;<span className="font-medium text-foreground">{filters.query}</span>&rdquo;
                </>
              )}
            </>
          )}
        </div>

        {/* Grid */}
        <BrowseGrid items={items} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    page === pageNum
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
