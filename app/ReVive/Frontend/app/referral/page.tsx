import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getReferralDashboard, getImpactTimeline } from "@/app/actions/referrals"
import { AppHeader } from "@/components/app-header"
import { ReferralHero } from "@/components/referral-hero"
import { ReferralStats } from "@/components/referral-stats"
import { ImpactTimeline } from "@/components/impact-timeline"

export const metadata = {
  title: "Referral Program",
  description: "Share your referral code and earn double impact points when friends donate e-waste.",
}

export default async function ReferralPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const { code, stats } = await getReferralDashboard()
  const impactTimeline = await getImpactTimeline(session.user.id)

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={session.user.name} />
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Double Impact{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Referral Program
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Share your code with friends. When they donate e-waste, you both earn double points
            and help save the planet together.
          </p>
        </div>

        {/* Referral Hero */}
        <section className="mb-10">
          <ReferralHero code={code} stats={stats} />
        </section>

        {/* Stats */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">Your Stats</h2>
          <ReferralStats stats={stats} />
        </section>

        {/* How It Works */}
        <section className="mb-10 rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-6 text-xl font-bold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
                1
              </div>
              <h3 className="mt-4 font-medium">Share Your Code</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Copy your unique 8-character referral code and share it with friends, family, or colleagues.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
                2
              </div>
              <h3 className="mt-4 font-medium">Friends Donate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                When your friend signs up using your code and schedules their first e-waste pickup...
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
                3
              </div>
              <h3 className="mt-4 font-medium">Double Impact!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You both earn double points! Track the CO₂ saved from your friend's donation in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Timeline */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">Your Impact Timeline</h2>
          <ImpactTimeline events={impactTimeline} />
        </section>

        {/* FAQ */}
        <section className="rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-6 text-xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">How many people can I refer?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                There's no limit! Refer as many friends as you want and earn double points for each successful referral.
              </p>
            </div>
            <div>
              <h3 className="font-medium">When do I get my double points?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Points are awarded when your referred friend completes their first e-waste pickup. You'll see them in your timeline immediately.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Can I use multiple referral codes?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Each account can only be referred once. If you've already been referred, you can still share your own code with others!
              </p>
            </div>
            <div>
              <h3 className="font-medium">What counts as a successful referral?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A successful referral is when someone signs up with your code and completes at least one e-waste pickup donation.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
