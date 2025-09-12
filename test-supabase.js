const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dqexwiokpeyjdrxfgzfs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXh3aW9rcGV5amRyeGZnemZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTgwNjYsImV4cCI6MjA3MzIzNDA2Nn0.ZyfXRWS4waoIx6IMLouw8c7iH1CtqI3PRqJQQ09tDKQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔗 Testing Supabase connection...')
  console.log('📍 Project URL:', supabaseUrl)
  console.log('')
  
  try {
    console.log('📋 Testing database tables...')
    
    const tables = ['budget', 'employees', 'allowance_records', 'transactions']
    const existingTables = []
    const tableResults = []
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        if (!error) {
          existingTables.push(table)
          tableResults.push(`✅ ${table} - Ready`)
        } else {
          tableResults.push(`❌ ${table} - ${error.message}`)
        }
      } catch (err) {
        tableResults.push(`❌ ${table} - ${err.message}`)
      }
    }
    
    console.log('📊 Table Status:')
    tableResults.forEach(result => console.log('  ' + result))
    console.log('')
    
    if (existingTables.length === 4) {
      console.log('🎉 SUCCESS! All tables are ready!')
      console.log('')
      
      // Test budget table specifically
      console.log('💰 Testing budget functionality...')
      const { data: budgetData, error: budgetError } = await supabase
        .from('budget')
        .select('*')
        .single()
      
      if (!budgetError && budgetData) {
        console.log('✅ Budget table working - Initial budget:', budgetData.total_amount, 'EGP')
      }
      
      console.log('')
      console.log('🚀 Next Steps:')
      console.log('1. ✅ Tables created successfully')
      console.log('2. 🔄 Enable real-time replication (see instructions below)')
      console.log('3. 🚀 Start your application: npm run dev')
      console.log('')
      console.log('📡 ENABLE REAL-TIME:')
      console.log('   Go to: Database > Replication in your Supabase dashboard')
      console.log('   Enable replication for: budget, employees, allowance_records, transactions')
      
    } else if (existingTables.length > 0) {
      console.log('⚠️  Partial setup detected')
      console.log('✅ Working tables:', existingTables)
      console.log('❌ Missing tables:', tables.filter(t => !existingTables.includes(t)))
      console.log('')
      console.log('💡 You may need to run the setup.sql script again')
    } else {
      console.log('❌ No tables found')
      console.log('💡 Make sure you ran the setup.sql script in Supabase SQL Editor')
    }

    return existingTables.length === 4
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
    return false
  }
}

testConnection()