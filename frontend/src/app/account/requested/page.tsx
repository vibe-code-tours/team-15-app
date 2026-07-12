import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { AppHeader } from "@/components/app-header"
import { RequestedItemsFull } from "@/features/account/components/requested-items-full"

export const metadata = {
  title: "Requested Items - ReVive",
  description: "View all items you have requested from other donors.",
}

export default async function RequestedItemsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <RequestedItemsFull />
      </main>
    </div>
  )
}
