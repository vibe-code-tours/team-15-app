import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { MessagesView } from "@/features/messages/components/messages-view"

export const metadata = {
  title: "Messages - ReVive",
  description: "Chat with other users on ReVive.",
}

export default async function MessagesPage() {
  const user = await getServerUser()
  
  if (!user) {
    redirect("/sign-in")
  }

  return <MessagesView currentUser={user} />
}
