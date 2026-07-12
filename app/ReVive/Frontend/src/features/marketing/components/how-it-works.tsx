'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '@/components/reveal'

const STEPS = [
  {
    step: '01',
    title: 'List',
    desc: 'Snap a photo, add details, and post items you want to give away.',
  },
  {
    step: '02',
    title: 'Connect',
    desc: 'Someone nearby requests your item. You agree on a pickup time and place.',
  },
  {
    step: '03',
    title: 'Impact',
    desc: 'Track the environmental impact of every device that finds a new home.',
  },
]

export function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="relative z-10 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary before:content-['//_'] before:text-primary/30">
            process
          </div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            How It Works
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Three steps to a cleaner planet.
          </p>
        </Reveal>

        <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-0">
          {/* Connecting line: circle 01 → circle 02 */}
          <div
            ref={lineRef}
            className="pointer-events-none absolute left-[calc(16.67%+36px)] right-[calc(50%+36px)] top-[28px] hidden h-0.5 md:block"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={lineInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full origin-left bg-gradient-to-r from-primary to-accent"
            />
          </div>
          {/* Connecting line: circle 02 → circle 03 */}
          <div
            className="pointer-events-none absolute left-[calc(50%+36px)] right-[calc(16.67%+36px)] top-[28px] hidden h-0.5 md:block"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={lineInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full origin-left bg-gradient-to-r from-accent to-purple-500"
            />
          </div>

          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.12}>
              <div className="text-center md:px-6">
                {/* Node dot */}
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border-2 border-primary/30 bg-background font-mono text-sm font-bold text-primary shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
