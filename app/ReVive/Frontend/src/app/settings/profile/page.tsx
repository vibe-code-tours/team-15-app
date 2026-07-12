import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/api/server-auth"
import { ProfileForm } from "@/features/settings/components/profile-form"

export const metadata = {
  title: "Profile Settings - ReVive",
  description: "Update your profile information.",
}

export default async function ProfileSettingsPage() {
  const user = await getServerUser()
  if (!user) redirect("/sign-in")

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
          id: user.id,
          name: user.name || "",
          email: user.email,
        }}
      />
    </div>
  )
}
