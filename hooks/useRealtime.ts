import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Budget, Employee, AllowanceRecord, Transaction } from '@/lib/data'

// Real-time hook for budget
export function useRealtimeBudget() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial budget
    const fetchBudget = async () => {
      const { getBudget } = await import('@/lib/data')
      const budgetData = await getBudget()
      setBudget(budgetData)
      setLoading(false)
    }

    fetchBudget()

    // Set up real-time subscription
    const subscription = supabase
      .channel('budget-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budget',
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const newData = payload.new as any
            const updatedBudget: Budget = {
              id: newData.id,
              totalAmount: newData.total_amount,
              usedAmount: newData.used_amount,
              remainingAmount: newData.remaining_amount,
              lastUpdated: newData.last_updated,
            }
            setBudget(updatedBudget)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { budget, loading }
}

// Real-time hook for employees
export function useRealtimeEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial employees
    const fetchEmployees = async () => {
      const { getEmployees } = await import('@/lib/data')
      const employeesData = await getEmployees()
      setEmployees(employeesData)
      setLoading(false)
    }

    fetchEmployees()

    // Set up real-time subscription
    const subscription = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees',
        },
        async (payload) => {
          const newData = payload.new as any
          const oldData = payload.old as any
          
          if (payload.eventType === 'INSERT' && newData) {
            const newEmployee: Employee = {
              id: newData.id,
              name: newData.name,
              employeeId: newData.employee_id,
              phone: newData.phone || '',
              walletType: newData.wallet_type || '',
              totalAllowance: newData.total_allowance,
              createdAt: newData.created_at,
            }
            setEmployees(prev => [newEmployee, ...prev])
          } else if (payload.eventType === 'UPDATE' && newData) {
            const updatedEmployee: Employee = {
              id: newData.id,
              name: newData.name,
              employeeId: newData.employee_id,
              phone: newData.phone || '',
              walletType: newData.wallet_type || '',
              totalAllowance: newData.total_allowance,
              createdAt: newData.created_at,
            }
            setEmployees(prev => 
              prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
            )
          } else if (payload.eventType === 'DELETE' && oldData) {
            setEmployees(prev => prev.filter(emp => emp.id !== oldData.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { employees, loading }
}

// Real-time hook for allowance records
export function useRealtimeAllowanceRecords() {
  const [allowanceRecords, setAllowanceRecords] = useState<AllowanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial allowance records
    const fetchAllowanceRecords = async () => {
      const { getAllowanceRecords } = await import('@/lib/data')
      const recordsData = await getAllowanceRecords()
      setAllowanceRecords(recordsData)
      setLoading(false)
    }

    fetchAllowanceRecords()

    // Set up real-time subscription
    const subscription = supabase
      .channel('allowance-records-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'allowance_records',
        },
        (payload) => {
          const newData = payload.new as any
          const oldData = payload.old as any
          
          if (payload.eventType === 'INSERT' && newData) {
            const newRecord: AllowanceRecord = {
              id: newData.id,
              employeeId: newData.employee_id,
              day: newData.day,
              arrivalTime: newData.arrival_time || '',
              departureTime: newData.departure_time || '',
              location: newData.location || '',
              goingAmount: newData.going_amount,
              returnAmount: newData.return_amount,
              totalAmount: newData.total_amount,
              notes: newData.notes || '',
              createdAt: newData.created_at,
            }
            setAllowanceRecords(prev => [newRecord, ...prev])
          } else if (payload.eventType === 'UPDATE' && newData) {
            const updatedRecord: AllowanceRecord = {
              id: newData.id,
              employeeId: newData.employee_id,
              day: newData.day,
              arrivalTime: newData.arrival_time || '',
              departureTime: newData.departure_time || '',
              location: newData.location || '',
              goingAmount: newData.going_amount,
              returnAmount: newData.return_amount,
              totalAmount: newData.total_amount,
              notes: newData.notes || '',
              createdAt: newData.created_at,
            }
            setAllowanceRecords(prev => 
              prev.map(record => record.id === updatedRecord.id ? updatedRecord : record)
            )
          } else if (payload.eventType === 'DELETE' && oldData) {
            setAllowanceRecords(prev => prev.filter(record => record.id !== oldData.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { allowanceRecords, loading }
}

// Real-time hook for transactions
export function useRealtimeTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial transactions
    const fetchTransactions = async () => {
      const { getTransactions } = await import('@/lib/data')
      const transactionsData = await getTransactions()
      setTransactions(transactionsData)
      setLoading(false)
    }

    fetchTransactions()

    // Set up real-time subscription
    const subscription = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        (payload) => {
          const newData = payload.new as any
          
          if (payload.eventType === 'INSERT' && newData) {
            const newTransaction: Transaction = {
              id: newData.id,
              type: newData.type,
              amount: newData.amount,
              description: newData.description || '',
              createdAt: newData.created_at,
              employeeId: newData.employee_id || undefined,
            }
            setTransactions(prev => [newTransaction, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { transactions, loading }
}