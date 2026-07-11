'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'

export function CtaSection() {
  return (
    <section className="relative z-10 border-y border-border px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Ready to Share{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart
            </span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            List your first item or browse what others are giving away. It takes less than a minute.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/sign-up" className="group inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent px-6 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20">
              List an Item
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#categories"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-transparent px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Browse Items
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
            <Leaf className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">ReVive</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <a href="#categories" className="cursor-pointer transition-colors hover:text-foreground">
            Categories
          </a>
          <a href="#how-it-works" className="cursor-pointer transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#impact" className="cursor-pointer transition-colors hover:text-foreground">
            Impact
          </a>
          <a href="#" className="cursor-pointer transition-colors hover:text-foreground">
            Privacy
          </a>
        </nav>
        <p className="font-mono text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} ReVive
        </p>
      </div>
    </footer>
  )
}
