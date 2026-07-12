import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { AppHeader } from "@/components/app-header"
import { BrowseView } from "@/features/browse/components/browse-view"

export const metadata = {
  title: "Browse Items - ReVive",
  description: "Find electronics others are giving away in your community.",
}

export default async function BrowsePage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <BrowseView />
    </div>
  )
}
