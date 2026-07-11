"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  STATUS_OPTIONS,
  CONDITION_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/search/types"
import type { SearchFilters } from "@/lib/search/types"

interface FilterPanelProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  stats?: {
    byStatus: Record<string, number>
    byCategory: Record<string, number>
    byCondition: Record<string, number>
  }
}

export function FilterPanel({
  filters,
  onFiltersChange,
  stats,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    onFiltersChange({ ...filters, status: newStatus })
  }

  const toggleCondition = (condition: string) => {
    const newCondition = filters.condition.includes(condition)
      ? filters.condition.filter((c) => c !== condition)
      : [...filters.condition, condition]
    onFiltersChange({ ...filters, condition: newCondition })
  }

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const activeFilterCount =
    filters.status.length +
    filters.categories.length +
    filters.condition.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0)

  return (
    <div className="rounded-2xl border border-border bg-card">
      {/* Header */}
      <button
        type="button"
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="border-t border-border px-4 pb-4 pt-4 space-y-6">
          {/* Status Filter */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Status</Label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.status.includes(option.value) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleStatus(option.value)}
                >
                  {option.label}
                  {stats?.byStatus[option.value] !== undefined && (
                    <span className="ml-1 text-xs opacity-70">
                      ({stats.byStatus[option.value]})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          {stats?.byCategory && Object.keys(stats.byCategory).length > 0 && (
            <div>
              <Label className="mb-2 block text-sm font-medium">Category</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <Button
                    key={category}
                    variant={
                      filters.categories.includes(category)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    <span className="ml-1 text-xs opacity-70">({count})</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Condition Filter */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Condition</Label>
            <div className="flex flex-wrap gap-2">
              {CONDITION_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    filters.condition.includes(option.value)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleCondition(option.value)}
                >
                  {option.label}
                  {stats?.byCondition[option.value] !== undefined && (
                    <span className="ml-1 text-xs opacity-70">
                      ({stats.byCondition[option.value]})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Date Range</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      dateFrom: e.target.value || null,
                    })
                  }
                  className="w-40"
                  placeholder="From"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      dateTo: e.target.value || null,
                    })
                  }
                  className="w-40"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Sort By</Label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                {SORT_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.sortBy === option.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      onFiltersChange({ ...filters, sortBy: option.value as SearchFilters["sortBy"] })
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
                  })
                }
              >
                {filters.sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </Button>
            </div>
          </div>

          {/* Clear All Filters */}
          {activeFilterCount > 0 && (
            <div className="border-t border-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    status: [],
                    categories: [],
                    condition: [],
                    dateFrom: null,
                    dateTo: null,
                  })
                }
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
