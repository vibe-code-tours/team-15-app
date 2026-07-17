"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { getUnreadCount } from "@/features/notifications/services/notifications"
import { NotificationDropdown } from "./notification-dropdown"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchCount = async () => {
      try {
        const count = await getUnreadCount()
        setUnreadCount(count)
      } catch (error) {
        console.error("Failed to fetch unread count:", error)
      }
    }

    fetchCount()

    // Setup WebSocket connection
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://revive-and-donate.onrender.com"
    const wsUrl = backendUrl.replace("http", "ws").replace("https", "wss")
    
    const socket = new WebSocket(`${wsUrl}/api/messages/ws/${session.user.id}`)
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "notification") {
        setUnreadCount(data.unread_count)
      } else if (data.type === "active_users") {
        window.dispatchEvent(new CustomEvent("activeUsers", { detail: data.users }))
      }
    }

    return () => {
      socket.close()
    }
  }, [session?.user?.id])

  const handleCountChange = (newCount: number) => {
    setUnreadCount(newCount)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <NotificationDropdown
          onClose={() => setIsOpen(false)}
          onCountChange={handleCountChange}
        />
      )}
    </div>
  )
}
