import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { getAdminStats } from "@/features/admin/services/admin"
import { AdminDashboardView } from "@/features/admin/components/admin-dashboard-view"

export const metadata = {
  title: "Admin Dashboard - ReVive",
  description: "Manage listings, users, and view platform statistics.",
}

export default async function AdminDashboardPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")
  if (!user.isAdmin) redirect("/dashboard")

  const stats = await getAdminStats()
  return <AdminDashboardView stats={stats} />
}
