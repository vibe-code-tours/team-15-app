import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { AppHeader } from "@/components/app-header"
import { DonorRequestsFull } from "@/features/account/components/donor-requests-full"

export const metadata = {
  title: "Incoming Requests - ReVive",
  description: "View and manage all incoming requests on your items.",
}

export default async function DonorRequestsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <DonorRequestsFull />
      </main>
    </div>
  )
}
