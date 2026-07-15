"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Leaf, Gift, Loader2 } from "lucide-react"
import { backendLogin, backendRegister } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { applyReferralCode } from "@/features/referrals/services/referrals"

function AuthFormInner({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get("ref")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [referralInput, setReferralInput] = useState(referralCode?.toUpperCase() || "")
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === "sign-up"

  const validateFields = (): boolean => {
    const errors: Record<string, string> = {}
    if (isSignUp && !name.trim()) {
      errors.name = "Name is required"
    }
    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateFields()) return

    setLoading(true)

    try {
      let user
      if (isSignUp) {
        user = await backendRegister(name, email, password)
      } else {
        user = await backendLogin(email, password)
      }

      setLoading(false)

      // Apply referral code if provided during sign up
      if (isSignUp && referralInput && user?.id) {
        await applyReferralCode(referralInput, user.id)
      }

      router.push("/browse")
      router.refresh()
    } catch (err: any) {
      setLoading(false)
      setError(err.message || "An unexpected error occurred")
    }
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-start">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            ← Back to Home
          </Link>
        </div>
        
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 cursor-pointer">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <span className="text-xl font-semibold tracking-tight">ReVive</span>
        </Link>

        <Card className="w-full p-6 bg-card/80 backdrop-blur border-border/60">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              {isSignUp ? "Join the movement" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-pretty">
              {isSignUp
                ? "Create an account to start sharing and finding electronics."
                : "Sign in to manage your listings and track your impact."}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="text-sm text-destructive" role="alert">{fieldErrors.name}</p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">{fieldErrors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
              />
              {fieldErrors.password && (
                <p id="password-error" className="text-sm text-destructive" role="alert">{fieldErrors.password}</p>
              )}
            </div>

            {/* Referral Code Input (Sign Up only) */}
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="referral" className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" aria-hidden="true" />
                  Referral Code (Optional)
                </Label>
                <Input
                  id="referral"
                  placeholder="e.g. ABC12345"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase().slice(0, 8))}
                  maxLength={8}
                  className="font-mono tracking-widest"
                />
                {referralInput && (
                  <p className="text-xs text-primary">
                    Your friend will earn double points!
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Please wait...
                </>
              ) : isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="text-primary font-medium underline-offset-4 hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <Suspense fallback={
      <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </span>
            <span className="text-xl font-semibold tracking-tight">ReVive</span>
          </Link>
          <Card className="w-full p-6 bg-card/80 backdrop-blur border-border/60">
            <div className="flex items-center justify-center py-8" role="status">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="sr-only">Loading...</span>
            </div>
          </Card>
        </div>
      </main>
    }>
      <AuthFormInner mode={mode} />
    </Suspense>
  )
}
