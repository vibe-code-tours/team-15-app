"use client"

import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import { updateNotificationPreferences } from "@/features/settings/services/settings"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface NotificationPreferencesProps {
  preferences: {
    emailPickupUpdates: boolean
    emailReferralAlerts: boolean
    emailMilestones: boolean
    pushEnabled: boolean
  }
}

export function NotificationPreferences({
  preferences,
}: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState(preferences)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)

    try {
      await updateNotificationPreferences(prefs)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch {
      console.error("Failed to update preferences")
    } finally {
      setLoading(false)
    }
  }

  const toggles = [
    {
      key: "emailPickupUpdates" as const,
      label: "Pickup Updates",
      description: "Get notified when your pickup status changes",
    },
    {
      key: "emailReferralAlerts" as const,
      label: "Referral Alerts",
      description: "Notify when someone uses your referral code",
    },
    {
      key: "emailMilestones" as const,
      label: "Milestone Achievements",
      description: "Celebrate when you reach new milestones",
    },
    {
      key: "pushEnabled" as const,
      label: "Push Notifications",
      description: "Receive browser push notifications",
    },
  ]

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Email Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Choose which email notifications you&apos;d like to receive.
          </p>
        </div>

        <div className="space-y-4">
          {toggles.map((toggle) => (
            <div
              key={toggle.key}
              className="flex items-center justify-between rounded-xl border border-border p-4"
            >
              <div>
                <p className="font-medium">{toggle.label}</p>
                <p className="text-sm text-muted-foreground">
                  {toggle.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs[toggle.key]}
                onClick={() => handleToggle(toggle.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  prefs[toggle.key] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                    prefs[toggle.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={loading || success}>
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : success ? (
            <>
              <Check className="mr-2 size-4" />
              Saved!
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </Card>
  )
}
