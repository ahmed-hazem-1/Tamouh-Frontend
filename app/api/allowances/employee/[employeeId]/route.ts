import { type NextRequest, NextResponse } from "next/server"
import { getEmployeeAllowanceRecords } from "@/lib/data"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const allowances = await getEmployeeAllowanceRecords(params.employeeId)
    return NextResponse.json(allowances)
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
