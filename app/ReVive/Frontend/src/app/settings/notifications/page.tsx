import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { getNotificationPreferences } from "@/features/settings/services/settings"
import { NotificationPreferences } from "@/features/settings/components/notification-preferences"

export const metadata = {
  title: "Notification Settings - ReVive",
  description: "Manage your notification preferences.",
}

export default async function NotificationSettingsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const preferences = await getNotificationPreferences(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-2 text-muted-foreground">
          Choose how and when you&apos;d like to be notified.
        </p>
      </div>

      <NotificationPreferences preferences={preferences} />
    </div>
  )
}
