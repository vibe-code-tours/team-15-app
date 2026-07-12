"use client"

import { useRouter } from "next/navigation"
import {
  Package,
  CheckCircle,
  XCircle,
  Users,
  Award,
  Bell,
  Trash2,
} from "lucide-react"
import { markAsRead, deleteNotification } from "@/features/notifications/services/notifications"
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

const TYPE_ICONS: Record<string, typeof Package> = {
  pickup_scheduled: Package,
  pickup_completed: CheckCircle,
  pickup_cancelled: XCircle,
  referral_signup: Users,
  referral_completed: Users,
  milestone_reached: Award,
  system: Bell,
}

const TYPE_COLORS: Record<string, string> = {
  pickup_scheduled: "text-blue-500",
  pickup_completed: "text-green-500",
  pickup_cancelled: "text-red-500",
  referral_signup: "text-purple-500",
  referral_completed: "text-purple-500",
  milestone_reached: "text-yellow-500",
  system: "text-gray-500",
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function NotificationItem({
  notification,
  onRead,
  onDelete,
}: {
  notification: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const router = useRouter()
  const Icon = TYPE_ICONS[notification.type] || Bell
  const iconColor = TYPE_COLORS[notification.type] || "text-gray-500"

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.id)
      onRead(notification.id)
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteNotification(notification.id)
    onDelete(notification.id)
  }

  return (
    <div
      className={`flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
        !notification.read ? "bg-primary/5" : ""
      }`}
      onClick={handleClick}
    >
      <div className={`mt-0.5 ${iconColor}`}>
        <Icon className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm ${
              !notification.read ? "font-semibold" : "font-medium"
            }`}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {getTimeAgo(notification.createdAt)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
        onClick={handleDelete}
        title="Delete notification"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
