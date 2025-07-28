// Test script for checkers service in frontend
// Run this in browser console

console.log('🔍 Testing Checkers Service in Frontend...\n');

// Mock the checkersService for testing
const testCheckersService = {
  getAll: async (branchId, params = {}) => {
    try {
      console.log('🔍 checkersService.getAll called with branchId:', branchId, 'params:', params);
      
      // Create params object with branchId
      const queryParams = { branchId, ...params };
      
      // Add cache busting
      queryParams._t = new Date().getTime();
      console.log('🔄 Making API call to /checkers with params:', queryParams);
      
      // Simulate API call
      const response = await fetch(`http://localhost:3000/api/checkers?${new URLSearchParams(queryParams)}`);
      const data = await response.json();
      
      console.log('✅ checkersService.getAll response:', { data });
      
      return { data };
    } catch (error) {
      console.error('❌ checkersService.getAll error:', error);
      throw error;
    }
  }
};

// Test cases
async function runTests() {
  console.log('🧪 Running test cases...\n');

  try {
    // Test 1: Call with branchId only
    console.log('1. Testing getAll(1)...');
    const result1 = await testCheckersService.getAll(1);
    console.log('✅ Result 1:', result1);

    // Test 2: Call with branchId and search
    console.log('\n2. Testing getAll(1, { search: "อนุชิต" })...');
    const result2 = await testCheckersService.getAll(1, { search: 'อนุชิต' });
    console.log('✅ Result 2:', result2);

    // Test 3: Call with branchId and other params
    console.log('\n3. Testing getAll(1, { _t: 123456 })...');
    const result3 = await testCheckersService.getAll(1, { _t: 123456 });
    console.log('✅ Result 3:', result3);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
runTests();

// Also test the actual service if available
if (typeof window !== 'undefined' && window.checkersService) {
  console.log('\n🧪 Testing actual checkersService...');
  window.checkersService.getAll(1).then(result => {
    console.log('✅ Actual service result:', result);
  }).catch(error => {
    console.error('❌ Actual service error:', error);
  });
} 