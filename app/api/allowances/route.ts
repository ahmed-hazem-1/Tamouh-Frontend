import { type NextRequest, NextResponse } from "next/server"
import { getAllowanceRecords, addAllowanceRecord } from "@/lib/data"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const allowances = await getAllowanceRecords()
    return NextResponse.json(allowances)
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { employeeId, day, arrivalTime, departureTime, location, goingAmount, returnAmount, notes } =
      await request.json()

    if (!employeeId || !day || !arrivalTime || !departureTime || !location || !goingAmount || !returnAmount) {
      return NextResponse.json({ error: "جميع الحقول المطلوبة يجب ملؤها" }, { status: 400 })
    }

    const totalAmount = Number.parseFloat(goingAmount) + Number.parseFloat(returnAmount)

    const newAllowance = await addAllowanceRecord({
      employeeId,
      day,
      arrivalTime,
      departureTime,
      location,
      goingAmount: Number.parseFloat(goingAmount),
      returnAmount: Number.parseFloat(returnAmount),
      totalAmount,
      notes: notes || "",
    })

    if (!newAllowance) {
      return NextResponse.json({ error: "الميزانية غير كافية لهذا المبلغ" }, { status: 400 })
    }

    return NextResponse.json(newAllowance)
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
