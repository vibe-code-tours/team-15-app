"use client"

import { useState } from "react"
import { Camera, Check, Loader2 } from "lucide-react"
import { updateProfile } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface ProfileSummaryProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

export function ProfileSummary({ user }: ProfileSummaryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || name === user.name) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    try {
      const result = await updateProfile({ name: name.trim() })
      if (result.success) {
        setSuccess(true)
        setIsEditing(false)
        setTimeout(() => setSuccess(false), 2000)
      }
    } catch {
      console.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setName(user.name)
    setIsEditing(false)
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Avatar */}
        <div className="relative group">
          <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="size-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="size-6 text-white" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="max-w-xs"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={loading || !name.trim()}
                >
                  {loading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : success ? (
                    <Check className="mr-2 size-4" />
                  ) : null}
                  {loading ? "Saving..." : success ? "Saved!" : "Save"}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </>
          )}
        </div>

        {/* Member Badge */}
        <div className="rounded-xl bg-primary/10 px-4 py-2 text-center">
          <p className="text-xs text-muted-foreground">Member Since</p>
          <p className="font-semibold text-primary">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </Card>
  )
}
