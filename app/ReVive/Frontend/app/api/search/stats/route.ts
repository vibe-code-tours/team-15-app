import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSearchStats } from "@/lib/search/query-builder"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await getSearchStats(session.user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Search stats API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
