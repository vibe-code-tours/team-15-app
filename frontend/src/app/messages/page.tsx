import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { AppHeader } from "@/components/app-header"
import { MessageList } from "@/features/messages/components/message-list"

export const metadata = {
  title: "Messages - ReVive",
  description: "View and manage your conversations.",
}

export default async function MessagesPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your conversations with other users.
          </p>
        </div>
        <MessageList />
      </main>
    </div>
  )
}
