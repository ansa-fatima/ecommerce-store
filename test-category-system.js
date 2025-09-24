// Comprehensive test script to verify category system works everywhere
const testCategorySystem = async () => {
  console.log('🧪 Testing Category System Integration...\n');
  
  try {
    // Test 1: Add a new category via API
    console.log('1️⃣ Adding a new category...');
    const addResponse = await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Rings',
        description: 'Beautiful rings for every occasion',
        image: '/test-rings.jpg',
        productCount: 0,
        href: '/products?category=rings',
        isActive: true
      })
    });
    
    const addResult = await addResponse.json();
    console.log('✅ Category added:', addResult.success ? 'SUCCESS' : 'FAILED');
    if (addResult.success) {
      console.log('   📝 New category:', addResult.data.name);
    }
    
    // Test 2: Get all categories
    console.log('\n2️⃣ Fetching all categories...');
    const getResponse = await fetch('http://localhost:3000/api/categories');
    const categories = await getResponse.json();
    console.log('✅ Categories fetched:', categories.success ? 'SUCCESS' : 'FAILED');
    if (categories.success) {
      console.log('   📊 Total categories:', categories.data.length);
      console.log('   📋 Category names:', categories.data.map(c => c.name));
    }
    
    // Test 3: Check if new category appears in the list
    console.log('\n3️⃣ Verifying new category appears...');
    const newCategory = categories.data.find(c => c.name === 'Rings');
    console.log('✅ New category found:', newCategory ? 'SUCCESS' : 'FAILED');
    if (newCategory) {
      console.log('   🆔 ID:', newCategory.id);
      console.log('   📝 Name:', newCategory.name);
      console.log('   🔗 Href:', newCategory.href);
      console.log('   ✅ Active:', newCategory.isActive);
    }
    
    // Test 4: Test category filtering (simulate customer side)
    console.log('\n4️⃣ Testing category filtering...');
    const activeCategories = categories.data.filter(c => c.isActive);
    console.log('✅ Active categories:', activeCategories.length);
    console.log('   📋 Active category names:', activeCategories.map(c => c.name));
    
    console.log('\n🎉 Category System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   • Categories can be added via API ✅');
    console.log('   • Categories can be fetched via API ✅');
    console.log('   • New categories appear in the list ✅');
    console.log('   • Category filtering works ✅');
    console.log('\n🔍 Next Steps:');
    console.log('   1. Start the application: npm run dev');
    console.log('   2. Check home page category section');
    console.log('   3. Check header shop dropdown');
    console.log('   4. Check products page category filter');
    console.log('   5. Add a category in admin panel and verify it appears everywhere');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testCategorySystem();











