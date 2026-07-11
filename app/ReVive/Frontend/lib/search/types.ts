export interface SearchFilters {
  query: string
  status: string[]
  categories: string[]
  dateFrom: string | null
  dateTo: string | null
  condition: string[]
  sortBy: "date" | "name" | "status"
  sortOrder: "asc" | "desc"
}

export interface SearchResult {
  id: number
  category: string
  deviceName: string
  quantity: number
  condition: string
  pickupDate: string
  timeSlot: string
  address: string
  notes: string | null
  status: string
  createdAt: string
  // Computed fields for highlighting
  matchHighlights?: {
    deviceName?: boolean
    category?: boolean
    address?: boolean
  }
}

export interface SearchOptions {
  page: number
  limit: number
  includeStats: boolean
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  totalPages: number
  stats?: SearchStats
}

export interface SearchStats {
  totalResults: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
}

// Browse page — items from other users
export interface BrowseItem {
  id: number
  category: string
  deviceName: string
  quantity: number
  condition: string
  address: string
  notes: string | null
  status: string
  createdAt: string
  donorName: string
}

export interface BrowseFilters {
  query: string
  categories: string[]
  condition: string[]
  sortBy: "newest" | "oldest"
}

export const DEFAULT_BROWSE_FILTERS: BrowseFilters = {
  query: "",
  categories: [],
  condition: [],
  sortBy: "newest",
}

export interface BrowseResponse {
  results: BrowseItem[]
  total: number
  page: number
  totalPages: number
}

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  status: [],
  categories: [],
  dateFrom: null,
  dateTo: null,
  condition: [],
  sortBy: "date",
  sortOrder: "desc",
}

export const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "picked_up", label: "Picked Up" },
  { value: "cancelled", label: "Cancelled" },
]

export const CONDITION_OPTIONS = [
  { value: "working", label: "Working" },
  { value: "partial", label: "Partially Working" },
  { value: "broken", label: "Not Working" },
]

export const SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "name", label: "Device Name" },
  { value: "status", label: "Status" },
]
