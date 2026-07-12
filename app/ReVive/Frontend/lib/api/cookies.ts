const JWT_COOKIE = "revive_backend_token"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function setToken(token: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${JWT_COOKIE}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${JWT_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function removeToken(): void {
  if (typeof document === "undefined") return
  document.cookie = `${JWT_COOKIE}=; path=/; max-age=0`
}

export function getTokenFromCookies(cookies: string): string | null {
  const match = cookies.match(new RegExp(`(?:^|; )${JWT_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
