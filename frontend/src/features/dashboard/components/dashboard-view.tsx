"use client"

import Link from "next/link"
import { Plus, Share2 } from "lucide-react"
import { PickupList } from "@/features/dashboard/components/pickup-list"
import { ReferralHero } from "@/features/referrals/components/referral-hero"
import { ReferralStats } from "@/features/referrals/components/referral-stats"
import { ImpactTimeline } from "@/features/dashboard/components/impact-timeline"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Pickup } from "@/features/pickups/types"
import type { ReferralStats as ReferralStatsType } from "@/features/referrals/types"
import type { ImpactEvent } from "@/features/referrals/types"

type DashboardViewProps = {
  pickups: Pickup[]
  referralCode: string
  referralStats: ReferralStatsType
  impactTimeline: ImpactEvent[]
  userName: string
}

export function DashboardView({
  pickups,
  referralCode,
  referralStats,
  impactTimeline,
  userName,
}: DashboardViewProps) {
  const available = pickups.filter((p) => p.status === "available")
  const requested = pickups.filter((p) => p.status === "requested")
  const rehomed = pickups.filter((p) => p.status === "picked_up")

  const stats = [
    { label: "Total listings", value: pickups.length },
    { label: "Available", value: available.length },
    { label: "Requests", value: requested.length },
    { label: "Rehomed", value: rehomed.length },
  ]

  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="mt-1 text-muted-foreground">Track your items and environmental impact.</p>
          </div>
          <Link href="/donate" className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 cursor-pointer">
            <Plus className="mr-1 size-4" /> New listing
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4" role="region" aria-label="Pickup summary">
          {stats.map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <PickupList pickups={pickups} />
        </div>

        <section className="mt-10" aria-label="Referral program">
          <ReferralHero code={referralCode} stats={referralStats} />
        </section>

        <section className="mt-10" aria-label="Referral statistics">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Referral Stats</h2>
            <Link href="/referral" className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <Share2 className="mr-2 h-4 w-4" />
              View All
            </Link>
          </div>
          <ReferralStats stats={referralStats} />
        </section>

        <section className="mt-10" aria-label="Recent impact">
          <h2 className="mb-4 text-xl font-bold">Recent Impact</h2>
          <ImpactTimeline events={impactTimeline} />
        </section>
      </main>
    </div>
  )
}
