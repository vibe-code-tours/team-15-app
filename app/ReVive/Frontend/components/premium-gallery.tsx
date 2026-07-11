'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { Smartphone, Laptop, Tablet, Headphones } from 'lucide-react'

const GALLERY_ITEMS = [
  {
    image: '/smartphones.svg',
    title: 'Smartphones',
    category: 'Mobile Devices',
    icon: Smartphone,
    accent: 'text-emerald-400',
    stat: '12k+',
    statLabel: 'Donated',
  },
  {
    image: '/laptops.svg',
    title: 'Laptops',
    category: 'Computing',
    icon: Laptop,
    accent: 'text-cyan-400',
    stat: '8k+',
    statLabel: 'Donated',
  },
  {
    image: '/tablets.svg',
    title: 'Tablets',
    category: 'Mobile Devices',
    icon: Tablet,
    accent: 'text-violet-400',
    stat: '5k+',
    statLabel: 'Donated',
  },
  {
    image: '/audio.svg',
    title: 'Audio',
    category: 'Accessories',
    icon: Headphones,
    accent: 'text-amber-400',
    stat: '3k+',
    statLabel: 'Donated',
  },
]

export function PremiumGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40])
  const y2 = useTransform(scrollYProgress, [0, 1], [70, -70])
  const y3 = useTransform(scrollYProgress, [0, 1], [25, -25])
  const y4 = useTransform(scrollYProgress, [0, 1], [55, -55])

  const parallaxValues = [y1, y2, y3, y4]

  return (
    <section ref={containerRef} className="relative z-10 overflow-hidden px-4 py-32">
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-16">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary before:content-['//_'] before:text-primary/30">
            gallery
          </div>
          <h2 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            See What We{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Recycle
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {GALLERY_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={index * 0.12}>
                <motion.div style={{ y: parallaxValues[index] }} className="group">
                  <motion.article
                    whileHover={{ scale: 1.02, y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={cn(
                      'relative overflow-hidden rounded-2xl',
                      'border border-border/60 bg-card/40 backdrop-blur-md',
                      'transition-all duration-500 hover:border-primary/30'
                    )}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6 }}
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Category pill */}
                      <div className="absolute left-4 top-4 z-10 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                          <Icon className={cn('size-3', item.accent)} />
                          {item.category}
                        </div>
                      </div>

                      {/* Bottom content */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                        <div className="translate-y-4 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                          <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                          <div className="mt-2 flex items-baseline gap-1.5">
                            <span className={cn('text-2xl font-bold', item.accent)}>{item.stat}</span>
                            <span className="text-xs text-muted-foreground/70">{item.statLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
