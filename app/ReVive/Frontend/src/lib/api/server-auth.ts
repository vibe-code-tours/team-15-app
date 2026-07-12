import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-in-production")

export async function getServerUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("revive_backend_token")?.value

  if (!token) return null

  try {
    // Verify the JWT token is valid
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (!payload.sub) return null

    // Fetch fresh user data from Backend API
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const json = await res.json()
    if (!json.success || !json.data) return null

    return {
      id: json.data.id,
      name: json.data.name || "User",
      email: json.data.email || "",
    }
  } catch {
    return null
  }
}
