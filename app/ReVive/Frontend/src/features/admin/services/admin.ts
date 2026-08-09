"use server"

import { apiGet } from "@/lib/api/client"

import { Pickup } from "@/features/pickups/types"

export type AdminStats = {
  totalPickups: number
  completedPickups: number
  activeUsers: number
  totalItems: number
  totalCo2Saved: string
  recentPickups: Array<{
    id: number
    deviceName: string
    category: string
    status: string
    createdAt: string
    userName: string | null
  }>
}

/** Get admin dashboard statistics */
export async function getAdminStats(): Promise<AdminStats> {
  const data = await apiGet<{ data: AdminStats }>("/api/admin/stats")
  return (data as unknown as { data: AdminStats }).data || (data as unknown as AdminStats)
}

/** Get all pickups (admin view) */
export async function getAllPickups(): Promise<Pickup[]> {
  const data = await apiGet<Pickup[]>("/api/admin/pickups")
  return data
}

export type AdminUser = {
  id: string
  name: string
  email: string
  createdAt: string
  pickupCount: number
  totalPoints: number
}

/** Get all users (admin view) */
export async function getAllUsers(): Promise<AdminUser[]> {
  const data = await apiGet<AdminUser[]>("/api/admin/users")
  return data
}

/** Get category breakdown */
export async function getCategoryBreakdown() {
  const data = await apiGet<Array<{ label: string; count: number }>>(
    "/api/admin/breakdown/categories"
  )
  return (data || []).map((d) => ({ category: d.label, count: d.count }))
}

/** Get status breakdown */
export async function getStatusBreakdown() {
  const data = await apiGet<Array<{ label: string; count: number }>>(
    "/api/admin/breakdown/status"
  )
  return (data || []).map((d) => ({ status: d.label, count: d.count }))
}
