import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { getAllUsers } from "@/features/admin/services/admin"
import { UserTable } from "@/features/admin/components/user-table"

export const metadata = {
  title: "Manage Users - Admin",
  description: "View and manage all registered users.",
}

export default async function AdminUsersPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const users = await getAllUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all registered users on the platform.
        </p>
      </div>

      <UserTable users={users} />
    </div>
  )
}
