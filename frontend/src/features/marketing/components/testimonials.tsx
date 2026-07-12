'use client'

import { Reveal } from '@/components/reveal'

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'Environmental Advocate',
    content:
      'I listed my old phone and it was picked up by a neighbor within a day. ReVive made it effortless to give my devices a second life.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    initials: 'MJ',
    role: 'Tech Professional',
    content:
      'I refresh my laptop every year. Instead of throwing old ones away, I list them here and someone locally always needs one.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    initials: 'ER',
    role: 'Sustainability Consultant',
    content:
      'The transparency is what sold me. I can see exactly who picked up my items and how many devices have been kept out of landfills.',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="relative z-10 px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary before:content-['//_'] before:text-primary/30">
            testimonials
          </div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Community Voices
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Hear from people who are making a difference.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="grid items-center gap-5 rounded-2xl border border-primary/10 bg-primary/[0.03] p-6 md:grid-cols-[auto_1fr_auto]">
                {/* Avatar */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                  {t.initials}
                </div>
                {/* Quote */}
                <blockquote className="text-sm leading-relaxed text-muted-foreground/90 md:text-base">
                  &ldquo;{t.content}&rdquo;
                </blockquote>
                {/* Meta */}
                <div className="border-l-2 border-border pl-5 text-right">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="mt-1 text-xs text-primary/60">
                    {'★'.repeat(t.rating)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
