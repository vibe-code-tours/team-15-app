import { AchievementGrid } from "@/features/achievements/components/achievement-grid"
import { MilestoneProgress } from "@/features/achievements/components/milestone-progress"
import type { AchievementProgress } from "@/features/achievements/types"

type AchievementsViewProps = {
  progress: AchievementProgress[]
  stats: {
    unlocked: number
    inProgress: number
    locked: number
    totalPointsEarned: number
  }
}

export function AchievementsView({ progress, stats }: AchievementsViewProps) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Achievements{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            & Milestones
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your recycling journey and unlock achievements as you make an
          impact.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-primary">{stats.unlocked}</p>
          <p className="text-xs text-muted-foreground">Unlocked</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-blue-500">{stats.inProgress}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-muted-foreground">{stats.locked}</p>
          <p className="text-xs text-muted-foreground">Locked</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">
            {stats.totalPointsEarned}
          </p>
          <p className="text-xs text-muted-foreground">Points Earned</p>
        </div>
      </div>

      <section className="mb-10">
        <MilestoneProgress progress={progress} />
      </section>

      <section>
        <AchievementGrid progress={progress} />
      </section>
    </main>
  )
}
