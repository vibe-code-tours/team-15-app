"use client"

import { useState, useEffect, useRef } from "react"
import { Send, User } from "lucide-react"
import { apiGet } from "@/lib/api/client"

type UserProfile = {
  id: string
  name: string
  image: string | null
}

type ChatMessage = {
  id?: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

type ChatRoomProps = {
  currentUser: UserProfile
  selectedUser: UserProfile
}

export function ChatRoom({ currentUser, selectedUser }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const ws = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch history when selected user changes
  useEffect(() => {
    async function fetchHistory() {
      setLoading(true)
      try {
        const data = await apiGet<ChatMessage[]>(`/api/messages/${selectedUser.id}`)
        setMessages(data || [])
      } catch (err) {
        console.error("Failed to fetch chat history:", err)
      } finally {
        setLoading(false)
        scrollToBottom()
      }
    }
    fetchHistory()
  }, [selectedUser.id])

  // WebSocket Connection
  useEffect(() => {
    // ReVive is hosted on Render for backend
    const isProduction = process.env.NODE_ENV === "production"
    // Using wss for production and ws for local development
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    // In local dev, API is proxied, so we might need to connect directly to the backend URL
    // but Next.js rewrites can't proxy WebSockets easily without a custom server.
    // For this app, we'll try to use the host window location for Vercel/Render compatibility.
    // Actually, we use NEXT_PUBLIC_API_URL or default to Render if in prod
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://revive-and-donate.onrender.com"
    const wsUrl = backendUrl.replace("http", "ws").replace("https", "wss")
    
    const socket = new WebSocket(`${wsUrl}/api/messages/ws/${currentUser.id}`)
    
    socket.onopen = () => {
      console.log("WebSocket Connected")
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "message") {
        setMessages((prev) => [...prev, data.message])
        setTimeout(scrollToBottom, 50)
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error)
    }

    ws.current = socket

    return () => {
      socket.close()
    }
  }, [currentUser.id])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !ws.current) return

    const payload = {
      type: "message",
      content: newMessage,
      receiver_id: selectedUser.id,
    }

    ws.current.send(JSON.stringify(payload))
    setNewMessage("")
  }

  return (
    <div className="flex h-full flex-col bg-background/50 relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/60 bg-card/80 backdrop-blur z-10 shadow-sm">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted border border-border">
          {selectedUser.image ? (
            <img src={selectedUser.image} alt={selectedUser.name} className="size-full rounded-full object-cover" />
          ) : (
            <User className="size-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{selectedUser.name}</h3>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-muted-foreground">Loading history...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-muted-foreground space-y-2">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <User className="size-8 text-primary/60" />
            </div>
            <p>Say hello to {selectedUser.name}!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUser.id
            return (
              <div key={msg.id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border/60">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${selectedUser.name}...`}
            className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="size-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  )
}
