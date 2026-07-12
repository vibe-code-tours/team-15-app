"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterChip {
  id: string
  label: string
  type: "status" | "category" | "condition" | "date"
}

interface FilterChipsProps {
  filters: FilterChip[]
  onRemove: (filter: FilterChip) => void
  onClearAll: () => void
}

export function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null

  const typeColors: Record<string, string> = {
    status: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    category: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
    condition: "bg-green-500/20 text-green-700 dark:text-green-300",
    date: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filters.map((filter) => (
        <span
          key={filter.id}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            typeColors[filter.type] || "bg-gray-500/20 text-gray-700"
          }`}
        >
          {filter.label}
          <Button
            variant="ghost"
            size="icon"
            className="size-4 p-0 hover:bg-transparent"
            onClick={() => onRemove(filter)}
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="size-3" />
          </Button>
        </span>
      ))}
      {filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
    </div>
  )
}
