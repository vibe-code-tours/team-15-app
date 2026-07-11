import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, Bell, Shield, ChevronRight } from "lucide-react"
import { getUserStats } from "@/app/actions/settings"

export const metadata = {
  title: "Settings - ReVive",
  description: "Manage your account settings and preferences.",
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const stats = await getUserStats(session.user.id)

  const sections = [
    {
      href: "/settings/profile",
      icon: User,
      title: "Profile",
      description: "Update your name and personal information",
    },
    {
      href: "/settings/notifications",
      icon: Bell,
      title: "Notifications",
      description: "Manage how you receive updates",
    },
    {
      href: "/settings/account",
      icon: Shield,
      title: "Account",
      description: "Password, data export, and account deletion",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Summary */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold">{session.user.name}</h2>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-2xl font-bold">{stats.totalPickups}</p>
            <p className="text-xs text-muted-foreground">Total Pickups</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-2xl font-bold">{stats.totalPoints}</p>
            <p className="text-xs text-muted-foreground">Points Earned</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-2xl font-bold">{stats.totalReferrals}</p>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20">
                <section.icon className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}
