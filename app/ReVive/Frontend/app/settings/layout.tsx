import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, Bell, Shield, ArrowLeft } from "lucide-react"
import { AppHeader } from "@/components/app-header"

const NAV_ITEMS = [
  { href: "/settings", label: "Overview", icon: User },
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/account", label: "Account", icon: Shield },
]

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={session.user.name} />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar Navigation */}
          <aside className="w-full shrink-0 md:w-56">
            <nav className="sticky top-6 rounded-2xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">Settings</span>
              </div>
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-border pt-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Back to Dashboard
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
