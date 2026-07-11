"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageSquare, User } from "lucide-react"
import { getConversations } from "@/app/actions/messages"

interface Conversation {
  id: string
  otherUserName: string
  lastMessage: string | null
  lastMessageSender: string | null
  lastMessageAt: string | null
}

export function MessageList() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations()
        setConversations(data as Conversation[])
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <MessageSquare className="mx-auto size-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No messages yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start a conversation by requesting an item from someone.
        </p>
        <Link
          href="/donate"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Browse donations
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/20">
            <User className="size-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{conv.otherUserName}</h3>
              {conv.lastMessageAt && (
                <span className="text-xs text-muted-foreground">
                  {new Date(conv.lastMessageAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {conv.lastMessage && (
              <p className="mt-1 text-sm text-muted-foreground truncate">
                {conv.lastMessage}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
