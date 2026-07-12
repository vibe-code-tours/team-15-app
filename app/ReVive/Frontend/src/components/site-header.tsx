'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { label: 'Browse', href: '/browse' },
  { label: 'Categories', href: '#categories' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Impact', href: '#impact' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-3 transition-colors duration-300 md:px-6 ${
          scrolled
            ? 'border-primary/10 bg-background/85 backdrop-blur-2xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a href="#" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <Leaf className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">ReVive</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/sign-in" className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
            Sign in
          </Link>
          <Link href="/sign-up" className="inline-flex h-8 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent px-3 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20">
            List an Item
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-background/95 p-4 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link href="/sign-in" onClick={() => setOpen(false)} className="inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                Sign in
              </Link>
              <Link href="/sign-up" onClick={() => setOpen(false)} className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent px-3 py-2 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20">
                List an Item
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
