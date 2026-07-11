"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pickups, user, userPoints } from "@/lib/db/schema"
import { count, eq, desc, sql } from "drizzle-orm"
import { headers } from "next/headers"

async function getAdminUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")

  // In a real app, check for admin role:
  // const isAdmin = await checkAdminRole(session.user.id)
  // if (!isAdmin) throw new Error("Forbidden")

  return session.user
}

export async function getAdminStats() {
  await getAdminUser()

  // Get total pickups
  const totalPickupsResult = await db
    .select({ count: count() })
    .from(pickups)
  const totalPickups = totalPickupsResult[0]?.count || 0

  // Get completed pickups
  const completedPickupsResult = await db
    .select({ count: count() })
    .from(pickups)
    .where(eq(pickups.status, "completed"))
  const completedPickups = completedPickupsResult[0]?.count || 0

  // Get active users
  const activeUsersResult = await db.select({ count: count() }).from(user)
  const activeUsers = activeUsersResult[0]?.count || 0

  // Get total items and CO2 saved
  const itemsResult = await db
    .select({
      totalItems: sql<number>`coalesce(sum(${pickups.quantity}), 0)`,
    })
    .from(pickups)
    .where(sql`${pickups.status} != 'cancelled'`)
  const totalItems = itemsResult[0]?.totalItems || 0
  const totalCo2Saved = (totalItems * 2.2).toFixed(1)

  // Get recent pickups with user info
  const recentPickups = await db
    .select({
      id: pickups.id,
      deviceName: pickups.deviceName,
      category: pickups.category,
      status: pickups.status,
      createdAt: pickups.createdAt,
      userName: user.name,
    })
    .from(pickups)
    .leftJoin(user, eq(pickups.userId, user.id))
    .orderBy(desc(pickups.createdAt))
    .limit(5)

  return {
    totalPickups,
    completedPickups,
    activeUsers,
    totalItems,
    totalCo2Saved,
    recentPickups,
  }
}

export async function getAllPickups() {
  await getAdminUser()

  return db
    .select({
      id: pickups.id,
      userId: pickups.userId,
      category: pickups.category,
      deviceName: pickups.deviceName,
      quantity: pickups.quantity,
      condition: pickups.condition,
      pickupDate: pickups.pickupDate,
      timeSlot: pickups.timeSlot,
      address: pickups.address,
      notes: pickups.notes,
      status: pickups.status,
      createdAt: pickups.createdAt,
      userName: user.name,
      userEmail: user.email,
    })
    .from(pickups)
    .leftJoin(user, eq(pickups.userId, user.id))
    .orderBy(desc(pickups.createdAt))
}

export async function getAllUsers() {
  await getAdminUser()

  const usersWithStats = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      pickupCount: count(pickups.id),
      totalPoints: userPoints.totalPoints,
    })
    .from(user)
    .leftJoin(pickups, eq(pickups.userId, user.id))
    .leftJoin(userPoints, eq(userPoints.userId, user.id))
    .groupBy(user.id)
    .orderBy(desc(user.createdAt))

  return usersWithStats.map((u) => ({
    ...u,
    pickupCount: u.pickupCount || 0,
    totalPoints: u.totalPoints || 0,
  }))
}

export async function getCategoryBreakdown() {
  await getAdminUser()

  const breakdown = await db
    .select({
      category: pickups.category,
      count: count(),
    })
    .from(pickups)
    .groupBy(pickups.category)
    .orderBy(desc(count()))

  return breakdown
}

export async function getStatusBreakdown() {
  await getAdminUser()

  const breakdown = await db
    .select({
      status: pickups.status,
      count: count(),
    })
    .from(pickups)
    .groupBy(pickups.status)
    .orderBy(desc(count()))

  return breakdown
}
