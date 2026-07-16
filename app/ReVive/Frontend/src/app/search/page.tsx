import { AppHeader } from "@/components/app-header"
import { SearchView } from "@/features/search/components/search-view"

export const metadata = {
  title: "Search - ReVive",
  description: "Search for e-waste pickups and users.",
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex-1">
        <SearchView />
      </div>
    </div>
  )
}
