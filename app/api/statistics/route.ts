import { NextResponse } from "next/server"
import { getStatistics } from "@/lib/data"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const statistics = getStatistics()
    return NextResponse.json(statistics)
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
