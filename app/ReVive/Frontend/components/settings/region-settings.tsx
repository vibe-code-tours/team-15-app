"use client"

import { useState } from "react"
import { MapPin, Loader2, Check } from "lucide-react"
import { updateRegion } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface RegionSettingsProps {
  currentRegion?: {
    city: string
    state: string
    postalCode: string
  } | null
}

const POPULAR_CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "San Francisco",
  "Seattle",
  "Denver",
  "Austin",
  "Miami",
]

export function RegionSettings({ currentRegion }: RegionSettingsProps) {
  const [city, setCity] = useState(currentRegion?.city || "")
  const [state, setState] = useState(currentRegion?.state || "")
  const [postalCode, setPostalCode] = useState(currentRegion?.postalCode || "")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (!city.trim()) return

    setLoading(true)
    try {
      await updateRegion({ city: city.trim(), state: state.trim(), postalCode: postalCode.trim() })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch {
      console.error("Failed to update region")
    } finally {
      setLoading(false)
    }
  }

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity)
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Your Location
          </h3>
          <p className="text-sm text-muted-foreground">
            Set your location to see nearby donations and get better matches.
          </p>
        </div>

        {/* Quick City Selection */}
        <div>
          <Label className="mb-2 block text-sm font-medium">Popular Cities</Label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CITIES.map((popularCity) => (
              <Button
                key={popularCity}
                variant={city === popularCity ? "default" : "outline"}
                size="sm"
                onClick={() => handleCitySelect(popularCity)}
              >
                {popularCity}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Location */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter state"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal/ZIP Code</Label>
            <Input
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter postal code"
              className="max-w-[200px]"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading || !city.trim()}>
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
            "Save Location"
          )}
        </Button>
      </div>
    </Card>
  )
}
