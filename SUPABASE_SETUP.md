# Supabase Setup Guide for Tamouh Management System

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in your Supabase dashboard

## Database Setup

### 1. Run the Schema
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL to create all tables, indexes, triggers, and policies

### 2. Configure Environment Variables
Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can find these values in:
- **Project URL**: Settings > General > Project URL
- **API Keys**: Settings > API > Project API keys

### 3. Enable Row Level Security (RLS)
The schema already includes RLS policies, but ensure they're properly configured:

1. Go to Authentication > Policies in your Supabase dashboard
2. Verify that all tables have the appropriate policies enabled
3. Adjust policies based on your authentication requirements

### 4. Real-time Configuration
1. Go to Database > Replication in your Supabase dashboard
2. Enable real-time for the following tables:
   - `budget`
   - `employees`
   - `allowance_records`
   - `transactions`

## Features Included

### Real-time Updates
- **Budget changes**: Live updates when budget is modified
- **Employee management**: Real-time employee list updates
- **Allowance tracking**: Live allowance record updates
- **Transaction history**: Real-time transaction notifications

### Database Schema
- **budget**: Stores budget information with automatic remaining calculation
- **employees**: Employee details with automatic timestamp updates
- **allowance_records**: Travel allowance records linked to employees
- **transactions**: All financial transactions with type categorization

### Security Features
- Row Level Security (RLS) enabled on all tables
- Secure API endpoints with authentication checks
- Proper data validation and error handling

## Migration from In-Memory Storage

The system has been completely migrated from in-memory storage to Supabase:

1. **Data Layer**: `lib/data.ts` now uses async Supabase operations
2. **API Routes**: All API endpoints updated to handle async operations
3. **Real-time Hooks**: Custom hooks for live data updates
4. **Type Safety**: Comprehensive TypeScript types for database operations

## Usage

### Basic Operations
```typescript
import { getBudget, addEmployee, addAllowanceRecord } from '@/lib/data'

// Get current budget
const budget = await getBudget()

// Add new employee
const employee = await addEmployee({
  name: "أحمد محمد",
  employeeId: "EMP001",
  phone: "01234567890",
  walletType: "instapay",
  totalAllowance: 0
})

// Add allowance record
const allowance = await addAllowanceRecord({
  employeeId: employee.id,
  day: "2025-09-12",
  arrivalTime: "09:00",
  departureTime: "17:00",
  location: "Cairo",
  goingAmount: 50,
  returnAmount: 50,
  totalAmount: 100,
  notes: "Regular commute"
})
```

### Real-time Updates
```typescript
import { useRealtimeBudget, useRealtimeEmployees } from '@/hooks/useRealtime'

function MyComponent() {
  const { budget, loading } = useRealtimeBudget()
  const { employees } = useRealtimeEmployees()
  
  // Component automatically updates when data changes
  return (
    <div>
      {loading ? 'Loading...' : `Budget: ${budget?.totalAmount} EGP`}
      <p>Employees: {employees.length}</p>
    </div>
  )
}
```

## Troubleshooting

### Common Issues
1. **Connection Errors**: Verify your Supabase URL and API keys
2. **RLS Policies**: Ensure authentication is properly configured
3. **Real-time Not Working**: Check that replication is enabled for tables
4. **Type Errors**: Ensure all async operations are properly awaited

### Performance Optimization
1. Use real-time hooks only for components that need live updates
2. Implement proper loading states
3. Consider pagination for large datasets
4. Use Supabase's built-in caching when appropriate

## Next Steps
1. Set up authentication for user management
2. Configure production environment variables
3. Implement data backup and recovery procedures
4. Set up monitoring and logging