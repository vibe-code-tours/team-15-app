import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/settings/profile-form"

export const metadata = {
  title: "Profile Settings - ReVive",
  description: "Update your profile information.",
}

export default async function ProfileSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Update your personal information and preferences.
        </p>
      </div>

      <ProfileForm
        user={{
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email,
        }}
      />
    </div>
  )
}
