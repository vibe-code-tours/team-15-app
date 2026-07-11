import { NextRequest } from "next/server"
import { withAuth, createSuccessResponse, createErrorResponse } from "@/lib/api/middleware"
import { cancelPickup, deletePickup, completePickup } from "@/app/actions/pickups"
import { validateNumber } from "@/lib/api/validators"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params
      const pickupId = parseInt(id)

      const error = validateNumber(pickupId, "id", { min: 1, integer: true })
      if (error) {
        return createErrorResponse(error.message, 400)
      }

      // Note: In a real app, you'd fetch the specific pickup here
      // For now, we'll return a success response
      return createSuccessResponse({ id: pickupId })
    } catch {
      return createErrorResponse("Failed to fetch pickup", 500)
    }
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params
      const pickupId = parseInt(id)

      const error = validateNumber(pickupId, "id", { min: 1, integer: true })
      if (error) {
        return createErrorResponse(error.message, 400)
      }

      const body = await request.json()
      const { action } = body

      if (action === "complete") {
        const result = await completePickup(pickupId)
        if (result?.error) {
          return createErrorResponse(result.error, 400)
        }
        return createSuccessResponse({ success: true }, "Item picked up")
      } else if (action === "cancel") {
        await cancelPickup(pickupId)
        return createSuccessResponse({ success: true }, "Listing cancelled")
      } else {
        return createErrorResponse("Invalid action. Use 'complete' or 'cancel'", 400)
      }
    } catch {
      return createErrorResponse("Failed to update pickup", 500)
    }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req) => {
    try {
      const { id } = await params
      const pickupId = parseInt(id)

      const error = validateNumber(pickupId, "id", { min: 1, integer: true })
      if (error) {
        return createErrorResponse(error.message, 400)
      }

      await deletePickup(pickupId)
      return createSuccessResponse({ success: true }, "Listing deleted")
    } catch {
      return createErrorResponse("Failed to delete pickup", 500)
    }
  })
}
