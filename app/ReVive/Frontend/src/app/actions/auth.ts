"use server"

import { cookies } from "next/headers"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function serverLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const json = await res.json()
  if (!json.success) return { _error: json.error || "Login failed" }

  const token = json.data.accessToken
  const cookieStore = await cookies()
  
  // Set the cookie securely on the Vercel server (First-Party Cookie)
  cookieStore.set("revive_backend_token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  })

  return json.data
}

export async function serverRegister(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })

  const json = await res.json()
  if (!json.success) return { _error: json.error || "Registration failed" }

  const token = json.data.accessToken
  const cookieStore = await cookies()

  // Set the cookie securely on the Vercel server (First-Party Cookie)
  cookieStore.set("revive_backend_token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  })

  return json.data
}

export async function serverLogout() {
  const cookieStore = await cookies()
  cookieStore.delete("revive_backend_token")
}
