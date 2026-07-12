import { AchievementBadge } from "./achievement-badge"
import type { AchievementProgress as AchievementProgressType } from "@/features/achievements/types"

interface MilestoneProgressProps {
  progress: AchievementProgressType[]
  limit?: number
}

export function MilestoneProgress({ progress, limit = 5 }: MilestoneProgressProps) {
  // Show top in-progress achievements
  const inProgress = progress
    .filter((p) => !p.unlocked && p.percentage > 0)
    .slice(0, limit)

  if (inProgress.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">
          No achievements in progress. Complete pickups to unlock achievements!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">In Progress</h3>
      <div className="space-y-3">
        {inProgress.map((item) => (
          <div
            key={item.achievement.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <AchievementBadge
              achievement={item.achievement}
              unlocked={false}
              size="sm"
              showTooltip={false}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">{item.achievement.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.current}/{item.target}
                </p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
