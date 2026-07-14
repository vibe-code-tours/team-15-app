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
  try {
    const { cookies } = await import("next/headers")
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

  const contentType = res.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    throw new ApiError(res.status, `Server error (${res.status})`)
  }

  const json = await res.json()

  if (!res.ok) {
    const message = json.error || json.detail || `Request failed (${res.status})`
    throw new ApiError(res.status, message)
  }

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

export async function apiUpload<T>(path: string, files: File[]): Promise<T> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append("files", file)
  })

  const token = await getTokenForRequest()
  const headers: Record<string, string> = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  })

  const contentType = res.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    // Try to read the response body for a better error message
    const text = await res.text().catch(() => "")
    const detail = text ? `: ${text.slice(0, 200)}` : ""
    throw new ApiError(res.status, `Upload failed — server returned non-JSON (${res.status})${detail}`)
  }

  const json = await res.json()

  if (!res.ok) {
    const message = json.error || json.detail || `Upload failed (${res.status})`
    throw new ApiError(res.status, message)
  }

  if (!json.success || json.error) {
    throw new ApiError(res.status, json.error || "Upload failed")
  }

  return json.data as T
}
