import { type NextRequest, NextResponse } from "next/server"
import { getEmployees, addEmployee } from "@/lib/data"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const employees = await getEmployees()
    return NextResponse.json(employees)
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

    const { name, employeeId, phone, walletType } = await request.json()

    if (!name || !employeeId || !phone || !walletType) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    const newEmployee = await addEmployee({
      name,
      employeeId,
      phone,
      walletType,
      totalAllowance: 0,
    })

    return NextResponse.json(newEmployee)
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
