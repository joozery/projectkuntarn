// Test script to check API URL that frontend is calling
// Run this in browser console

console.log('🔍 Testing API URL that frontend calls...\n');

async function testApiUrl() {
  const contractId = 9;
  
  // Test 1: Test the exact URL that frontend calls
  console.log('1. Testing frontend API URL...');
  const frontendUrl = `https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}?_t=${Date.now()}`;
  console.log('🔍 Frontend URL:', frontendUrl);
  
  try {
    const response = await fetch(frontendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response data:', data);
      
      if (data.success && data.data) {
        const contract = data.data;
        console.log('📋 Contract found:');
        console.log('   - ID:', contract.id);
        console.log('   - Contract Number:', contract.contractNumber);
        console.log('   - Customer Name:', contract.customerName);
        console.log('   - Product Name:', contract.productName);
        console.log('   - Total Amount:', contract.totalAmount);
      }
    } else {
      console.log('❌ Error response:', response.status, response.statusText);
      const errorData = await response.text();
      console.log('❌ Error body:', errorData);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 2: Test without cache busting
  console.log('\n2. Testing without cache busting...');
  const simpleUrl = `https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}`;
  console.log('🔍 Simple URL:', simpleUrl);
  
  try {
    const response = await fetch(simpleUrl);
    console.log('✅ Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response data:', data);
    } else {
      console.log('❌ Error response:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 3: Test with different headers
  console.log('\n3. Testing with different headers...');
  try {
    const response = await fetch(frontendUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response data:', data);
    } else {
      console.log('❌ Error response:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 4: Test CORS
  console.log('\n4. Testing CORS...');
  try {
    const response = await fetch(frontendUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ CORS preflight status:', response.status);
    console.log('✅ CORS headers:', Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.log('❌ CORS error:', error.message);
  }
}

// Run test
testApiUrl(); 