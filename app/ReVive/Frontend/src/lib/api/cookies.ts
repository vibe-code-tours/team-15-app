const JWT_COOKIE = "revive_backend_token"

/**
 * Get token from cookie - server-side only.
 * For client-side, use the getSessionToken server action from @/app/actions/auth.
 */
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
