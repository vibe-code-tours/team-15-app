import { AppHeader } from "@/components/app-header"
import { BrowseView } from "@/features/browse/components/browse-view"

export default function BrowsePage() {
  return (
    <div className="min-h-svh bg-background">
      <AppHeader />
      <BrowseView />
    </div>
  )
}
