"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface Budget {
  id: string
  totalAmount: number
  usedAmount: number
  remainingAmount: number
  lastUpdated: string
}

export function BudgetManagement() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchBudget()
  }, [])

  const fetchBudget = async () => {
    try {
      const response = await fetch("/api/budget")
      if (response.ok) {
        const data = await response.json()
        setBudget(data)
      }
    } catch (error) {
      setError("فشل في تحميل بيانات الميزانية")
    }
  }

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Number.parseFloat(amount) }),
      })

      if (response.ok) {
        const updatedBudget = await response.json()
        setBudget(updatedBudget)
        setAmount("")
        setSuccess(`تم إضافة ${amount} ريال إلى الميزانية بنجاح`)
      } else {
        const data = await response.json()
        setError(data.error || "فشل في إضافة المبلغ")
      }
    } catch (error) {
      setError("حدث خطأ في الاتصال")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getBudgetStatus = () => {
    if (!budget) return "unknown"
    const percentage = (budget.remainingAmount / budget.totalAmount) * 100
    if (percentage > 50) return "good"
    if (percentage > 20) return "warning"
    return "critical"
  }

  const getBudgetStatusColor = () => {
    const status = getBudgetStatus()
    switch (status) {
      case "good":
        return "bg-emerald-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wallet className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">إدارة الميزانية</h2>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الميزانية الإجمالية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {budget ? formatCurrency(budget.totalAmount) : "0 ريال"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المبلغ المستخدم</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {budget ? formatCurrency(budget.usedAmount) : "0 ريال"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المبلغ المتبقي</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {budget ? formatCurrency(budget.remainingAmount) : "0 ريال"}
            </div>
            {budget && (
              <div className="mt-2">
                <Badge variant="secondary" className={`${getBudgetStatusColor()} text-white`}>
                  {getBudgetStatus() === "good" && "حالة جيدة"}
                  {getBudgetStatus() === "warning" && "تحذير"}
                  {getBudgetStatus() === "critical" && "حرج"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress Bar */}
      {budget && budget.totalAmount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">نسبة استخدام الميزانية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-300 ${getBudgetStatusColor()}`}
                style={{
                  width: `${Math.min((budget.usedAmount / budget.totalAmount) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0%</span>
              <span>{((budget.usedAmount / budget.totalAmount) * 100).toFixed(1)}% مستخدم</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Budget Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة مبلغ للميزانية
          </CardTitle>
          <CardDescription>أضف مبلغاً جديداً إلى الميزانية الإجمالية للبدلات</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ (ريال سعودي)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="أدخل المبلغ"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-emerald-200 bg-emerald-50">
                <AlertDescription className="text-emerald-800">{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري الإضافة..." : "إضافة المبلغ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
