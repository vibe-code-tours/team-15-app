"use client"

import { useState, useRef } from "react"
import { Camera, Check, Loader2 } from "lucide-react"
import { apiUpload } from "@/lib/api/client"
import { updateProfile } from "@/features/settings/services/settings"
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
  const [avatar, setAvatar] = useState(user.image)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!file.type.startsWith("image/")) return
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB")
      return
    }

    setUploading(true)
    try {
      const result = await apiUpload<{ urls: string[] }>("/api/upload", [file])
      const imageUrl = result.urls[0]

      // Save to profile
      await updateProfile({ image: imageUrl })
      setAvatar(imageUrl)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      console.error("Failed to upload photo:", err)
    } finally {
      setUploading(false)
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

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
          <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white overflow-hidden">
            {avatar ? (
              <img
                src={avatar}
                alt={user.name}
                className="size-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* Camera overlay button */}
          <button
            type="button"
            onClick={handlePhotoClick}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
            aria-label="Change profile photo"
          >
            {uploading ? (
              <Loader2 className="size-6 text-white animate-spin" />
            ) : (
              <Camera className="size-6 text-white" />
            )}
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
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
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                {success && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <Check className="size-4" /> Saved
                  </span>
                )}
              </div>
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
