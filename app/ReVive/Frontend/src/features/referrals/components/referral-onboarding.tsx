'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { applyReferralCode } from '@/features/referrals/services/referrals'

interface ReferralOnboardingProps {
  userId: string
  onSuccess?: () => void
  onSkip?: () => void
}

export function ReferralOnboarding({ userId, onSuccess, onSkip }: ReferralOnboardingProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (code.length !== 8) {
      setError('Referral code must be 8 characters')
      return
    }

    startTransition(async () => {
      const result = await applyReferralCode(code.toUpperCase(), userId)

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onSkip}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onSkip}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20"
              >
                <Check className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="mt-4 text-xl font-bold">Welcome to the team!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your friend will earn double impact points thanks to you. Start scheduling pickups to earn your own rewards!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/20 p-3">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Got a referral code?</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a friend's code to help them earn double points
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="referral-code">Referral Code</Label>
                  <Input
                    id="referral-code"
                    type="text"
                    placeholder="e.g. ABC12345"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase().slice(0, 8))
                      setError('')
                    }}
                    className="text-center font-mono text-lg tracking-widest"
                    maxLength={8}
                    disabled={isPending}
                  />
                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={code.length !== 8 || isPending}
                >
                  {isPending ? (
                    'Applying code...'
                  ) : (
                    <>
                      Apply Code
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Skip */}
              <button
                onClick={onSkip}
                className="mt-4 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip for now
              </button>

              {/* Benefits */}
              <div className="mt-6 rounded-xl border border-border bg-background/50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  What you get
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Your friend earns double points
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Track their environmental impact
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Build a sustainable community together
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
