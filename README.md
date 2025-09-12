# 📊 Tamouh Management System - Frontend Dashboard

A read-only dashboard for displaying data from the Tamouh Management System. This is a standalone frontend that connects directly to Supabase and displays real-time data without editing capabilities.

## 🎯 Features

- 📊 **Real-time Dashboard**: Live data updates from Supabase
- 💰 **Budget Overview**: Total, used, and remaining budget in EGP
- 👥 **Employee List**: All employees with payment methods
- 📋 **Recent Allowances**: Latest travel allowances
- 💰 **Transaction History**: Recent financial transactions
- 🔄 **Auto-refresh**: Updates every 5 minutes automatically
- 📱 **Responsive Design**: Works on all devices
- 🇪🇬 **Arabic/Egyptian**: Fully localized for Egypt

## 🚀 Quick Deploy

### Deploy to Vercel (Recommended)
1. Create a new repository on GitHub
2. Upload the `index.html` file
3. Connect your repository to Vercel
4. Deploy instantly!

### Deploy to GitHub Pages
1. Create a new repository on GitHub
2. Upload the `index.html` file
3. Go to Settings > Pages
4. Select source: Deploy from branch
5. Choose main branch
6. Your dashboard will be available at: `https://yourusername.github.io/your-repo-name`

### Deploy to Netlify
1. Create account on Netlify
2. Drag and drop the `index.html` file
3. Deploy instantly!

## ⚙️ Configuration

The dashboard is pre-configured to connect to your Supabase database:
- **Project URL**: `https://dqexwiokpeyjdrxfgzfs.supabase.co`
- **Database Tables**: `budget`, `employees`, `allowance_records`, `transactions`

### Security Note
The dashboard uses the public anon key, which is safe for read-only operations when Row Level Security (RLS) is properly configured in Supabase.

## 📱 What You'll See

### Statistics Cards
- 💰 **Total Budget**: Total allocated budget in EGP
- 📉 **Used Budget**: Amount already spent
- 💳 **Remaining Budget**: Available budget
- 👥 **Total Employees**: Number of registered employees

### Data Tables
- **Employees Table**: Name, ID, payment method, total allowances
- **Recent Allowances**: Last 10 allowance records with dates and amounts
- **Recent Transactions**: Last 15 transactions with type and description

### Payment Method Badges
- 🔵 **InstaPay**: Central Bank of Egypt instant payment
- 🔴 **Vodafone Cash**: Vodafone Egypt mobile wallet
- 🟠 **Orange Cash**: Orange Egypt mobile money
- 🟢 **Etisalat Cash**: Etisalat Misr mobile wallet
- 🟣 **Fawry**: Electronic payment network
- 🔵 **Bank Transfer**: Traditional banking
- 🟢 **Cash**: Cash payments

## 🔄 Real-time Updates

The dashboard automatically updates when:
- New budget is added
- Employees are added/modified
- New allowances are recorded
- Transactions are processed

## 🎨 Customization

### Change Colors
Edit the CSS classes in the `<style>` section:
```css
.card {
    background: linear-gradient(135deg, #your-color 0%, #your-color 100%);
}
```

### Modify Refresh Interval
Change the auto-refresh timer (currently 5 minutes):
```javascript
// Auto-refresh every X minutes
setInterval(loadAllData, X * 60 * 1000);
```

### Add More Data
Extend the dashboard by adding new functions similar to `loadBudget()`, `loadEmployees()`, etc.

## 📋 File Structure

```
frontend-dashboard/
├── index.html          # Complete standalone dashboard
└── README.md          # This file
```

## 🔒 Security Considerations

- Dashboard is read-only (no data modification)
- Uses Supabase RLS for data security
- No server-side code required
- Static files only - can be deployed anywhere

## 🌐 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🛠️ Troubleshooting

### Dashboard shows "غير متصل" (Not Connected)
1. Check internet connection
2. Verify Supabase project is active
3. Ensure RLS policies allow read access

### No data showing
1. Verify database tables exist in Supabase
2. Check if there's actual data in the tables
3. Open browser developer tools to check for errors

### Real-time updates not working
1. Enable replication for all tables in Supabase Dashboard
2. Go to Database > Replication
3. Enable for: budget, employees, allowance_records, transactions

## 📧 Support

For issues related to:
- **Dashboard**: Check browser console for errors
- **Database**: Check Supabase dashboard logs
- **Deployment**: Refer to platform-specific documentation

---

**🇪🇬 Built for Egyptian businesses | Powered by Supabase**