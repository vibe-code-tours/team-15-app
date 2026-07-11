'use client'

import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/reveal'

function AnimatedCounter({
  to,
  suffix = '',
  decimals = 0,
}: {
  to: number
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.21, 0.47, 0.32, 0.98],
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
  {
    to: 2.4,
    suffix: 'M',
    decimals: 1,
    label: 'Items Rehomed',
    description: 'Electronics given a second life by the community',
  },
  {
    to: 48,
    suffix: 'K+',
    decimals: 0,
    label: 'Peer Pickups',
    description: 'Direct handoffs between donors and recipients',
  },
  {
    to: 3.1,
    suffix: 'M',
    decimals: 1,
    label: 'kg CO₂ Saved',
    description: 'Carbon emissions prevented through reuse',
  },
  {
    to: 96,
    suffix: '%',
    decimals: 0,
    label: 'Satisfaction',
    description: 'Of users would recommend ReVive',
  },
]

export function PremiumStats() {
  return (
    <section className="relative z-10 px-4 py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary before:content-['//_'] before:text-primary/30">
            premium stats
          </div>
          <h2 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Numbers That{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Matter</span>
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_70%)]" />
                <div className="relative mb-4 text-5xl font-bold transition-colors duration-300 md:text-6xl">
                  <span className="bg-gradient-to-br from-primary/20 to-primary/30 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary/30 group-hover:to-accent/30">
                    <AnimatedCounter
                      to={stat.to}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </span>
                </div>
                <h3 className="relative text-lg font-semibold">{stat.label}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
