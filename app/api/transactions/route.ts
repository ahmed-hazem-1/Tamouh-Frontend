import { NextResponse } from "next/server"
import { getTransactions } from "@/lib/data"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const transactions = getTransactions()
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
