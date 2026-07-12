"use client"

import { AppHeader } from "@/components/app-header"
import { SearchView } from "@/features/search/components/search-view"

export default function SearchPage() {
  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName="User" />
      <SearchView />
    </div>
  )
}
