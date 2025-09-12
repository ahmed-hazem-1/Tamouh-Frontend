import { type NextRequest, NextResponse } from "next/server"
import { recalculateEmployeeTotals } from "@/lib/data"
import { getSession } from "@/lib/auth"

export async function POST() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const success = await recalculateEmployeeTotals()
    
    if (success) {
      return NextResponse.json({ 
        message: "تم إعادة حساب إجماليات البدلات بنجاح",
        success: true 
      })
    } else {
      return NextResponse.json({ 
        error: "فشل في إعادة حساب الإجماليات" 
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error in recalculate API:', error)
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}