import { ProfileSummary } from "@/features/account/components/profile-summary"
import { QuickStats } from "@/features/account/components/quick-stats"
import { RequestedItems } from "@/features/account/components/requested-items"
import { DonorRequests } from "@/features/account/components/donor-requests"
import { AccountMenu } from "@/features/account/components/account-menu"
import type { UserStats } from "@/features/settings/types"

type AccountViewProps = {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
  userStats: UserStats
  achievementStats: {
    unlocked: number
  }
}

export function AccountView({ user, userStats, achievementStats }: AccountViewProps) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile, view your impact, and access settings.
        </p>
      </div>

      <section className="mb-8">
        <ProfileSummary user={user} />
      </section>

      <section className="mb-8">
        <QuickStats
          stats={{
            totalPickups: userStats.totalPickups,
            totalPoints: userStats.totalPoints,
            totalReferrals: userStats.totalReferrals,
            achievementsUnlocked: achievementStats.unlocked,
          }}
        />
      </section>

      <section className="mb-8">
        <DonorRequests />
      </section>

      <section className="mb-8">
        <RequestedItems />
      </section>

      <section>
        <AccountMenu />
      </section>
    </main>
  )
}
