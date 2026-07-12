import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import Link from "next/link"
import { LayoutDashboard, Users, Package, BarChart3, ArrowLeft } from "lucide-react"
import { AppHeader } from "@/components/app-header"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pickups", label: "Listings", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

  // In a real app, you'd check for admin role here
  // For now, we'll allow all authenticated users to access admin

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={user.name} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar Navigation */}
          <aside className="w-full shrink-0 md:w-64">
            <nav className="sticky top-6 rounded-2xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">Admin Panel</span>
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
