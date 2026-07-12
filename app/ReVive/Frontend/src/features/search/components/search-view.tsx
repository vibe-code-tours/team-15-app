"use client"

import { useState, useEffect, useCallback } from "react"
import { SearchBar } from "@/features/search/components/search-bar"
import { FilterPanel } from "@/features/search/components/filter-panel"
import { FilterChips } from "@/features/search/components/filter-chips"
import { SearchResults } from "@/features/search/components/search-results"
import { apiPost, apiGet } from "@/lib/api/client"
import { DEFAULT_FILTERS } from "@/features/search/types"
import type { SearchFilters, SearchResult, SearchStats } from "@/features/search/types"

export function SearchView() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [results, setResults] = useState<SearchResult[]>([])
  const [stats, setStats] = useState<SearchStats | null>(null)
  const [searchStats, setSearchStats] = useState<{
    byStatus: Record<string, number>
    byCategory: Record<string, number>
    byCondition: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const performSearch = useCallback(async (currentFilters: SearchFilters, currentPage: number) => {
    setLoading(true)
    try {
      const data = await apiPost<{
        results: SearchResult[]
        total: number
        page: number
        totalPages: number
      }>("/api/search/", {
        filters: {
          query: currentFilters.query,
          status: currentFilters.status,
          categories: currentFilters.categories,
          dateFrom: currentFilters.dateFrom,
          dateTo: currentFilters.dateTo,
          condition: currentFilters.condition,
          sortBy: currentFilters.sortBy,
          sortOrder: currentFilters.sortOrder,
        },
        page: currentPage,
        limit: 10,
      })
      setResults(data.results)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiGet<{
        byStatus: Record<string, number>
        byCategory: Record<string, number>
        byCondition: Record<string, number>
        totalPickups: number
      }>("/api/search/stats")
      setSearchStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    performSearch(filters, page)
  }, [filters, page, performSearch])

  const handleSearch = () => {
    setPage(1)
    performSearch(filters, 1)
  }

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleRemoveFilter = (filter: { id: string; type: string; label: string }) => {
    switch (filter.type) {
      case "status":
        setFilters((prev) => ({
          ...prev,
          status: prev.status.filter((s) => s !== filter.id),
        }))
        break
      case "category":
        setFilters((prev) => ({
          ...prev,
          categories: prev.categories.filter((c) => c !== filter.id),
        }))
        break
      case "condition":
        setFilters((prev) => ({
          ...prev,
          condition: prev.condition.filter((c) => c !== filter.id),
        }))
        break
      case "date":
        if (filter.id === "dateFrom") {
          setFilters((prev) => ({ ...prev, dateFrom: null }))
        } else {
          setFilters((prev) => ({ ...prev, dateTo: null }))
        }
        break
    }
  }

  const handleClearAllFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      query: filters.query,
    })
  }

  const activeFilters = [
    ...filters.status.map((s) => ({
      id: s,
      label: `Status: ${s}`,
      type: "status" as const,
    })),
    ...filters.categories.map((c) => ({
      id: c,
      label: `Category: ${c}`,
      type: "category" as const,
    })),
    ...filters.condition.map((c) => ({
      id: c,
      label: `Condition: ${c}`,
      type: "condition" as const,
    })),
    ...(filters.dateFrom
      ? [{ id: "dateFrom", label: `From: ${filters.dateFrom}`, type: "date" as const }]
      : []),
    ...(filters.dateTo
      ? [{ id: "dateTo", label: `To: ${filters.dateTo}`, type: "date" as const }]
      : []),
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Listings</h1>
        <p className="mt-2 text-muted-foreground">
          Find and filter your listed items.
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={filters.query}
          onChange={(query) => setFilters({ ...filters, query })}
          onSearch={handleSearch}
          onClear={handleClear}
          isLoading={loading}
        />
      </div>

      <div className="mb-6">
        <FilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      </div>

      <div className="mb-6">
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          stats={searchStats || undefined}
        />
      </div>

      <SearchResults
        results={results}
        query={filters.query}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </main>
  )
}
