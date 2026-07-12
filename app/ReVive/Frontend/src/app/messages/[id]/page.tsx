import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { AppHeader } from "@/components/app-header"
import { ChatWindow } from "@/features/messages/components/chat-window"

export const metadata = {
  title: "Chat - ReVive",
  description: "Chat with another user.",
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  const { id } = await params

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ChatWindow
          conversationId={id}
          currentUserId={user.id}
        />
      </main>
    </div>
  )
}
