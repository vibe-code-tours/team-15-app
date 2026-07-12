import { setToken, removeToken, getToken } from "./cookies"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface LoginResponse {
  accessToken: string
  tokenType: string
}

interface UserResponse {
  id: string
  name: string
  email: string
}

export async function backendLogin(
  email: string,
  password: string
): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const json = await res.json()
  if (!json.success) throw new Error(json.error || "Login failed")

  setToken(json.data.accessToken)
  return getBackendUser()
}

export async function backendRegister(
  name: string,
  email: string,
  password: string
): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })

  const json = await res.json()
  if (!json.success) throw new Error(json.error || "Registration failed")

  setToken(json.data.accessToken)
  return getBackendUser()
}

export async function getBackendUser(): Promise<UserResponse | null> {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const json = await res.json()
  if (!json.success) {
    removeToken()
    return null
  }

  return json.data
}

export function backendLogout(): void {
  removeToken()
}
