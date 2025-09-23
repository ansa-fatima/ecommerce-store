// Test script to verify category addition
const testCategory = async () => {
  try {
    console.log('🧪 Testing category addition...');
    
    // Test adding a category via API
    const response = await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Category',
        description: 'This is a test category',
        image: '/test-image.jpg',
        productCount: 0,
        href: '/products?category=test-category',
        isActive: true
      })
    });
    
    const result = await response.json();
    console.log('✅ API Response:', result);
    
    // Test getting all categories
    const getResponse = await fetch('http://localhost:3000/api/categories');
    const categories = await getResponse.json();
    console.log('📋 All categories:', categories);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testCategory();








