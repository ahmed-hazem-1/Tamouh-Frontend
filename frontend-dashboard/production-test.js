// Production test script
// تشغيل هذا النص للتأكد من عمل النظام في الإنتاج

console.log('🧪 اختبار النظام في الإنتاج...')

// Test 1: Check if dashboard loads without recalculate button
function testDashboardUI() {
    const button = document.querySelector('button[onclick="recalculateTotals()"]')
    if (button) {
        console.log('❌ زر إعادة الحساب ما زال موجود!')
        return false
    } else {
        console.log('✅ تم حذف زر إعادة الحساب بنجاح')
        return true
    }
}

// Test 2: Check if auto-calculation function exists
function testAutoCalculation() {
    if (typeof autoRecalculateEmployeeTotals === 'function') {
        console.log('✅ دالة الحساب التلقائي موجودة')
        return true
    } else {
        console.log('❌ دالة الحساب التلقائي مفقودة')
        return false
    }
}

// Test 3: Check data loading
async function testDataLoading() {
    try {
        await loadAllData()
        console.log('✅ تم تحميل البيانات بنجاح')
        return true
    } catch (error) {
        console.log('❌ خطأ في تحميل البيانات:', error)
        return false
    }
}

// Run tests
function runProductionTests() {
    console.log('🚀 بدء اختبارات الإنتاج...')
    
    const test1 = testDashboardUI()
    const test2 = testAutoCalculation() 
    
    testDataLoading().then(test3 => {
        const allPassed = test1 && test2 && test3
        
        if (allPassed) {
            console.log('🎉 جميع الاختبارات نجحت! النظام جاهز للإنتاج')
        } else {
            console.log('⚠️ بعض الاختبارات فشلت - يحتاج مراجعة')
        }
    })
}

// Auto-run tests when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runProductionTests)
} else {
    runProductionTests()
}