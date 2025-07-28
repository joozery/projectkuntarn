// Test script for API endpoint
// Run this in browser console

console.log('🔍 Testing API Endpoint...\n');

async function testAPIEndpoint() {
  const contractId = 9;
  
  // Test localhost
  console.log('1. Testing localhost:5000...');
  try {
    const localResponse = await fetch(`http://localhost:5000/api/installments/${contractId}`);
    console.log('✅ Localhost status:', localResponse.status);
    
    if (localResponse.ok) {
      const data = await localResponse.json();
      console.log('✅ Localhost data:', data);
    } else {
      console.log('❌ Localhost error:', localResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Localhost error:', error.message);
  }

  // Test Heroku
  console.log('\n2. Testing Heroku...');
  try {
    const herokuResponse = await fetch(`https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}`);
    console.log('✅ Heroku status:', herokuResponse.status);
    
    if (herokuResponse.ok) {
      const data = await herokuResponse.json();
      console.log('✅ Heroku data:', data);
    } else {
      console.log('❌ Heroku error:', herokuResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Heroku error:', error.message);
  }

  // Test health endpoint
  console.log('\n3. Testing health endpoint...');
  try {
    const healthResponse = await fetch('http://localhost:5000/api/health');
    console.log('✅ Health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('✅ Health data:', data);
    }
  } catch (error) {
    console.log('❌ Health error:', error.message);
  }
}

// Run test
testAPIEndpoint(); 