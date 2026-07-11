import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { ChatWindow } from "@/components/messages/chat-window"

export const metadata = {
  title: "Chat - ReVive",
  description: "Chat with another user.",
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const { id } = await params

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={session.user.name} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ChatWindow
          conversationId={id}
          currentUserId={session.user.id}
        />
      </main>
    </div>
  )
}
