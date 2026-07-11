'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'

export function Newsletter() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative z-10 px-4 py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="flex flex-col items-start gap-8 rounded-2xl border border-border bg-primary/[0.03] p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h3 className="text-xl font-bold">Stay Connected</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Recycling tips, impact reports, and sustainability news.
              </p>
            </div>
            <div className="flex w-full gap-3 md:w-auto">
              {mounted ? (
                <>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:w-64"
                  />
                  <Button
                    type="button"
                    suppressHydrationWarning
                    className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-accent px-6 text-white"
                  >
                    Subscribe
                  </Button>
                </>
              ) : (
                <>
                  <div className="h-12 w-full rounded-xl border border-border bg-background/50 md:w-64" />
                  <div className="h-12 w-28 shrink-0 rounded-xl bg-primary" />
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
