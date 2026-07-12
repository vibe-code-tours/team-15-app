"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Leaf, LogOut, Share2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { backendLogout } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"

export function AppHeader({ userName }: { userName?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await authClient.signOut()
    backendLogout()
    router.push("/")
    router.refresh()
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        pathname === href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">ReVive</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navLink("/donate", "Donate")}
          {navLink("/dashboard", "My Pickups")}
          {navLink("/referral", "Referral")}
          {navLink("/account", "Account")}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="size-4" />
              <span className="sr-only sm:not-sr-only">Sign out</span>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
