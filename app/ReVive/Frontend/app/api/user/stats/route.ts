import { NextRequest } from "next/server"
import { withAuth, createSuccessResponse } from "@/lib/api/middleware"
import { getUserStats } from "@/app/actions/settings"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    const stats = await getUserStats(req.userId)

    return createSuccessResponse(stats)
  })
}
