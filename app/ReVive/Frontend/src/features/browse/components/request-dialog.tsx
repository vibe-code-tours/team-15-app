"use client"

import { useState } from "react"
import { Send, Loader2, Check, Calendar } from "lucide-react"
import { requestItem } from "@/features/browse/services/browse"
import { TIME_SLOTS, timeSlotLabel } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RequestDialogProps {
  itemId: number
  availableFrom: string
  availableTo: string
  timeSlot: string
  children: React.ReactNode
  onRequestSuccess?: (itemId: number) => void
}

export function RequestDialog({
  itemId,
  availableFrom,
  availableTo,
  timeSlot: donorTimeSlot,
  children,
  onRequestSuccess,
}: RequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [pickupFrom, setPickupFrom] = useState("")
  const [pickupTo, setPickupTo] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split("T")[0]

  const canSubmit = pickupFrom && pickupTo && pickupTo >= pickupFrom && selectedTimeSlot

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError(null)

    try {
      await requestItem(itemId, {
        pickupFrom,
        pickupTo,
        timeSlot: selectedTimeSlot,
      })
      setSuccess(true)
      onRequestSuccess?.(itemId)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
      }, 1500)
    } catch {
      setError("Failed to send request — item may no longer be available.")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      // Pre-fill with donor's available dates and time slot
      setPickupFrom(availableFrom)
      setPickupTo(availableTo)
      setSelectedTimeSlot(donorTimeSlot)
      setError(null)
      setSuccess(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<button type="button" className="w-full" />}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request This Item</DialogTitle>
          <DialogDescription>
            The donor is available on the dates below. You can adjust them to
            fit your schedule.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
              <Check className="size-6 text-green-600" />
            </div>
            <p className="mt-4 text-lg font-semibold">Request Sent!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The donor will be notified. Check your requests for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Donor availability hint */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" />
              <span>
                Donor available{" "}
                {new Date(availableFrom + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
                {" – "}
                {new Date(availableTo + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
                , {timeSlotLabel(donorTimeSlot)}
              </span>
            </div>

            {/* Pick-up Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pick-up Date Range</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`pickup-from-${itemId}`} className="text-xs text-muted-foreground">
                    Start Date
                  </Label>
                  <Input
                    id={`pickup-from-${itemId}`}
                    type="date"
                    min={today}
                    value={pickupFrom}
                    onChange={(e) => {
                      setPickupFrom(e.target.value)
                      if (pickupTo && e.target.value > pickupTo) {
                        setPickupTo("")
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`pickup-to-${itemId}`} className="text-xs text-muted-foreground">
                    End Date
                  </Label>
                  <Input
                    id={`pickup-to-${itemId}`}
                    type="date"
                    min={pickupFrom || today}
                    value={pickupTo}
                    onChange={(e) => setPickupTo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Preferred Pick-up Time */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preferred Pick-up Time</Label>
              <div className="flex flex-col gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setSelectedTimeSlot(t.value)}
                    aria-pressed={selectedTimeSlot === t.value}
                    className={`cursor-pointer rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      selectedTimeSlot === t.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || success || !canSubmit}>
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Send className="mr-2 size-4" />
            )}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
