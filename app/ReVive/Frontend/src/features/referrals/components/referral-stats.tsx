'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, animate, useReducedMotion } from 'framer-motion'
import { Users, Zap, Leaf, Clock } from 'lucide-react'
import { Reveal } from '@/components/reveal'

interface ReferralStatsProps {
  stats: {
    totalPoints: number
    doublePointsEarned: number
    referralsMade: number
    co2SavedFromReferrals: number
    pendingReferrals: number
  }
}

function Counter({
  to,
  suffix = '',
  decimals = 0,
}: {
  to: number
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [value, setValue] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion) {
      setValue(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, to, prefersReducedMotion])

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} aria-label={`${formatted}${suffix}`}>
      {formatted}
      {suffix}
    </span>
  )
}

const STATS = [
  {
    key: 'referralsMade',
    icon: Users,
    label: 'Friends Referred',
    sub: 'Total referrals',
    gradient: 'from-primary to-emerald-600',
  },
  {
    key: 'doublePointsEarned',
    icon: Zap,
    label: 'Double Points',
    sub: 'Bonus from referrals',
    gradient: 'from-accent to-cyan-600',
  },
  {
    key: 'co2SavedFromReferrals',
    icon: Leaf,
    label: 'CO₂ Saved',
    sub: 'From friend donations',
    gradient: 'from-emerald-400 to-green-600',
    suffix: ' kg',
    decimals: 1,
  },
  {
    key: 'pendingReferrals',
    icon: Clock,
    label: 'Pending',
    sub: 'Awaiting donations',
    gradient: 'from-amber-400 to-orange-600',
  },
]

export function ReferralStats({ stats }: ReferralStatsProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4" role="region" aria-label="Referral statistics">
      {STATS.map((stat, i) => {
        const Icon = stat.icon
        const value = stats[stat.key as keyof typeof stats] as number

        return (
          <Reveal key={stat.key} delay={i * 0.08}>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              {/* Icon */}
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5`}>
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>

              {/* Value - uses text-foreground for accessible contrast instead of gradient clip */}
              <p className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
                <Counter
                  to={value}
                  suffix={stat.suffix || ''}
                  decimals={stat.decimals || 0}
                />
              </p>

              {/* Label */}
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground/80">{stat.sub}</p>
            </motion.div>
          </Reveal>
        )
      })}
    </div>
  )
}
