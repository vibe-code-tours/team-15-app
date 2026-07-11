import { getAllPickups } from "@/app/actions/admin"
import { PickupTable } from "@/components/admin/pickup-table"

export const metadata = {
  title: "Manage Listings - Admin",
  description: "View and manage all item listings.",
}

export default async function AdminPickupsPage() {
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
