// Simple API test script
const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing Ecommerce API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test products API
    console.log('\n2. Testing products API...');
    const productsResponse = await fetch(`${API_BASE}/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products:', productsData.data?.length || 0, 'items');

    // Test categories API
    console.log('\n3. Testing categories API...');
    const categoriesResponse = await fetch(`${API_BASE}/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categories:', categoriesData.data?.length || 0, 'items');

    // Test creating a new product
    console.log('\n4. Testing product creation...');
    const newProduct = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 100,
      category: 'Test',
      brand: 'Test Brand',
      inStock: true,
      stock: 10,
      status: 'active',
      images: ['/test.jpg'],
      tags: ['test']
    };

    const createResponse = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    const createData = await createResponse.json();
    console.log('✅ Product created:', createData.success ? 'Success' : 'Failed');

    console.log('\n🎉 API tests completed!');
    console.log('\n📊 API Endpoints:');
    console.log('   GET  /api/health - Health check');
    console.log('   GET  /api/products - Get all products');
    console.log('   POST /api/products - Create product');
    console.log('   PUT  /api/products - Update product');
    console.log('   DELETE /api/products?id=X - Delete product');
    console.log('   GET  /api/categories - Get all categories');
    console.log('   POST /api/categories - Create category');
    console.log('   PUT  /api/categories - Update category');
    console.log('   DELETE /api/categories?id=X - Delete category');
    console.log('   POST /api/auth/login - Admin login');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();








