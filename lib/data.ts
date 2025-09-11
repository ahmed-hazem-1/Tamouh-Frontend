// Simple JSON-based data storage for the application
export interface Budget {
  id: string
  totalAmount: number
  usedAmount: number
  remainingAmount: number
  lastUpdated: string
}

export interface Employee {
  id: string
  name: string
  employeeId: string
  phone: string
  walletType: string
  totalAllowance: number
  createdAt: string
}

export interface AllowanceRecord {
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

export interface Transaction {
  id: string
  type: "budget_add" | "allowance_deduct"
  amount: number
  description: string
  createdAt: string
  employeeId?: string
}

// In-memory storage (in production, this would be a database)
const budget: Budget = {
  id: "1",
  totalAmount: 0,
  usedAmount: 0,
  remainingAmount: 0,
  lastUpdated: new Date().toISOString(),
}

const employees: Employee[] = []
let allowanceRecords: AllowanceRecord[] = []
const transactions: Transaction[] = []

// Budget operations
export function getBudget(): Budget {
  return budget
}

export function addToBudget(amount: number): Budget {
  budget.totalAmount += amount
  budget.remainingAmount += amount
  budget.lastUpdated = new Date().toISOString()

  // Add transaction record
  transactions.push({
    id: Date.now().toString(),
    type: "budget_add",
    amount,
    description: `إضافة مبلغ ${amount} إلى الميزانية`,
    createdAt: new Date().toISOString(),
  })

  return budget
}

export function deductFromBudget(amount: number, employeeId: string, description: string): boolean {
  if (budget.remainingAmount < amount) {
    return false // Insufficient budget
  }

  budget.usedAmount += amount
  budget.remainingAmount -= amount
  budget.lastUpdated = new Date().toISOString()

  // Add transaction record
  transactions.push({
    id: Date.now().toString(),
    type: "allowance_deduct",
    amount,
    description,
    createdAt: new Date().toISOString(),
    employeeId,
  })

  return true
}

// Employee operations
export function getEmployees(): Employee[] {
  return employees
}

export function getEmployee(id: string): Employee | undefined {
  return employees.find((emp) => emp.id === id)
}

export function addEmployee(employee: Omit<Employee, "id" | "createdAt">): Employee {
  const newEmployee: Employee = {
    ...employee,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  employees.push(newEmployee)
  return newEmployee
}

export function updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
  const index = employees.findIndex((emp) => emp.id === id)
  if (index === -1) return null

  employees[index] = { ...employees[index], ...updates }
  return employees[index]
}

export function deleteEmployee(id: string): boolean {
  const index = employees.findIndex((emp) => emp.id === id)
  if (index === -1) return false

  employees.splice(index, 1)
  // Also remove related allowance records
  allowanceRecords = allowanceRecords.filter((record) => record.employeeId !== id)
  return true
}

// Allowance operations
export function getAllowanceRecords(): AllowanceRecord[] {
  return allowanceRecords
}

export function getEmployeeAllowanceRecords(employeeId: string): AllowanceRecord[] {
  return allowanceRecords.filter((record) => record.employeeId === employeeId)
}

export function addAllowanceRecord(record: Omit<AllowanceRecord, "id" | "createdAt">): AllowanceRecord | null {
  // Check if budget is sufficient
  if (!deductFromBudget(record.totalAmount, record.employeeId, `بدل انتقال للموظف ${record.employeeId}`)) {
    return null // Insufficient budget
  }

  const newRecord: AllowanceRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  allowanceRecords.push(newRecord)

  // Update employee total allowance
  const employee = employees.find((emp) => emp.id === record.employeeId)
  if (employee) {
    employee.totalAllowance += record.totalAmount
  }

  return newRecord
}

// Transaction operations
export function getTransactions(): Transaction[] {
  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Statistics
export function getStatistics() {
  const totalEmployees = employees.length
  const totalAllowanceRecords = allowanceRecords.length
  const totalTransactions = transactions.length

  return {
    totalEmployees,
    totalAllowanceRecords,
    totalTransactions,
    budget,
  }
}
