"use client"

import Link from "next/link"
import { ExternalLink, Package, MapPin, Calendar } from "lucide-react"
import { PickupStatusBadge } from "@/components/admin/pickup-status-badge"
import type { SearchResult } from "@/lib/search/types"

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function SearchResults({
  results,
  query,
  total,
  page,
  totalPages,
  onPageChange,
}: SearchResultsProps) {
  if (results.length === 0 && query) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <Package className="mx-auto size-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No results found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No listings match &quot;{query}&quot;. Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <Package className="mx-auto size-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No listings yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start by listing your first item.
        </p>
        <Link
          href="/donate"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          List an item
          <ExternalLink className="size-4" />
        </Link>
      </div>
    )
  }

  const highlightMatch = (text: string, isMatch?: boolean) => {
    if (!isMatch || !query) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {results.length} of {total} result{total !== 1 ? "s" : ""}
          {query && (
            <>
              {" "}
              for &quot;<span className="font-medium text-foreground">{query}</span>&quot;
            </>
          )}
        </span>
        <span>
          Page {page} of {totalPages}
        </span>
      </div>

      {/* Results list */}
      <div className="space-y-3">
        {results.map((result) => (
          <Link
            key={result.id}
            href="/dashboard"
            className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20">
                    <Package className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">
                      {highlightMatch(
                        result.deviceName,
                        result.matchHighlights?.deviceName
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {highlightMatch(
                        result.category,
                        result.matchHighlights?.category
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    <span>
                      {new Date(result.pickupDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs">({result.timeSlot})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    <span className="truncate max-w-[200px]">
                      {highlightMatch(
                        result.address,
                        result.matchHighlights?.address
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Qty: {result.quantity}</span>
                  <span className="capitalize">Condition: {result.condition}</span>
                </div>
              </div>

              <PickupStatusBadge status={result.status} />
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(page - 1)}
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
                onClick={() => onPageChange(pageNum)}
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
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
