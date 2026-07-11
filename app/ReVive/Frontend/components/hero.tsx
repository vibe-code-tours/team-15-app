'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function NeuralCluster() {
  const nodes = [
    { x: 180, y: 180, size: 72, color: 'rgba(16,185,129,0.25)', border: 'rgba(16,185,129,0.4)', delay: 0 },
    { x: 72, y: 36, size: 44, color: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.3)', delay: 0.5 },
    { x: 288, y: 48, size: 44, color: 'rgba(34,211,238,0.2)', border: 'rgba(34,211,238,0.3)', delay: 0.8 },
    { x: 36, y: 288, size: 44, color: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.3)', delay: 1.0 },
    { x: 288, y: 300, size: 44, color: 'rgba(167,139,250,0.2)', border: 'rgba(167,139,250,0.3)', delay: 1.2 },
    { x: 0, y: 144, size: 24, color: 'rgba(34,211,238,0.15)', border: 'rgba(34,211,238,0.2)', delay: 0.3 },
    { x: 360, y: 132, size: 24, color: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.2)', delay: 0.6 },
    { x: 96, y: 312, size: 20, color: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.18)', delay: 0.9 },
    { x: 264, y: 192, size: 20, color: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.18)', delay: 1.4 },
  ]

  return (
    <div className="relative h-[360px] w-[360px]">
      {/* SVG connecting lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 360">
        <line x1="180" y1="180" x2="72" y2="36" stroke="rgba(16,185,129,0.12)" strokeWidth="1" />
        <line x1="180" y1="180" x2="288" y2="48" stroke="rgba(34,211,238,0.1)" strokeWidth="1" />
        <line x1="180" y1="180" x2="36" y2="288" stroke="rgba(167,139,250,0.08)" strokeWidth="1" />
        <line x1="180" y1="180" x2="288" y2="300" stroke="rgba(16,185,129,0.1)" strokeWidth="1" />
        <line x1="180" y1="180" x2="0" y2="144" stroke="rgba(34,211,238,0.06)" strokeWidth="1" />
        <line x1="180" y1="180" x2="360" y2="132" stroke="rgba(167,139,250,0.06)" strokeWidth="1" />
        <line x1="72" y1="36" x2="288" y2="48" stroke="rgba(16,185,129,0.05)" strokeWidth="0.5" />
        <line x1="36" y1="288" x2="288" y2="300" stroke="rgba(34,211,238,0.05)" strokeWidth="0.5" />
        <circle cx="180" cy="180" r="120" stroke="rgba(16,185,129,0.05)" strokeWidth="0.5" fill="none" strokeDasharray="4 6" />
        <circle cx="180" cy="180" r="160" stroke="rgba(34,211,238,0.03)" strokeWidth="0.5" fill="none" strokeDasharray="4 6" />
      </svg>

      {/* Animated nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: node.x - node.size / 2,
            top: node.y - node.size / 2,
            width: node.size,
            height: node.size,
            background: `radial-gradient(circle, ${node.color}, transparent)`,
            border: `1.5px solid ${node.border}`,
            boxShadow: `0 0 ${node.size}px ${node.color}`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: node.delay,
          }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center px-4 pb-16 pt-32 md:pt-40">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-xs text-primary"
          >
            // Peer-to-Peer E-Waste Recycling
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-pretty text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          >
            Give Your Old Tech{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              a Second Life
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            List devices you no longer need, find electronics others are giving
            away, and arrange a pickup — all directly between people.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/sign-up" className="group inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent px-6 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20">
              List an Item
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-primary/20 bg-transparent px-6 text-base font-medium text-foreground transition-colors hover:bg-primary/5"
            >
              Browse Items →
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="hidden justify-center lg:flex"
        >
          <NeuralCluster />
        </motion.div>
      </div>
    </section>
  )
}
