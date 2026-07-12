import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { getUserStats } from "@/features/settings/services/settings"
import { SettingsView } from "@/features/settings/components/settings-view"

export const metadata = {
  title: "Settings - ReVive",
  description: "Manage your account settings and preferences.",
}

export default async function SettingsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const stats = await getUserStats(user.id)

  return (
    <SettingsView
      userName={user.name}
      userEmail={user.email}
      stats={stats}
    />
  )
}
