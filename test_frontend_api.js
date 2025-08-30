// Test Frontend API Integration
const API_BASE = 'https://72-60-43-104.sslip.io/kuntarn/api';

// Test 1: Test all main endpoints
async function testAllEndpoints() {
  console.log('🚀 Testing all API endpoints...\n');
  
  const endpoints = [
    { name: 'Health Check', path: '/health' },
    { name: 'Branches', path: '/branches' },
    { name: 'Customers', path: '/customers' },
    { name: 'Products', path: '/products' },
    { name: 'Employees', path: '/employees' },
    { name: 'Checkers', path: '/checkers' },
    { name: 'Installments', path: '/installments' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testing ${endpoint.name}...`);
      const response = await fetch(`${API_BASE}${endpoint.path}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: Success (${response.status})`);
        console.log(`   Data count: ${data.data ? data.data.length : 'N/A'}`);
      } else {
        console.log(`⚠️ ${endpoint.name}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name}: Error -`, error.message);
    }
    console.log('');
  }
}

// Test 2: Test specific data loading
async function testDataLoading() {
  console.log('📊 Testing data loading...\n');
  
  try {
    // Test branches
    const branchesResponse = await fetch(`${API_BASE}/branches`);
    const branchesData = await branchesResponse.json();
    console.log('🏢 Branches:', branchesData.data?.length || 0, 'items');
    
    // Test customers
    const customersResponse = await fetch(`${API_BASE}/customers`);
    const customersData = await customersResponse.json();
    console.log('👥 Customers:', customersData.data?.length || 0, 'items');
    
    // Test products
    const productsResponse = await fetch(`${API_BASE}/products`);
    const productsData = await productsResponse.json();
    console.log('📦 Products:', productsData.data?.length || 0, 'items');
    
    console.log('\n✅ All data loaded successfully!');
    
  } catch (error) {
    console.error('❌ Data loading failed:', error);
  }
}

// Test 3: Test with different HTTP methods
async function testHTTPMethods() {
  console.log('🔧 Testing HTTP methods...\n');
  
  try {
    // GET request
    const getResponse = await fetch(`${API_BASE}/branches`);
    console.log('✅ GET /branches:', getResponse.status);
    
    // POST request (should fail for read-only endpoint)
    const postResponse = await fetch(`${API_BASE}/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    });
    console.log('📝 POST /branches:', postResponse.status);
    
  } catch (error) {
    console.error('❌ HTTP methods test failed:', error);
  }
}

// Test 4: Performance test
async function testPerformance() {
  console.log('⚡ Testing API performance...\n');
  
  const startTime = performance.now();
  
  try {
    const promises = [
      fetch(`${API_BASE}/branches`),
      fetch(`${API_BASE}/customers`),
      fetch(`${API_BASE}/products`)
    ];
    
    const responses = await Promise.all(promises);
    const endTime = performance.now();
    
    console.log(`✅ All requests completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    responses.forEach((response, index) => {
      const endpoints = ['/branches', '/customers', '/products'];
      console.log(`   ${endpoints[index]}: ${response.status}`);
    });
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🎯 Starting Frontend API Integration Tests...\n');
  
  await testAllEndpoints();
  await testDataLoading();
  await testHTTPMethods();
  await testPerformance();
  
  console.log('\n🏁 All tests completed!');
  console.log('\n💡 If all tests pass, your frontend is ready to use the new API!');
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.testFrontendAPI = {
    testAllEndpoints,
    testDataLoading,
    testHTTPMethods,
    testPerformance,
    runAllTests
  };
  console.log('🌐 Frontend API tests loaded! Use testFrontendAPI.runAllTests() to start');
}

// Auto-run if in Node.js
if (typeof window === 'undefined') {
  runAllTests();
}
