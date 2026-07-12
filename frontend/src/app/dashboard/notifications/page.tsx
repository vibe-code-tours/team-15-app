import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { AppHeader } from "@/components/app-header"
import { NotificationList } from "@/features/notifications/components/notification-list"

export const metadata = {
  title: "Notifications - ReVive",
  description: "View your notifications about listings, referrals, and milestones.",
}

export default async function NotificationsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <NotificationList />
      </main>
    </div>
  )
}
