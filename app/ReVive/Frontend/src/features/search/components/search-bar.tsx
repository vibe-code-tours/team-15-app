"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  onClear: () => void
  isLoading?: boolean
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  isLoading = false,
  placeholder = "Search devices, categories, addresses...",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localValue, setLocalValue] = useState(value)

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange, value])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch()
    },
    [onSearch]
  )

  const handleClear = useCallback(() => {
    setLocalValue("")
    onClear()
    inputRef.current?.focus()
  }, [onClear])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClear()
      }
    },
    [handleClear]
  )

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {isLoading ? (
          <Loader2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : (
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          ref={inputRef}
          type="search"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-20"
          aria-label="Search listings"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
          {localValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          )}
          <Button type="submit" size="sm" className="h-7">
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}
