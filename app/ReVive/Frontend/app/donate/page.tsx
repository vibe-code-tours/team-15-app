import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ScheduleForm } from "@/components/schedule-form"
import { AppHeader } from "@/components/app-header"

export const metadata = {
  title: "List an Item",
  description:
    "Post an electronic device you no longer need. Add details, set a pickup location, and connect with someone who can give it a second life.",
}

export default async function DonatePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <AppHeader userName={session.user.name} />
      <main className="px-4 py-12">
        <div className="mx-auto mb-10 max-w-lg text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">List an item</span>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Share your electronics
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Add details about your device, set a pickup location, and someone
            nearby will give it a second life.
          </p>
        </div>
        <ScheduleForm />
      </main>
    </div>
  )
}
