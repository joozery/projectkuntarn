// Test script for fixed API URL
// Run this in browser console

console.log('🔍 Testing Fixed API URL...\n');

async function testFixedUrl() {
  const contractId = 9;
  
  // Test 1: Test the correct URL (without double /api)
  console.log('1. Testing correct URL...');
  const correctUrl = `https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}?_t=${Date.now()}`;
  console.log('🔍 Correct URL:', correctUrl);
  
  try {
    const response = await fetch(correctUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Response status:', response.status);
    
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
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 2: Test the wrong URL (with double /api)
  console.log('\n2. Testing wrong URL (for comparison)...');
  const wrongUrl = `https://backendkuntarn-e0ddf979d118.herokuapp.com/api/api/installments/${contractId}?_t=${Date.now()}`;
  console.log('🔍 Wrong URL:', wrongUrl);
  
  try {
    const response = await fetch(wrongUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response data:', data);
    } else {
      console.log('❌ Error response:', response.status, response.statusText);
      const errorData = await response.text();
      console.log('❌ Error body:', errorData);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 3: Test installmentsService simulation
  console.log('\n3. Testing installmentsService simulation...');
  const baseUrl = 'https://backendkuntarn-e0ddf979d118.herokuapp.com/api';
  const serviceUrl = `${baseUrl}/installments/${contractId}?_t=${Date.now()}`;
  console.log('🔍 Service URL:', serviceUrl);
  
  try {
    const response = await fetch(serviceUrl);
    console.log('✅ Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Service response:', data);
    } else {
      console.log('❌ Service error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Service error:', error.message);
  }
}

// Run test
testFixedUrl(); 