import { cookies } from "next/headers"
import { getToken } from "./cookies"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

async function getTokenForRequest(): Promise<string | null> {
  // Client-side: use document.cookie
  if (typeof document !== "undefined") {
    return getToken()
  }

  // Server-side: use next/headers cookies
  try {
    const cookieStore = await cookies()
    return cookieStore.get("revive_backend_token")?.value || null
  } catch {
    return null
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const token = await getTokenForRequest()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json: ApiResponse<T> = await res.json()

  if (!json.success || json.error) {
    throw new ApiError(res.status, json.error || "Request failed")
  }

  return json.data as T
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>("GET", path)
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("POST", path, body)
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("PUT", path, body)
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("PATCH", path, body)
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>("DELETE", path)
}
