'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Leaf, TrendingUp } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const FEATURES = [
  {
    icon: Shield,
    title: 'Trusted Community',
    description: 'Verified profiles and ratings help you feel confident when arranging pickups with strangers.',
    stat: '100%',
    statLabel: 'Verified',
  },
  {
    icon: Clock,
    title: 'Instant Listings',
    description: 'Snap a photo, add details, and post an item in under 60 seconds. It\'s free, always.',
    stat: '60s',
    statLabel: 'To Post',
  },
  {
    icon: Leaf,
    title: 'Zero Landfill',
    description: 'Every device rehomed through ReVive is one less thing sitting in a landfill.',
    stat: '0%',
    statLabel: 'To Landfill',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Impact',
    description: 'See how many devices you\'ve donated, how much CO₂ you\'ve prevented, and your community reach.',
    stat: '24/7',
    statLabel: 'Tracking',
  },
]

export function PremiumFeatures() {
  return (
    <section className="px-4 py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary before:content-['//_'] before:text-primary/30">
            features
          </div>
          <div className="mt-4 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-5xl font-bold tracking-tight md:text-6xl">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ReVive</span>
              </h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-muted-foreground">
                We've reimagined e-waste recycling from the ground up, creating
                a seamless, transparent, and impactful experience.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.1}>
              <motion.article
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-colors duration-300 hover:border-primary/30 md:p-10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="size-7" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <div className="ml-6 text-right">
                    <p className="text-4xl font-bold text-primary/20 transition-colors duration-300 group-hover:text-primary/40">
                      {feature.stat}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {feature.statLabel}
                    </p>
                  </div>
                </div>

                {/* Subtle gradient overlay on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
