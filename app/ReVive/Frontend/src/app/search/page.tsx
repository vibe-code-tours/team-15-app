import { AppHeader } from "@/components/app-header"
import { Search } from "lucide-react"

export const metadata = {
  title: "Search - ReVive",
  description: "Search for e-waste pickups and users.",
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Search className="size-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Advanced Search</h1>
        <p className="text-muted-foreground max-w-md mx-auto text-lg">
          We're currently building a powerful global search engine to help you find specific electronics, parts, and users instantly. Check back soon!
        </p>
      </main>
    </div>
  )
}
