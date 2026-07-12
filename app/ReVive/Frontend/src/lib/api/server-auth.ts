import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-in-production")

export async function getServerUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("revive_backend_token")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      id: payload.sub as string,
      name: (payload.name as string) || "User",
      email: (payload.email as string) || "",
    }
  } catch {
    return null
  }
}
