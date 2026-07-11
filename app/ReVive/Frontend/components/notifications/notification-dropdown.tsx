"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCheck, Trash2 } from "lucide-react"
import {
  getNotifications,
  markAllAsRead,
  clearAllNotifications,
} from "@/app/actions/notifications"
import { NotificationItem } from "./notification-item"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  actionUrl: string | null
  createdAt: string
}

export function NotificationDropdown({
  onClose,
  onCountChange,
}: {
  onClose: () => void
  onCountChange: (count: number) => void
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(10)
        setNotifications(data as Notification[])
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleMarkAllRead = async () => {
    await markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    onCountChange(0)
  }

  const handleClearAll = async () => {
    await clearAllNotifications()
    setNotifications([])
    onCountChange(0)
  }

  const handleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    onCountChange(Math.max(0, notifications.filter((n) => !n.read).length - 1))
  }

  const handleNotificationDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (!notifications.find((n) => n.id === id)?.read) {
      onCountChange(Math.max(0, notifications.filter((n) => !n.read).length - 1))
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={handleMarkAllRead}
              title="Mark all as read"
            >
              <CheckCheck className="size-4" />
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={handleClearAll}
              title="Clear all"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleNotificationRead}
                onDelete={handleNotificationDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-border px-4 py-2">
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={() => {
              onClose()
              // Navigate to notifications page if it exists
            }}
          >
            View all notifications
          </Button>
        </div>
      )}
    </div>
  )
}
