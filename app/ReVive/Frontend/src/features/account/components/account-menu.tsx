"use client"

import Link from "next/link"
import { useState } from "react"
import {
  User,
  Bell,
  Shield,
  Download,
  Trash2,
  Award,
  Package,
  Users,
  LogOut,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { backendLogout } from "@/lib/api/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AccountMenu() {
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const menuSections = [
    {
      title: "Profile & Settings",
      items: [
        {
          href: "/settings/profile",
          icon: User,
          label: "Edit Profile",
          description: "Update your name and personal information",
        },
        {
          href: "/settings/notifications",
          icon: Bell,
          label: "Notification Settings",
          description: "Manage email and push notifications",
        },
        {
          href: "/settings/account",
          icon: Shield,
          label: "Account Security",
          description: "Password and account management",
        },
      ],
    },
    {
      title: "Activity",
      items: [
        {
          href: "/dashboard",
          icon: Package,
          label: "My Pickups",
          description: "View and manage your donations",
        },
        {
          href: "/dashboard/achievements",
          icon: Award,
          label: "Achievements",
          description: "View your badges and milestones",
        },
        {
          href: "/referral",
          icon: Users,
          label: "Referral Program",
          description: "Share your code and earn rewards",
        },
      ],
    },
  ]

  const handleLogout = async () => {
    await backendLogout()
    window.location.href = "/"
  }

  return (
    <div className="space-y-6">
      {menuSections.map((section) => (
        <div key={section.title}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </h3>
          <Card className="divide-y divide-border">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </Link>
            ))}
          </Card>
        </div>
      ))}

      {/* Danger Zone */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-destructive">
          Account Actions
        </h3>
        <Card className="divide-y divide-border">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex w-full items-center justify-between p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10">
                <LogOut className="size-5 text-orange-500" />
              </div>
              <div className="text-left">
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex w-full items-center justify-between p-4 transition-colors hover:bg-destructive/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
                <Trash2 className="size-5 text-destructive" />
              </div>
              <div className="text-left">
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and data
                </p>
              </div>
            </div>
          </button>
        </Card>
      </div>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data including:
              <ul className="mt-2 list-inside list-disc">
                <li>Your profile information</li>
                <li>All pickup history</li>
                <li>Referral codes and stats</li>
                <li>Achievements and points</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push("/settings/account")}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
