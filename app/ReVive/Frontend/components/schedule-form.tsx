"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Loader2, PackageCheck } from "lucide-react"
import { createPickup } from "@/app/actions/pickups"
import { PICKUP_CATEGORIES, CONDITIONS, TIME_SLOTS } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

const STEPS = ["Item", "When", "Where"] as const

export function ScheduleForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [category, setCategory] = useState("")
  const [deviceName, setDeviceName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [condition, setCondition] = useState("working")
  const [pickupDate, setPickupDate] = useState("")
  const [timeSlot, setTimeSlot] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")

  const prefersReducedMotion = useReducedMotion()
  const today = new Date().toISOString().split("T")[0]

  const canNext =
    (step === 0 && category && deviceName.trim()) ||
    (step === 1 && pickupDate && timeSlot) ||
    step === 2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) {
      setError("Please enter a pickup address.")
      return
    }
    setError(null)
    setLoading(true)
    const res = await createPickup({
      category,
      deviceName,
      quantity,
      condition,
      pickupDate,
      timeSlot,
      address,
      notes,
    })
    setLoading(false)
    if (res?.error) {
      setError(res.error)
      return
    }
    setDone(true)
    setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 1600)
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-lg p-10 text-center">
        <motion.div
          initial={prefersReducedMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <PackageCheck className="size-8" />
        </motion.div>
        <h2 className="mt-6 text-2xl font-bold">Item listed!</h2>
        <p className="mt-2 text-muted-foreground">
          Your device is now visible to people nearby. Taking you to your dashboard...
        </p>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-lg p-6 md:p-8">
      {/* Stepper */}
      <nav aria-label="Progress">
        <ol className="mb-8 flex items-center gap-2" role="list">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2" aria-current={i === step ? "step" : undefined}>
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary/20 text-primary ring-2 ring-primary"
                      : "bg-muted text-muted-foreground"
                }`}
                aria-hidden="true"
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={`text-sm font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Live region for step announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            className="flex flex-col gap-4"
          >
            {step === 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PICKUP_CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        aria-pressed={category === c.value}
                        className={`cursor-pointer rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                          category === c.value
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deviceName">Device name / description</Label>
                  <Input
                    id="deviceName"
                    placeholder="e.g. Old iPhone 8, HP laptop"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <select
                      id="condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="h-9 cursor-pointer rounded-md border border-input bg-transparent px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {CONDITIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pickupDate">Available from</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Time slot</Label>
                  <div className="flex flex-col gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        type="button"
                        key={t.value}
                        onClick={() => setTimeSlot(t.value)}
                        aria-pressed={timeSlot === t.value}
                        className={`cursor-pointer rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                          timeSlot === t.value
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="address">Meeting location</Label>
                  <Textarea
                    id="address"
                    placeholder="Street, city, postal code (suggest a public spot)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Gate code, parking, or any meeting instructions"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className="cursor-pointer"
            aria-label="Go to previous step"
          >
            <ChevronLeft className="size-4" aria-hidden="true" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="cursor-pointer">
              Continue <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Posting...
                </>
              ) : (
                "Post item"
              )}
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
