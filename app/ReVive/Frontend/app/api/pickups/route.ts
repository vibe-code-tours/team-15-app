import { NextRequest } from "next/server"
import {
  withAuth,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
} from "@/lib/api/middleware"
import { getPickups, createPickup } from "@/app/actions/pickups"
import { validatePickupInput } from "@/lib/api/validators"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const url = new URL(req.url)
      const page = parseInt(url.searchParams.get("page") || "1")
      const limit = Math.min(50, parseInt(url.searchParams.get("limit") || "20"))
      const status = url.searchParams.get("status")

      let pickups = await getPickups()

      // Filter by status if provided
      if (status) {
        pickups = pickups.filter((p) => p.status === status)
      }

      // Paginate
      const total = pickups.length
      const offset = (page - 1) * limit
      const paginatedPickups = pickups.slice(offset, offset + limit)

      return createPaginatedResponse(paginatedPickups, total, page, limit)
    } catch {
      return createErrorResponse("Failed to fetch pickups", 500)
    }
  })
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json()

      // Validate input
      const errors = validatePickupInput(body)
      if (errors.length > 0) {
        return createErrorResponse(
          errors.map((e) => e.message).join(", "),
          400
        )
      }

      const result = await createPickup({
        category: body.category,
        deviceName: body.deviceName,
        quantity: body.quantity || 1,
        condition: body.condition || "working",
        pickupDate: body.pickupDate,
        timeSlot: body.timeSlot,
        address: body.address,
        notes: body.notes,
      })

      if (result?.error) {
        return createErrorResponse(result.error, 400)
      }

      return createSuccessResponse({ success: true }, "Item listed successfully")
    } catch {
      return createErrorResponse("Failed to create pickup", 500)
    }
  })
}
