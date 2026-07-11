"use client"

import { X } from "lucide-react"
import { AchievementBadge } from "./achievement-badge"
import { Button } from "@/components/ui/button"
import type { AchievementProgress as AchievementProgressType } from "@/lib/achievements/types"
import { TIER_COLORS } from "@/lib/achievements/types"

interface AchievementProgressProps {
  progress: AchievementProgressType
  onClose: () => void
}

export function AchievementProgress({
  progress,
  onClose,
}: AchievementProgressProps) {
  const { achievement, current, target, percentage, unlocked, unlockedAt } = progress

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Achievement Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        {/* Achievement Badge */}
        <div className="flex flex-col items-center">
          <AchievementBadge
            achievement={achievement}
            unlocked={unlocked}
            size="lg"
            showTooltip={false}
          />

          <h3 className="mt-4 text-xl font-bold">{achievement.name}</h3>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {achievement.description}
          </p>

          {/* Tier Badge */}
          <span
            className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              TIER_COLORS[achievement.tier]
            }`}
          >
            {achievement.tier}
          </span>
        </div>

        {/* Progress Section */}
        <div className="mt-6 space-y-4">
          {unlocked ? (
            <div className="rounded-xl bg-green-500/10 p-4 text-center">
              <p className="text-lg font-bold text-green-600">Unlocked!</p>
              {unlockedAt && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Achieved on{" "}
                  {new Date(unlockedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {current} / {target}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-xs text-muted-foreground">
                  {Math.round(percentage)}% complete
                </p>
              </div>

              {/* Reward Info */}
              {achievement.reward && (
                <div className="rounded-xl bg-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reward</span>
                    <span className="text-lg font-bold text-primary">
                      +{achievement.reward.points} Points
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Close Button */}
        <Button className="mt-6 w-full" onClick={onClose}>
          {unlocked ? "Awesome!" : "Keep Going!"}
        </Button>
      </div>
    </div>
  )
}
