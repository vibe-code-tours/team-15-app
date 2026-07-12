"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { getUnreadCount } from "@/features/notifications/services/notifications"
import { NotificationDropdown } from "./notification-dropdown"
import { Button } from "@/components/ui/button"

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getUnreadCount()
        setUnreadCount(count)
      } catch (error) {
        console.error("Failed to fetch unread count:", error)
      }
    }

    fetchCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchCount, 30000)

    return () => clearInterval(interval)
  }, [])

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
