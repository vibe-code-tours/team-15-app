"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { saveItem, unsaveItem, isItemSaved } from "@/features/saved-items/services/saved-items"
import { Button } from "@/components/ui/button"

interface SaveButtonProps {
  listingId: number
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export function SaveButton({
  listingId,
  variant = "ghost",
  size = "icon",
}: SaveButtonProps) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const isSaved = await isItemSaved(listingId)
        setSaved(isSaved)
      } catch (error) {
        console.error("Failed to check save status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSaved()
  }, [listingId])

  const handleToggle = async () => {
    if (loading) return

    setLoading(true)
    try {
      if (saved) {
        await unsaveItem(listingId)
        setSaved(false)
      } else {
        await saveItem(listingId)
        setSaved(true)
      }
    } catch (error) {
      console.error("Failed to toggle save:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? "Remove from saved" : "Save item"}
    >
      <Heart
        className={`size-5 transition-colors ${
          saved ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </Button>
  )
}
