"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Plus, Clock, DollarSign, TrendingUp, Users, Route } from "lucide-react"

interface Employee {
  id: string
  name: string
  employeeId: string
  phone: string
  walletType: string
  totalAllowance: number
  createdAt: string
}

interface AllowanceRecord {
  id: string
  employeeId: string
  day: string
  arrivalTime: string
  departureTime: string
  location: string
  goingAmount: number
  returnAmount: number
  totalAmount: number
  notes: string
  createdAt: string
}

export function AllowanceTracking() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [allowances, setAllowances] = useState<AllowanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    employeeId: "",
    day: "",
    arrivalTime: "",
    departureTime: "",
    location: "",
    goingAmount: "",
    returnAmount: "",
    notes: "",
  })

  useEffect(() => {
    fetchEmployees()
    fetchAllowances()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      setError("فشل في تحميل بيانات الموظفين")
    }
  }

  const fetchAllowances = async () => {
    try {
      const response = await fetch("/api/allowances")
      if (response.ok) {
        const data = await response.json()
        setAllowances(data)
      }
    } catch (error) {
      setError("فشل في تحميل بيانات البدلات")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/allowances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchAllowances()
        await fetchEmployees() // Refresh to update employee totals
        setFormData({
          employeeId: "",
          day: "",
          arrivalTime: "",
          departureTime: "",
          location: "",
          goingAmount: "",
          returnAmount: "",
          notes: "",
        })
        setIsDialogOpen(false)
        setSuccess("تم إضافة بدل الانتقال بنجاح")
      } else {
        const data = await response.json()
        setError(data.error || "فشل في إضافة بدل الانتقال")
      }
    } catch (error) {
      setError("حدث خطأ في الاتصال")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      employeeId: "",
      day: "",
      arrivalTime: "",
      departureTime: "",
      location: "",
      goingAmount: "",
      returnAmount: "",
      notes: "",
    })
    setError("")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    return employee ? employee.name : "غير معروف"
  }

  const getTotalAmount = () => {
    return allowances.reduce((sum, allowance) => sum + allowance.totalAmount, 0)
  }

  const getDaysOptions = () => {
    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    return days
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Route className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">تتبع بدلات الانتقال</h2>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة بدل انتقال
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة بدل انتقال جديد</DialogTitle>
              <DialogDescription>أدخل تفاصيل رحلة الانتقال للموظف</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">الموظف</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموظف" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.employeeId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">اليوم</Label>
                  <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر اليوم" />
                    </SelectTrigger>
                    <SelectContent>
                      {getDaysOptions().map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">المكان</Label>
                  <Input
                    id="location"
                    placeholder="مثال: الرياض - جدة"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">وقت الحضور</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departureTime">وقت الانصراف</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goingAmount">مبلغ الذهاب (ريال)</Label>
                  <Input
                    id="goingAmount"
                    type="number"
                    placeholder="0"
                    value={formData.goingAmount}
                    onChange={(e) => setFormData({ ...formData, goingAmount: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnAmount">مبلغ العودة (ريال)</Label>
                  <Input
                    id="returnAmount"
                    type="number"
                    placeholder="0"
                    value={formData.returnAmount}
                    onChange={(e) => setFormData({ ...formData, returnAmount: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {formData.goingAmount && formData.returnAmount && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-800">المبلغ الإجمالي:</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatCurrency(
                        Number.parseFloat(formData.goingAmount) + Number.parseFloat(formData.returnAmount),
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  placeholder="تفاصيل إضافية عن الرحلة (اختياري)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "جاري الإضافة..." : "إضافة البدل"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <AlertDescription className="text-emerald-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && !isDialogOpen && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرحلات</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{allowances.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي البدلات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(getTotalAmount())}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط البدل</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {allowances.length > 0 ? formatCurrency(getTotalAmount() / allowances.length) : "0 ريال"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموظفون النشطون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(allowances.map((a) => a.employeeId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allowances Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل بدلات الانتقال</CardTitle>
          <CardDescription>جميع رحلات الانتقال المسجلة</CardDescription>
        </CardHeader>
        <CardContent>
          {allowances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Route className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد رحلات مسجلة بعد</p>
              <p className="text-sm">ابدأ بإضافة بدل انتقال جديد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الموظف</TableHead>
                    <TableHead>اليوم</TableHead>
                    <TableHead>المكان</TableHead>
                    <TableHead>الوقت</TableHead>
                    <TableHead>مبلغ الذهاب</TableHead>
                    <TableHead>مبلغ العودة</TableHead>
                    <TableHead>المجموع</TableHead>
                    <TableHead>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allowances
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((allowance) => (
                      <TableRow key={allowance.id}>
                        <TableCell className="font-medium">{getEmployeeName(allowance.employeeId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{allowance.day}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {allowance.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {allowance.arrivalTime} - {allowance.departureTime}
                          </div>
                        </TableCell>
                        <TableCell className="text-blue-600">{formatCurrency(allowance.goingAmount)}</TableCell>
                        <TableCell className="text-orange-600">{formatCurrency(allowance.returnAmount)}</TableCell>
                        <TableCell className="font-bold text-emerald-600">
                          {formatCurrency(allowance.totalAmount)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(allowance.createdAt)}
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
