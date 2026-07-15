import { AppHeader } from "@/components/app-header"
import { Bell } from "lucide-react"

export const metadata = {
  title: "Notifications - ReVive",
  description: "View your alerts and updates.",
}

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Bell className="size-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">You're all caught up!</h1>
        <p className="text-muted-foreground max-w-md mx-auto text-lg">
          No new notifications right now. When someone requests your pickup or sends you a message, it will appear here.
        </p>
      </main>
    </div>
  )
}
