// Supabase-based data storage for the application
import { supabase } from './supabase'

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

const employees: Employee[] = []
let allowanceRecords: AllowanceRecord[] = []
const transactions: Transaction[] = []

// Budget operations
// Database operations using Supabase
export async function getBudget(): Promise<Budget | null> {
  const { data, error } = await supabase
    .from('budget')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching budget:', error)
    return null
  }

  return {
    id: data.id,
    totalAmount: data.total_amount,
    usedAmount: data.used_amount,
    remainingAmount: data.remaining_amount,
    lastUpdated: data.last_updated,
  }
}

export async function addToBudget(amount: number): Promise<Budget | null> {
  // First get current budget
  const currentBudget = await getBudget()
  if (!currentBudget) return null

  const newTotalAmount = currentBudget.totalAmount + amount

  const { data, error } = await supabase
    .from('budget')
    .update({
      total_amount: newTotalAmount,
      last_updated: new Date().toISOString(),
    })
    .eq('id', currentBudget.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating budget:', error)
    return null
  }

  // Add transaction record
  await supabase
    .from('transactions')
    .insert({
      type: 'budget_add',
      amount,
      description: `إضافة مبلغ ${amount} إلى الميزانية`,
    })

  return {
    id: data.id,
    totalAmount: data.total_amount,
    usedAmount: data.used_amount,
    remainingAmount: data.remaining_amount,
    lastUpdated: data.last_updated,
  }
}

export async function deductFromBudget(amount: number, employeeId: string, description: string): Promise<boolean> {
  const currentBudget = await getBudget()
  if (!currentBudget || currentBudget.remainingAmount < amount) {
    return false // Insufficient budget
  }

  const newUsedAmount = currentBudget.usedAmount + amount

  const { error } = await supabase
    .from('budget')
    .update({
      used_amount: newUsedAmount,
      last_updated: new Date().toISOString(),
    })
    .eq('id', currentBudget.id)

  if (error) {
    console.error('Error deducting from budget:', error)
    return false
  }

  // Add transaction record
  await supabase
    .from('transactions')
    .insert({
      type: 'allowance_deduct',
      amount,
      description,
      employee_id: employeeId,
    })

  return true
}

// Employee operations
export async function getEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching employees:', error)
    return []
  }

  return data.map(emp => ({
    id: emp.id,
    name: emp.name,
    employeeId: emp.employee_id,
    phone: emp.phone || '',
    walletType: emp.wallet_type || '',
    totalAllowance: emp.total_allowance,
    createdAt: emp.created_at,
  }))
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching employee:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    employeeId: data.employee_id,
    phone: data.phone || '',
    walletType: data.wallet_type || '',
    totalAllowance: data.total_allowance,
    createdAt: data.created_at,
  }
}

export async function addEmployee(employee: Omit<Employee, "id" | "createdAt">): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .insert({
      name: employee.name,
      employee_id: employee.employeeId,
      phone: employee.phone,
      wallet_type: employee.walletType,
      total_allowance: 0, // Always start with 0, will be calculated automatically
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding employee:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    employeeId: data.employee_id,
    phone: data.phone || '',
    walletType: data.wallet_type || '',
    totalAllowance: data.total_allowance,
    createdAt: data.created_at,
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  const updateData: any = {}
  if (updates.name) updateData.name = updates.name
  if (updates.employeeId) updateData.employee_id = updates.employeeId
  if (updates.phone !== undefined) updateData.phone = updates.phone
  if (updates.walletType !== undefined) updateData.wallet_type = updates.walletType
  if (updates.totalAllowance !== undefined) updateData.total_allowance = updates.totalAllowance

  const { data, error } = await supabase
    .from('employees')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating employee:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    employeeId: data.employee_id,
    phone: data.phone || '',
    walletType: data.wallet_type || '',
    totalAllowance: data.total_allowance,
    createdAt: data.created_at,
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting employee:', error)
    return false
  }

  return true
}

// Allowance operations
export async function getAllowanceRecords(): Promise<AllowanceRecord[]> {
  const { data, error } = await supabase
    .from('allowance_records')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching allowance records:', error)
    return []
  }

  return data.map(record => ({
    id: record.id,
    employeeId: record.employee_id,
    day: record.day,
    arrivalTime: record.arrival_time || '',
    departureTime: record.departure_time || '',
    location: record.location || '',
    goingAmount: record.going_amount,
    returnAmount: record.return_amount,
    totalAmount: record.total_amount,
    notes: record.notes || '',
    createdAt: record.created_at,
  }))
}

export async function getEmployeeAllowanceRecords(employeeId: string): Promise<AllowanceRecord[]> {
  const { data, error } = await supabase
    .from('allowance_records')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching employee allowance records:', error)
    return []
  }

  return data.map(record => ({
    id: record.id,
    employeeId: record.employee_id,
    day: record.day,
    arrivalTime: record.arrival_time || '',
    departureTime: record.departure_time || '',
    location: record.location || '',
    goingAmount: record.going_amount,
    returnAmount: record.return_amount,
    totalAmount: record.total_amount,
    notes: record.notes || '',
    createdAt: record.created_at,
  }))
}

export async function addAllowanceRecord(record: Omit<AllowanceRecord, "id" | "createdAt">): Promise<AllowanceRecord | null> {
  // Check if budget is sufficient and deduct
  const deductSuccess = await deductFromBudget(record.totalAmount, record.employeeId, `بدل انتقال للموظف ${record.employeeId}`)
  if (!deductSuccess) {
    return null // Insufficient budget
  }

  const { data, error } = await supabase
    .from('allowance_records')
    .insert({
      employee_id: record.employeeId,
      day: record.day,
      arrival_time: record.arrivalTime,
      departure_time: record.departureTime,
      location: record.location,
      going_amount: record.goingAmount,
      return_amount: record.returnAmount,
      notes: record.notes,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding allowance record:', error)
    return null
  }

  // Automatically recalculate employee total allowance
  const recalculateSuccess = await updateEmployeeTotalAllowance(record.employeeId)
  if (!recalculateSuccess) {
    console.warn('Warning: Failed to update employee total allowance automatically')
  }

  return {
    id: data.id,
    employeeId: data.employee_id,
    day: data.day,
    arrivalTime: data.arrival_time || '',
    departureTime: data.departure_time || '',
    location: data.location || '',
    goingAmount: data.going_amount,
    returnAmount: data.return_amount,
    totalAmount: data.total_amount,
    notes: data.notes || '',
    createdAt: data.created_at,
  }
}

// Delete allowance record and update employee total
export async function deleteAllowanceRecord(recordId: string): Promise<boolean> {
  try {
    // First get the record to know which employee to update
    const { data: record, error: fetchError } = await supabase
      .from('allowance_records')
      .select('employee_id')
      .eq('id', recordId)
      .single()

    if (fetchError) {
      console.error('Error fetching allowance record:', fetchError)
      return false
    }

    // Delete the record
    const { error: deleteError } = await supabase
      .from('allowance_records')
      .delete()
      .eq('id', recordId)

    if (deleteError) {
      console.error('Error deleting allowance record:', deleteError)
      return false
    }

    // Update employee total allowance
    await updateEmployeeTotalAllowance(record.employee_id)

    return true
  } catch (error) {
    console.error('Error in deleteAllowanceRecord:', error)
    return false
  }
}

// Update specific employee's total allowance based on actual records
export async function updateEmployeeTotalAllowance(employeeId: string): Promise<boolean> {
  try {
    // Get all allowance records for this employee
    const { data: allowanceData, error: allowanceError } = await supabase
      .from('allowance_records')
      .select('total_amount')
      .eq('employee_id', employeeId)
    
    if (allowanceError) {
      console.error('Error fetching allowances for employee:', allowanceError)
      return false
    }

    // Calculate total
    const total = allowanceData.reduce((sum, record) => sum + record.total_amount, 0)

    // Update employee's total allowance
    const { error: updateError } = await supabase
      .from('employees')
      .update({ total_allowance: total })
      .eq('id', employeeId)

    if (updateError) {
      console.error('Error updating employee total allowance:', updateError)
      return false
    }

    return true
    
  } catch (error) {
    console.error('Error in updateEmployeeTotalAllowance:', error)
    return false
  }
}

// Recalculate employee total allowances based on actual allowance records
export async function recalculateEmployeeTotals(): Promise<boolean> {
  try {
    // Get all allowance records grouped by employee
    const { data: allowanceData, error: allowanceError } = await supabase
      .from('allowance_records')
      .select('employee_id, total_amount')
    
    if (allowanceError) {
      console.error('Error fetching allowances for recalculation:', allowanceError)
      return false
    }

    // Calculate totals per employee
    const employeeTotals = allowanceData.reduce((acc, record) => {
      const empId = record.employee_id
      acc[empId] = (acc[empId] || 0) + record.total_amount
      return acc
    }, {} as Record<string, number>)

    // Update each employee's total
    const updatePromises = Object.entries(employeeTotals).map(([empId, total]) =>
      supabase
        .from('employees')
        .update({ total_allowance: total })
        .eq('id', empId)
    )

    // Also reset employees with no allowances to 0
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id')
    
    if (!empError && allEmployees) {
      const employeesWithNoAllowances = allEmployees
        .filter(emp => !employeeTotals[emp.id])
        .map(emp => emp.id)
      
      const resetPromises = employeesWithNoAllowances.map(empId =>
        supabase
          .from('employees')
          .update({ total_allowance: 0 })
          .eq('id', empId)
      )
      
      updatePromises.push(...resetPromises)
    }

    await Promise.all(updatePromises)
    console.log('Employee totals recalculated successfully')
    return true
    
  } catch (error) {
    console.error('Error recalculating employee totals:', error)
    return false
  }
}

// Transaction operations
export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data.map(transaction => ({
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description || '',
    createdAt: transaction.created_at,
    employeeId: transaction.employee_id || undefined,
  }))
}

// Statistics
export async function getStatistics() {
  const [employees, allowanceRecords, transactions, budget] = await Promise.all([
    getEmployees(),
    getAllowanceRecords(),
    getTransactions(),
    getBudget(),
  ])

  return {
    totalEmployees: employees.length,
    totalAllowanceRecords: allowanceRecords.length,
    totalTransactions: transactions.length,
    budget,
  }
}
