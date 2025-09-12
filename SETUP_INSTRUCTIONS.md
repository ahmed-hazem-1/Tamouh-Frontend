# 🚀 Supabase Database Setup Guide

## ✅ **Current Status**
- ✅ Supabase project created: `dqexwiokpeyjdrxfgzfs`
- ✅ API credentials configured in `.env.local`
- ✅ Database schema prepared in `database/setup.sql`
- ⏳ **Next Step: Create Database Tables**

## 📋 **Step-by-Step Setup**

### **Step 1: Access Your Supabase Dashboard**
1. Go to: https://app.supabase.com
2. Find your project: **dqexwiokpeyjdrxfgzfs**
3. Click on it to open the dashboard

### **Step 2: Create Database Tables**
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"** button
3. Copy **ALL** content from the file: `database/setup.sql`
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)

### **Step 3: Enable Real-time Features**
1. In the left sidebar, go to **"Database" > "Replication"**
2. Enable real-time replication for these tables:
   - ✅ `budget`
   - ✅ `employees` 
   - ✅ `allowance_records`
   - ✅ `transactions`

### **Step 4: Verify Setup**
After running the SQL, you should see these tables in **"Database" > "Tables"**:
- 📊 **budget** - Stores budget information
- 👥 **employees** - Employee management 
- 📋 **allowance_records** - Travel allowance tracking
- 💰 **transactions** - Financial transaction history

## 🔧 **What the Schema Creates**

### **Tables Structure:**
```sql
budget:              # Budget management
├── id (UUID)        # Primary key
├── total_amount     # Total budget allocated
├── used_amount      # Amount already spent
├── remaining_amount # Auto-calculated remaining
└── timestamps       # Created/updated times

employees:           # Employee management
├── id (UUID)        # Primary key  
├── name             # Employee name
├── employee_id      # Unique employee ID
├── phone            # Phone number
├── wallet_type      # Payment method (InstaPay, Vodafone Cash, etc.)
├── total_allowance  # Total allowances received
└── timestamps       # Created/updated times

allowance_records:   # Travel allowance tracking
├── id (UUID)        # Primary key
├── employee_id      # Link to employee
├── day              # Date of travel
├── arrival_time     # Time arrived
├── departure_time   # Time departed  
├── location         # Travel location
├── going_amount     # Going allowance amount
├── return_amount    # Return allowance amount
├── total_amount     # Auto-calculated total
├── notes            # Additional notes
└── timestamps       # Created/updated times

transactions:        # Financial transactions
├── id (UUID)        # Primary key
├── type             # 'budget_add' or 'allowance_deduct'
├── amount           # Transaction amount
├── description      # Transaction description
├── employee_id      # Related employee (optional)
└── created_at       # Transaction timestamp
```

### **Features Included:**
- 🔐 **Row Level Security (RLS)** enabled
- ⚡ **Real-time subscriptions** ready
- 📊 **Auto-calculated fields** (remaining budget, total amounts)
- 🔄 **Automatic timestamps** on updates
- 🗂️ **Optimized indexes** for performance
- 🔗 **Foreign key relationships** for data integrity

## 🎯 **Egyptian Localization**
Your system is configured for Egypt:
- 💰 **Currency**: Egyptian Pound (EGP)
- 🌍 **Locale**: Arabic-Egypt (ar-EG)
- 💳 **Payment Methods**: 
  - InstaPay
  - Vodafone Cash
  - Orange Cash
  - Etisalat Cash
  - Fawry
  - Bank Transfer
  - Cash

## 🔬 **Testing the Setup**

After creating the tables, test your setup:

```bash
# Run this command to test the connection:
node test-supabase.js
```

You should see:
```
✅ Connection successful!
✅ All required tables exist: [budget, employees, allowance_records, transactions]
🎉 Your database is ready to use!
```

## 🚀 **Start Your Application**

Once the database is set up, start your application:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Your Tamouh Management System will now have:
- 📊 **Real-time budget tracking**
- 👥 **Live employee management** 
- 📋 **Instant allowance updates**
- 💰 **Real-time transaction feeds**

## 🆘 **Troubleshooting**

### **Common Issues:**
1. **"Table not found" errors**: Run the SQL schema again
2. **Connection errors**: Check your API credentials in `.env.local`
3. **Real-time not working**: Enable replication for all tables
4. **Permission errors**: Verify RLS policies are properly set

### **Need Help?**
- 📚 Supabase Docs: https://supabase.com/docs
- 🔧 SQL Editor: Use for manual database operations
- 📊 Table Editor: Visual table management
- 🔍 Logs: Check for any errors in the dashboard

---

**⚡ Ready to build your real-time management system!** 🎉