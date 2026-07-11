import { NextRequest, NextResponse } from "next/server"
import { withAuth, createSuccessResponse, createErrorResponse } from "@/lib/api/middleware"
import { updateProfile, getUserStats, exportUserData } from "@/app/actions/settings"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    const stats = await getUserStats(req.userId)

    return createSuccessResponse({
      user: req.user,
      stats,
    })
  })
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json()
      const { name } = body

      if (!name || typeof name !== "string" || !name.trim()) {
        return createErrorResponse("Name is required", 400)
      }

      if (name.trim().length > 100) {
        return createErrorResponse("Name must be 100 characters or less", 400)
      }

      const result = await updateProfile({ name: name.trim() })

      if (result.error) {
        return createErrorResponse(result.error, 400)
      }

      return createSuccessResponse({ success: true }, "Profile updated successfully")
    } catch {
      return createErrorResponse("Failed to update profile", 500)
    }
  })
}
