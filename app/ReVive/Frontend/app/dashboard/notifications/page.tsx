import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { NotificationList } from "@/components/notifications/notification-list"

export const metadata = {
  title: "Notifications - ReVive",
  description: "View your notifications about listings, referrals, and milestones.",
}

export default async function NotificationsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={session.user.name} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <NotificationList />
      </main>
    </div>
  )
}
