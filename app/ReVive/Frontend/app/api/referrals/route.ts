import { NextRequest } from "next/server"
import { withAuth, createSuccessResponse, createErrorResponse } from "@/lib/api/middleware"
import {
  getOrCreateReferralCode,
  getReferralStats,
  applyReferralCode,
} from "@/app/actions/referrals"
import { validateString } from "@/lib/api/validators"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const code = await getOrCreateReferralCode(req.userId)
      const stats = await getReferralStats(req.userId)

      return createSuccessResponse({
        code,
        stats,
        referralUrl: `${req.nextUrl.origin}/sign-up?ref=${code}`,
      })
    } catch {
      return createErrorResponse("Failed to fetch referral info", 500)
    }
  })
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json()
      const { code } = body

      const error = validateString(code, "code", { minLength: 8, maxLength: 8 })
      if (error) {
        return createErrorResponse(error.message, 400)
      }

      const result = await applyReferralCode(code.toUpperCase(), req.userId)

      if (result?.error) {
        return createErrorResponse(result.error, 400)
      }

      return createSuccessResponse({ success: true }, "Referral code applied successfully")
    } catch {
      return createErrorResponse("Failed to apply referral code", 500)
    }
  })
}
