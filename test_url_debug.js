// Test script to debug URL issue
// Run this in browser console

console.log('🔍 Testing URL Debug...\n');

async function testUrlDebug() {
  const contractId = 9;
  
  // Test 1: Check what URL the service actually calls
  console.log('1. Testing installmentsService.getById...');
  try {
    // Import the service
    const { installmentsService } = await import('./src/services/installmentsService.js');
    
    console.log('🔍 Service BASE_URL:', '/installments');
    console.log('🔍 Expected URL:', `https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}`);
    
    const response = await installmentsService.getById(contractId);
    console.log('✅ Service call successful');
    console.log('📋 Response:', response);
    
  } catch (error) {
    console.log('❌ Service call failed:', error.message);
    console.log('❌ Error details:', error);
  }
  
  // Test 2: Direct fetch with correct URL
  console.log('\n2. Testing direct fetch with correct URL...');
  try {
    const correctUrl = `https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}?_t=${Date.now()}`;
    console.log('🔍 Calling:', correctUrl);
    
    const response = await fetch(correctUrl);
    console.log('📋 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct fetch successful');
      console.log('📋 Data:', data);
    } else {
      console.log('❌ Direct fetch failed:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.log('❌ Direct fetch error:', error.message);
  }
  
  // Test 3: Check if there's a cached version
  console.log('\n3. Testing with different cache busting...');
  try {
    const timestamp = Date.now();
    const randomParam = Math.random();
    const url = `https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}?_t=${timestamp}&_r=${randomParam}`;
    console.log('🔍 Calling with random cache busting:', url);
    
    const response = await fetch(url);
    console.log('📋 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Random cache busting successful');
    } else {
      console.log('❌ Random cache busting failed:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Random cache busting error:', error.message);
  }
  
  // Test 4: Check network tab
  console.log('\n4. Network Tab Check:');
  console.log('🔍 Open Developer Tools (F12)');
  console.log('🔍 Go to Network tab');
  console.log('🔍 Click the Edit button in the contracts table');
  console.log('🔍 Look for the API call URL');
  console.log('🔍 Check if it shows: /api/api/installments/9');
}

// Run test
testUrlDebug(); 