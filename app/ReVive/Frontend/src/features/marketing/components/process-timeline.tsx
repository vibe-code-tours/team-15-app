'use client'

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import { Truck, ArrowUpDown, Cpu, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    number: '01',
    title: 'List',
    description:
      'Post electronics you no longer need. Add photos, condition details, and your preferred pickup arrangement.',
    icon: Truck,
    label: 'Share Items',
    color: '#34d399',
  },
  {
    number: '02',
    title: 'Match',
    description:
      'People nearby discover your listing and request the item. You choose who gets it.',
    icon: ArrowUpDown,
    label: 'Peer Discovery',
    color: '#22d3ee',
  },
  {
    number: '03',
    title: 'Pickup',
    description:
      'Agree on a time and safe public location. Meet directly — no middleman, no fees.',
    icon: Cpu,
    label: 'Direct Handoff',
    color: '#a78bfa',
  },
  {
    number: '04',
    title: 'Impact',
    description:
      'Every item donated instead of discarded keeps electronics out of landfills and helps the community.',
    icon: RotateCcw,
    label: 'Track Results',
    color: '#fbbf24',
  },
]

/* ------------------------------------------------------------------ */
/*  Floating particles around each node                                */
/* ------------------------------------------------------------------ */

function NodeParticles({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        angle: (i / 6) * Math.PI * 2,
        dist: 28 + Math.random() * 16,
        size: 2 + Math.random() * 2,
        dur: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    [],
  )

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            left: `calc(50% + ${Math.cos(p.angle) * p.dist}px)`,
            top: `calc(50% + ${Math.sin(p.angle) * p.dist}px)`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
            x: [0, Math.cos(p.angle) * 6, 0],
            y: [0, Math.sin(p.angle) * 6, 0],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Single timeline step                                               */
/* ------------------------------------------------------------------ */

function TimelineStep({
  step,
  index,
  total,
}: {
  step: (typeof STEPS)[number]
  index: number
  total: number
}) {
  const isEven = index % 2 === 0
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const StepIcon = step.icon

  /* text entrance */
  const textX = isEven ? -60 : 60

  return (
    <div ref={ref} className="relative">
      {/* -------- SVG connector to next step -------- */}
      {index < total - 1 && (
        <div className="pointer-events-none absolute left-1/2 top-[calc(100%-1px)] z-0 h-20 w-px -translate-x-1/2 md:h-28 lg:h-36">
          <motion.div
            className="h-full w-full origin-top"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: `linear-gradient(to bottom, ${step.color}44, ${STEPS[index + 1].color}44)`,
            }}
          />
          {/* flowing dot */}
          <motion.div
            className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: step.color, boxShadow: `0 0 12px 2px ${step.color}66` }}
            animate={inView ? { top: ['0%', '100%'], opacity: [0, 1, 1, 0] } : {}}
            transition={{ duration: 1.6, delay: 0.8, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* -------- Main grid -------- */}
      <div
        className={cn(
          'relative z-10 grid items-center gap-6 lg:grid-cols-[1fr,auto] lg:gap-10',
        )}
      >
        {/* ===== Content side ===== */}
        <div
          className={cn(
            'relative flex flex-col',
            isEven ? 'lg:order-1 lg:items-end lg:text-right' : 'lg:order-1 lg:items-start lg:text-left',
          )}
        >
          {/* label pill */}
          <motion.div
            initial={{ opacity: 0, x: textX * 0.3, y: 10 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={cn(
              'mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-sm',
              'border-white/10 bg-white/[0.04]',
            )}
          >
            <StepIcon className="size-3.5" style={{ color: step.color }} />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {step.label}
            </span>
          </motion.div>

          {/* number badge + title */}
          <motion.div
            initial={{ opacity: 0, x: textX, y: 20 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn('flex items-center gap-4', isEven ? '' : '')}
          >
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-inset font-mono text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${step.color}22, ${step.color}08)`,
                color: step.color,
                boxShadow: `0 0 24px -4px ${step.color}20`,
                borderColor: `${step.color}25`,
              }}
            >
              {step.number}
            </span>
            <h3 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.6rem]">
              {step.title}
            </h3>
          </motion.div>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, x: textX * 0.6, y: 14 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn(
              'mt-5 max-w-md leading-relaxed text-muted-foreground lg:text-[0.95rem]',
              isEven ? 'lg:ml-auto' : '',
            )}
          >
            {step.description}
          </motion.p>

          {/* decorative step counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className={cn(
              'mt-5 hidden items-center gap-2 text-xs text-muted-foreground/40 lg:flex',
              isEven ? 'lg:flex-row-reverse' : '',
            )}
          >
            <div
              className="h-px w-8"
              style={{ background: `linear-gradient(${isEven ? 'to left' : 'to right'}, ${step.color}40, transparent)` }}
            />
            <span className="font-mono">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </motion.div>
        </div>

        {/* ===== Center node ===== */}
        <div className="relative z-10 flex items-center justify-center lg:order-2">
          {/* outer glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
            className="absolute size-16 rounded-full blur-xl"
            style={{ backgroundColor: `${step.color}18` }}
          />
          {/* pulsing ring */}
          <motion.div
            className="absolute size-14 rounded-full"
            style={{ border: `1.5px solid ${step.color}30` }}
            animate={
              inView
                ? { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }
                : {}
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* solid ring */}
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
            className="absolute size-12 rounded-full border bg-card/80 backdrop-blur-md"
            style={{ borderColor: `${step.color}35` }}
          />
          {/* inner dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.25 }}
            className="relative z-10 size-3.5 rounded-full"
            style={{
              backgroundColor: step.color,
              boxShadow: `0 0 16px 4px ${step.color}50`,
            }}
          />
          {/* floating particles */}
          <div className="absolute size-24">
            {inView && <NodeParticles color={step.color} />}
          </div>
        </div>

      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="mb-24 text-center md:mb-32">
      {/* badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-sm"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <span className="text-sm font-medium text-muted-foreground">Our Process</span>
      </motion.div>

      {/* heading — words reveal one by one */}
      <div className="mt-8 overflow-hidden">
        <motion.h2
          initial={{ y: '110%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
        >
          From One Person to{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Another
          </span>
        </motion.h2>
      </div>

      {/* subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
      >
        ReVive connects people who have electronics to give with people who
        need them — no middleman, just community.
      </motion.p>

      {/* decorative horizontal line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 h-px w-32 origin-center"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Scroll progress track (left-side, desktop)                         */
/* ------------------------------------------------------------------ */

function ScrollProgressTrack({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.65', 'end 0.35'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  })

  const height = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const glowY = useTransform(smoothProgress, (v) => `${v * 100}%`)

  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 lg:block">
      {/* track bg */}
      <div className="h-full w-full bg-white/[0.06]" />
      {/* filled portion */}
      <motion.div
        className="absolute inset-x-0 top-0 w-full origin-top"
        style={{
          height,
          background:
            'linear-gradient(to bottom, var(--primary), var(--accent), var(--primary))',
        }}
      />
      {/* traveling glow */}
      <motion.div
        className="absolute left-1/2 h-24 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          top: glowY,
          background: 'var(--primary)',
          opacity: 0.15,
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Terminal cycle node                                                 */
/* ------------------------------------------------------------------ */

function CycleNode() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className="relative z-10 mx-auto mt-24 flex flex-col items-center">
      {/* icon wrapper - contains all positioned elements */}
      <div className="relative flex size-20 items-center justify-center">
        {/* orbit ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed"
          style={{ borderColor: 'var(--primary)', opacity: 0.15 }}
          animate={inView ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        {/* outer glow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.1 }}
          className="absolute size-16 rounded-full blur-xl"
          style={{ background: 'var(--primary)', opacity: 0.08 }}
        />
        {/* icon circle */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.2 }}
          className="relative flex size-14 items-center justify-center rounded-full border border-primary/30 bg-card/80 backdrop-blur-md shadow-lg shadow-primary/10"
        >
          <RotateCcw className="size-6 text-primary" />
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-5 text-center text-sm tracking-wide text-muted-foreground/50"
      >
        The cycle continues
      </motion.p>
    </div>
  )
}

/* ================================================================== */
/*  Main export                                                         */
/* ================================================================== */

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={containerRef} className="relative overflow-hidden px-4 py-32 md:py-40">
      {/* -------- Ambient background -------- */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 size-[700px] -translate-x-1/2 rounded-full bg-primary/[0.035] blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 size-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />
        <div className="absolute right-1/4 top-2/3 size-[300px] rounded-full bg-primary/[0.025] blur-[80px]" />
      </div>

      {/* -------- Scroll-driven progress line (desktop center track) -------- */}
      <ScrollProgressTrack containerRef={containerRef} />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader />

        {/* -------- Steps -------- */}
        <div className="relative space-y-24 md:space-y-32 lg:space-y-40">
          {STEPS.map((step, i) => (
            <TimelineStep key={step.number} step={step} index={i} total={STEPS.length} />
          ))}
        </div>

        <CycleNode />
      </div>
    </section>
  )
}
