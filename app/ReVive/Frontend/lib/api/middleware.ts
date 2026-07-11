import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export interface AuthenticatedRequest extends NextRequest {
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
}

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.userId = session.user.id
    authenticatedRequest.user = {
      id: session.user.id,
      name: session.user.name || "",
      email: session.user.email,
    }

    return handler(authenticatedRequest)
  } catch (error) {
    console.error("Auth middleware error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export function createSuccessResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, message },
    { status: 200 }
  )
}

export function createErrorResponse(
  error: string,
  status: number = 400
): NextResponse {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status }
  )
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json<ApiResponse<{ items: T[]; total: number; page: number; totalPages: number }>>({
    success: true,
    data: {
      items: data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  })
}
