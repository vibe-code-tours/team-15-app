"use client"

import { useState } from "react"
import { Flag, Loader2 } from "lucide-react"
import { flagContent, type FlagReason } from "@/features/flags/services/flags"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FlagDialogProps {
  targetType: "listing" | "user" | "message"
  targetId: string
  trigger?: React.ReactNode
}

const FLAG_REASONS: { value: FlagReason; label: string }[] = [
  { value: "spam", label: "Spam or misleading" },
  { value: "scam", label: "Scam or fraud" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "fake_listing", label: "Fake listing" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "other", label: "Other" },
]

export function FlagDialog({ targetType, targetId, trigger }: FlagDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<FlagReason | null>(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!reason) return

    setLoading(true)
    try {
      const result = await flagContent(targetType, targetId, reason, description)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setReason(null)
          setDescription("")
        }, 1500)
      }
    } catch (error) {
      console.error("Failed to flag content:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Flag className="mr-2 size-4" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>
            Help us keep the community safe. Why are you reporting this?
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <p className="text-lg font-semibold text-green-600">Thank you!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your report has been submitted for review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {FLAG_REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    reason === r.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="size-4"
                  />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Additional details (optional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more context about the issue..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason || loading}
          >
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Flag className="mr-2 size-4" />
            )}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
