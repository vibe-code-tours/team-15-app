import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getNotificationPreferences } from "@/app/actions/settings"
import { NotificationPreferences } from "@/components/settings/notification-preferences"

export const metadata = {
  title: "Notification Settings - ReVive",
  description: "Manage your notification preferences.",
}

export default async function NotificationSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const preferences = await getNotificationPreferences(session.user.id)

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
