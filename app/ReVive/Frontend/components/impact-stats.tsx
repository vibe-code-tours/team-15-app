'use client'

import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/reveal'

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

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

const STATS = [
  { to: 12000, suffix: '+', decimals: 0, label: 'Items Donated', sub: '+18% this month' },
  { to: 8.5, suffix: 'T', decimals: 1, label: 'CO₂ Prevented', sub: '+23% this quarter' },
  { to: 3200, suffix: '', decimals: 0, label: 'Active Users', sub: '+412 new users' },
  { to: 98, suffix: '%', decimals: 0, label: 'Satisfaction', sub: 'Based on 2.1K reviews' },
]

export function ImpactStats() {
  return (
    <section id="impact" className="relative z-10 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary before:content-['//_'] before:text-primary/30">
            impact
          </div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            By the Numbers
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Measurable results from our growing community.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center"
              >
                {/* Radial glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06),transparent_70%)]" />
                <p className="relative text-3xl font-bold md:text-4xl">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    <Counter to={stat.to} suffix={stat.suffix} decimals={stat.decimals} />
                  </span>
                </p>
                <p className="relative mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
                <p className="relative mt-2 font-mono text-xs text-primary/50">
                  {stat.sub}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
