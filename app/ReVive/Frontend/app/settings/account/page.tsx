import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AccountActions } from "@/components/settings/account-actions"

export const metadata = {
  title: "Account Settings - ReVive",
  description: "Manage your account data and security.",
}

export default async function AccountSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account data, exports, and security settings.
        </p>
      </div>

      <AccountActions />
    </div>
  )
}
