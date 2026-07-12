'use client'

import { Reveal } from '@/components/reveal'

const CATEGORIES = [
  { icon: '📱', title: 'Smartphones', count: '2.4K shared' },
  { icon: '💻', title: 'Computers', count: '1.8K shared' },
  { icon: '🔌', title: 'Accessories', count: '5.1K shared' },
  { icon: '📺', title: 'Appliances', count: '2.7K shared' },
]

export function Categories() {
  return (
    <section id="categories" className="relative z-10 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary before:content-['//_'] before:text-primary/30">
            categories
          </div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            What We Accept
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Virtually any electronic device, from smartphones to appliances.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 0.06}>
              <div className="flex items-center gap-3 rounded-full border border-primary/15 bg-primary/5 px-6 py-4 transition-all hover:bg-primary/10 hover:border-primary/30 cursor-pointer">
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.title}</span>
                <span className="font-mono text-xs text-primary">[{cat.count}]</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
