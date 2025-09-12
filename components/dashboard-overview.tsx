"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign, Users, Route, TrendingUp, TrendingDown, Clock } from "lucide-react"

interface Statistics {
  totalEmployees: number
  totalAllowanceRecords: number
  totalTransactions: number
  budget: {
    totalAmount: number
    usedAmount: number
    remainingAmount: number
  }
}

interface Transaction {
  id: string
  type: "budget_add" | "allowance_deduct"
  amount: number
  description: string
  createdAt: string
  employeeId?: string
}

interface Employee {
  id: string
  name: string
  employeeId: string
  totalAllowance: number
}

interface AllowanceRecord {
  id: string
  employeeId: string
  day: string
  location: string
  totalAmount: number
  createdAt: string
}

export function DashboardOverview() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [allowances, setAllowances] = useState<AllowanceRecord[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, transRes, empRes, allowRes] = await Promise.all([
        fetch("/api/statistics"),
        fetch("/api/transactions"),
        fetch("/api/employees"),
        fetch("/api/allowances"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStatistics(statsData)
      }

      if (transRes.ok) {
        const transData = await transRes.json()
        setTransactions(transData.slice(0, 10)) // Latest 10 transactions
      }

      if (empRes.ok) {
        const empData = await empRes.json()
        setEmployees(empData)
      }

      if (allowRes.ok) {
        const allowData = await allowRes.json()
        setAllowances(allowData)
      }
    } catch (error) {
      setError("فشل في تحميل البيانات")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getBudgetStatus = () => {
    if (!statistics?.budget) return { status: "unknown", color: "gray", text: "غير معروف" }
    const percentage = (statistics.budget.remainingAmount / statistics.budget.totalAmount) * 100
    if (percentage > 50) return { status: "good", color: "emerald", text: "حالة جيدة" }
    if (percentage > 20) return { status: "warning", color: "yellow", text: "تحذير" }
    return { status: "critical", color: "red", text: "حرج" }
  }

  const getTopEmployees = () => {
    return employees
      .sort((a, b) => b.totalAllowance - a.totalAllowance)
      .slice(0, 5)
      .map((emp) => ({
        name: emp.name,
        amount: emp.totalAllowance,
      }))
  }

  const getDailyAllowances = () => {
    const dailyData: { [key: string]: number } = {}
    allowances.forEach((allowance) => {
      const date = new Date(allowance.createdAt).toLocaleDateString("ar-EG")
      dailyData[date] = (dailyData[date] || 0) + allowance.totalAmount
    })

    return Object.entries(dailyData)
      .slice(-7) // Last 7 days
      .map(([date, amount]) => ({ date, amount }))
  }

  const budgetStatus = getBudgetStatus()
  const budgetPercentage = statistics?.budget ? (statistics.budget.usedAmount / statistics.budget.totalAmount) * 100 : 0

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">لوحة التحكم</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الميزانية المتبقية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {statistics ? formatCurrency(statistics.budget.remainingAmount) : "0 ريال"}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className={`bg-${budgetStatus.color}-100 text-${budgetStatus.color}-800`}>
                {budgetStatus.text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموظفين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statistics?.totalEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">موظف مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرحلات</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{statistics?.totalAllowanceRecords || 0}</div>
            <p className="text-xs text-muted-foreground">رحلة مسجلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المعاملات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statistics?.totalTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">معاملة مالية</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      {statistics?.budget && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              حالة الميزانية
            </CardTitle>
            <CardDescription>نظرة عامة على استخدام الميزانية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">الميزانية الإجمالية</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(statistics.budget.totalAmount)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">المبلغ المستخدم</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(statistics.budget.usedAmount)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">المبلغ المتبقي</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(statistics.budget.remainingAmount)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>نسبة الاستخدام</span>
                <span>{budgetPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={budgetPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Employees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              أعلى الموظفين في البدلات
            </CardTitle>
            <CardDescription>الموظفون الذين حصلوا على أعلى بدلات</CardDescription>
          </CardHeader>
          <CardContent>
            {getTopEmployees().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد بيانات بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getTopEmployees().map((employee, index) => (
                  <div key={employee.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <span className="font-medium">{employee.name}</span>
                    </div>
                    <span className="font-bold text-emerald-600">{formatCurrency(employee.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Allowances Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              البدلات اليومية
            </CardTitle>
            <CardDescription>إجمالي البدلات المدفوعة خلال الأسبوع الماضي</CardDescription>
          </CardHeader>
          <CardContent>
            {getDailyAllowances().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد بيانات بعد</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getDailyAllowances()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), "المبلغ"]} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            آخر المعاملات
          </CardTitle>
          <CardDescription>أحدث 10 معاملات مالية</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد معاملات بعد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>النوع</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.type === "budget_add" ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <Badge variant={transaction.type === "budget_add" ? "default" : "secondary"}>
                            {transaction.type === "budget_add" ? "إضافة ميزانية" : "خصم بدل"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${
                            transaction.type === "budget_add" ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "budget_add" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
