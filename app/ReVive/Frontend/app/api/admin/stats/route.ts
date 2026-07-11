import { NextRequest } from "next/server"
import { withAuth, createSuccessResponse, createErrorResponse } from "@/lib/api/middleware"
import { getAdminStats } from "@/app/actions/admin"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      // Note: In production, add admin role check here
      // const isAdmin = await checkAdminRole(req.userId)
      // if (!isAdmin) return createErrorResponse("Forbidden", 403)

      const stats = await getAdminStats()

      return createSuccessResponse(stats)
    } catch {
      return createErrorResponse("Failed to fetch admin stats", 500)
    }
  })
}
