"use client"

import { useState } from "react"
import { AchievementBadge } from "./achievement-badge"
import { AchievementProgress } from "./achievement-progress"
import { CATEGORY_LABELS } from "@/features/achievements/types"
import type { AchievementProgress as AchievementProgressType } from "@/features/achievements/types"
import { Button } from "@/components/ui/button"

interface AchievementGridProps {
  progress: AchievementProgressType[]
}

export function AchievementGrid({ progress }: AchievementGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementProgressType | null>(null)

  // Group by category
  const categories = Array.from(new Set(progress.map((p) => p.achievement.category)))
  const filteredProgress = selectedCategory
    ? progress.filter((p) => p.achievement.category === selectedCategory)
    : progress

  const unlockedCount = progress.filter((p) => p.unlocked).length
  const totalCount = progress.length

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Achievements</h3>
          <p className="text-sm text-muted-foreground">
            {unlockedCount} of {totalCount} unlocked
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </p>
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {CATEGORY_LABELS[category] || category}
          </Button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {filteredProgress.map((item) => (
          <button
            key={item.achievement.id}
            className="flex flex-col items-center p-4 rounded-xl hover:bg-muted/50 transition-colors"
            onClick={() => setSelectedAchievement(item)}
          >
            <AchievementBadge
              achievement={item.achievement}
              unlocked={item.unlocked}
              size="lg"
            />
            <p className="mt-2 text-xs font-medium text-center line-clamp-2">
              {item.achievement.name}
            </p>
            {!item.unlocked && (
              <p className="text-[10px] text-muted-foreground">
                {Math.round(item.percentage)}%
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <AchievementProgress
          progress={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  )
}
