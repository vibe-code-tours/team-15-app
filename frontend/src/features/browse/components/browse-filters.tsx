"use client"

import { MapPin } from "lucide-react"
import { PICKUP_CATEGORIES, CONDITIONS } from "@/lib/categories"
import { Input } from "@/components/ui/input"
import type { BrowseFilters as BrowseFiltersType } from "@/features/search/types"

interface BrowseFiltersProps {
  filters: BrowseFiltersType
  onFiltersChange: (filters: BrowseFiltersType) => void
}

export function BrowseFilters({ filters, onFiltersChange }: BrowseFiltersProps) {
  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat]
    onFiltersChange({ ...filters, categories: next })
  }

  const toggleCondition = (cond: string) => {
    const next = filters.condition.includes(cond)
      ? filters.condition.filter((c) => c !== cond)
      : [...filters.condition, cond]
    onFiltersChange({ ...filters, condition: next })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.condition.length > 0 ||
    filters.location.length > 0

  return (
    <div className="space-y-4">
      {/* Location */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Location
        </p>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by city or address..."
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {PICKUP_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.categories.includes(cat.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Condition
        </p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond.value}
              type="button"
              onClick={() => toggleCondition(cond.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.condition.includes(cond.value)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort + clear */}
      <div className="flex items-center gap-3">
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFiltersChange({ ...filters, sortBy: e.target.value as "newest" | "oldest" })
          }
          className="h-8 cursor-pointer rounded-md border border-input bg-transparent px-3 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() =>
              onFiltersChange({ ...filters, categories: [], condition: [], location: "" })
            }
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
