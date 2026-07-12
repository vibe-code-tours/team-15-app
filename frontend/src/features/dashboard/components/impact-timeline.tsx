'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Leaf, Zap, Gift, Clock } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

interface ImpactEvent {
  id: string
  type: string
  points: number
  co2Saved: number | null
  createdAt: Date | null
  referredName: string | null
}

interface ImpactTimelineProps {
  events: ImpactEvent[]
}

function getEventIcon(type: string) {
  switch (type) {
    case 'double_impact':
      return <Zap className="h-4 w-4" />
    case 'referral_bonus':
      return <Gift className="h-4 w-4" />
    case 'donation':
      return <Leaf className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function getEventColor(type: string) {
  switch (type) {
    case 'double_impact':
      return 'bg-primary/20 text-primary border-primary/30'
    case 'referral_bonus':
      return 'bg-accent/20 text-accent border-accent/30'
    case 'donation':
      return 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

function getEventDescription(event: ImpactEvent) {
  switch (event.type) {
    case 'double_impact':
      return (
        <>
          <span className="font-medium text-foreground">
            {event.referredName || 'A friend'}
          </span>{' '}
          donated e-waste — you earned{' '}
          <span className="font-medium text-primary">+{event.points} double points</span>!
        </>
      )
    case 'referral_bonus':
      return (
        <>
          You referred a new user — earned{' '}
          <span className="font-medium text-accent">+{event.points} bonus points</span>!
        </>
      )
    case 'donation':
      return (
        <>
          You donated e-waste — earned{' '}
          <span className="font-medium text-emerald-400">+{event.points} points</span>!
        </>
      )
    default:
      return 'Impact event'
  }
}

function formatDate(date: Date | null) {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ImpactTimeline({ events }: ImpactTimelineProps) {
  const prefersReducedMotion = useReducedMotion()

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center" role="status">
        <Leaf className="mx-auto h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">No impact events yet</p>
        <p className="mt-2 text-sm text-muted-foreground/80">
          Share your referral code to start earning double impact points!
        </p>
      </div>
    )
  }

  return (
    <div className="relative" role="list" aria-label="Impact timeline">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-8" aria-hidden="true" />

      {/* Events */}
      <div className="space-y-6">
        {events.map((event, i) => (
          <Reveal key={event.id} delay={prefersReducedMotion ? 0 : i * 0.05}>
            <div className="relative flex gap-4" role="listitem">
              {/* Timeline dot */}
              <div className="relative z-10">
                <motion.div
                  initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border',
                    getEventColor(event.type)
                  )}
                  aria-hidden="true"
                >
                  {getEventIcon(event.type)}
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {getEventDescription(event)}
                  </p>
                  {event.createdAt && (
                    <time
                      className="shrink-0 text-xs text-muted-foreground/80"
                      dateTime={new Date(event.createdAt).toISOString()}
                    >
                      {formatDate(event.createdAt)}
                    </time>
                  )}
                </div>

                {/* CO2 badge */}
                {event.co2Saved && event.co2Saved > 0 && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                    <Leaf className="h-3 w-3" aria-hidden="true" />
                    {event.co2Saved.toFixed(1)} kg CO₂ saved
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
