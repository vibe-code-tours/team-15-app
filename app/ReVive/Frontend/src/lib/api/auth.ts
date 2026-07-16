import { serverLogin, serverRegister, serverLogout } from "@/app/actions/auth"
import { getToken } from "./cookies"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface UserResponse {
  id: string
  name: string
  email: string
}

export async function backendLogin(
  email: string,
  password: string
): Promise<UserResponse> {
  // Call the Next.js Server Action
  const loginRes = await serverLogin(email, password)
  if (loginRes && typeof loginRes === "object" && "_error" in loginRes) {
    throw new Error(loginRes._error as string)
  }
  const user = await getBackendUser()
  if (!user) throw new Error("Failed to fetch user after login")
  return user
}

export async function backendRegister(
  name: string,
  email: string,
  password: string
): Promise<UserResponse> {
  // Call the Next.js Server Action
  const regRes = await serverRegister(name, email, password)
  if (regRes && typeof regRes === "object" && "_error" in regRes) {
    throw new Error(regRes._error as string)
  }
  const user = await getBackendUser()
  if (!user) throw new Error("Failed to fetch user after register")
  return user
}

export async function getBackendUser(): Promise<UserResponse | null> {
  const token = await getToken()
  if (!token) return null

  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const json = await res.json()
  if (!json.success) {
    // If the token is invalid, we don't automatically delete the HttpOnly cookie here
    // because this might be called on the client. If it's a Server Action, we could.
    return null
  }

  return json.data
}

export async function backendLogout(): Promise<void> {
  // Call the Next.js Server Action
  await serverLogout()
}
