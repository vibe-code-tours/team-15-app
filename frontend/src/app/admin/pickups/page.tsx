import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { getAllPickups } from "@/features/admin/services/admin"
import { PickupTable } from "@/features/admin/components/pickup-table"

export const metadata = {
  title: "Manage Listings - Admin",
  description: "View and manage all item listings.",
}

export default async function AdminPickupsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const pickups = await getAllPickups()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pickups</h1>
        <p className="mt-2 text-muted-foreground">
          Manage all e-waste pickup requests across the platform.
        </p>
      </div>

      <PickupTable pickups={pickups} />
    </div>
  )
}
