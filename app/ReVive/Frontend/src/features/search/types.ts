export type SearchFilters = {
  query: string
  status: string[]
  categories: string[]
  dateFrom: string | null
  dateTo: string | null
  condition: string[]
  sortBy: "date" | "name" | "status"
  sortOrder: "asc" | "desc"
}

export type SearchResult = {
  id: number
  userId: string
  category: string
  deviceName: string
  quantity: number
  condition: string
  availableFrom: string
  availableTo: string
  timeSlot: string
  address: string
  notes: string | null
  status: string
  createdAt: string
  matchHighlights?: {
    deviceName?: boolean
    category?: boolean
    address?: boolean
    notes?: boolean
  }
}

export type SearchStats = {
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  byCondition: Record<string, number>
  totalPickups: number
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
  { value: "partial", label: "Partial" },
  { value: "broken", label: "Broken" },
]

export const SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
  { value: "status", label: "Status" },
]

export type BrowseFilters = {
  query: string
  categories: string[]
  condition: string[]
  location: string
  sortBy: "newest" | "oldest"
}

export type BrowseItem = {
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

export type BrowseResponse = {
  results: BrowseItem[]
  total: number
  page: number
  totalPages: number
}

export const DEFAULT_BROWSE_FILTERS: BrowseFilters = {
  query: "",
  categories: [],
  condition: [],
  location: "",
  sortBy: "newest",
}
