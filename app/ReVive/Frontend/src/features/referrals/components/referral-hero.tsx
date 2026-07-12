'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Copy, Share2, ExternalLink, MessageCircle, Globe, Check } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

interface ReferralHeroProps {
  code: string
  stats: {
    totalPoints: number
    referralsMade: number
    co2SavedFromReferrals: number
  }
}

export function ReferralHero({ code, stats }: ReferralHeroProps) {
  const [copied, setCopied] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const referralLink = `https://revive.app/sign-up?ref=${code}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = referralLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(
      `♻️ I'm recycling my e-waste with ReVive and helping the planet! Join me using my referral code: ${code} 🌱`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `♻️ Check out ReVive - an e-waste recycling platform! Use my referral code ${code} to join: ${referralLink}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(referralLink)
    const summary = encodeURIComponent(
      `I'm recycling my e-waste with ReVive! Join me using my referral code: ${code}`
    )
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${summary}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_60%)]" />

      <Reveal>
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Double Your{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Impact
                </span>
              </h2>
              <p className="mt-2 text-muted-foreground">
                Share your referral code with friends. When they donate, you both earn double points!
              </p>
            </div>
            <div className="hidden rounded-full bg-primary/10 p-3 md:block">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Referral Code Display */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-xl border border-border bg-background/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Your Referral Code
              </p>
              <p className="mt-1 font-mono text-3xl font-bold tracking-widest text-primary">
                {code}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant={copied ? 'default' : 'outline'}
                className="gap-2 cursor-pointer"
                aria-label={copied ? 'Link copied to clipboard' : 'Copy referral link to clipboard'}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-background/30 p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.referralsMade}</p>
              <p className="text-xs text-muted-foreground">Friends Referred</p>
            </div>
            <div className="rounded-xl border border-border bg-background/30 p-4 text-center">
              <p className="text-2xl font-bold text-accent">{stats.totalPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Points Earned</p>
            </div>
            <div className="rounded-xl border border-border bg-background/30 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {stats.co2SavedFromReferrals.toFixed(1)} kg
              </p>
              <p className="text-xs text-muted-foreground">CO₂ Saved</p>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="mt-8">
            <p className="mb-4 text-sm font-medium text-muted-foreground">Share with friends</p>
            <div className="flex gap-3">
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={shareToTwitter}
                aria-label="Share on X (formerly Twitter)"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-border bg-background/50 text-muted-foreground transition-colors hover:border-sky-500/50 hover:text-sky-400"
              >
                <ExternalLink className="h-5 w-5" aria-hidden="true" />
              </motion.button>
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={shareToWhatsApp}
                aria-label="Share on WhatsApp"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-border bg-background/50 text-muted-foreground transition-colors hover:border-green-500/50 hover:text-green-400"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </motion.button>
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={shareToLinkedIn}
                aria-label="Share on LinkedIn"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-border bg-background/50 text-muted-foreground transition-colors hover:border-blue-500/50 hover:text-blue-400"
              >
                <Globe className="h-5 w-5" aria-hidden="true" />
              </motion.button>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-8 rounded-xl border border-border bg-background/30 p-4">
            <p className="mb-3 text-sm font-medium">How Double Impact Works</p>
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  1
                </span>
                <p>Share your code with friends</p>
              </div>
              <div className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  2
                </span>
                <p>They sign up & schedule a pickup</p>
              </div>
              <div className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  3
                </span>
                <p>You both earn double impact points!</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
