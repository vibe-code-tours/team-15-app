'use client'

import { Reveal } from '@/components/reveal'

const SHOWCASE_ITEMS = [
  {
    image: '/hero-ewaste.png',
    title: 'Community Donations',
    tag: 'Peer-to-Peer',
  },
  {
    image: '/impact-recycling.png',
    title: 'Local Pickups',
    tag: 'Your Neighbors',
  },
  {
    image: '/hero-ewaste.png',
    title: 'Rehomed Devices',
    tag: 'Second Life',
  },
]

export function PremiumShowcase() {
  return (
    <section className="relative z-10 px-4 py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary before:content-['//_'] before:text-primary/30">
            showcase
          </div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Premium Showcase
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Real items shared by real people in your community.
          </p>
        </Reveal>

        {/* Asymmetric grid: first item tall, two stacked right */}
        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-[240px_200px]">
          <Reveal delay={0} className="md:row-span-2">
            <div className="group relative h-full overflow-hidden rounded-2xl border border-border">
              <img
                src={SHOWCASE_ITEMS[0].image}
                alt={SHOWCASE_ITEMS[0].title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                📱 {SHOWCASE_ITEMS[0].tag}
              </span>
            </div>
          </Reveal>

          {SHOWCASE_ITEMS.slice(1).map((item, i) => (
            <Reveal key={item.title} delay={0.1 + i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                  ⚙️ {item.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
