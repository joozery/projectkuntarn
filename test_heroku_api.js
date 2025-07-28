// Test script for Heroku API
// Run this in browser console

console.log('🔍 Testing Heroku API...\n');

async function testHerokuAPI() {
  const contractId = 9;
  
  // Test health endpoint
  console.log('1. Testing Heroku health endpoint...');
  try {
    const healthResponse = await fetch('https://backendkuntarn-e0ddf979d118.herokuapp.com/api/health');
    console.log('✅ Health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('✅ Health data:', data);
    } else {
      console.log('❌ Health error:', healthResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Health error:', error.message);
  }

  // Test installments endpoint
  console.log('\n2. Testing Heroku installments endpoint...');
  try {
    const installmentsResponse = await fetch('https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments');
    console.log('✅ Installments status:', installmentsResponse.status);
    
    if (installmentsResponse.ok) {
      const data = await installmentsResponse.json();
      console.log('✅ Installments count:', data.data?.length || 0);
      if (data.data?.length > 0) {
        console.log('📋 First contract:', {
          id: data.data[0].id,
          contractNumber: data.data[0].contractNumber,
          customerName: data.data[0].customerName
        });
      }
    } else {
      console.log('❌ Installments error:', installmentsResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Installments error:', error.message);
  }

  // Test specific contract
  console.log(`\n3. Testing Heroku contract ${contractId}...`);
  try {
    const contractResponse = await fetch(`https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}`);
    console.log('✅ Contract status:', contractResponse.status);
    
    if (contractResponse.ok) {
      const data = await contractResponse.json();
      console.log('✅ Contract data:', {
        success: data.success,
        id: data.data?.id,
        contractNumber: data.data?.contractNumber,
        customerName: data.data?.customerName,
        productName: data.data?.productName,
        totalAmount: data.data?.totalAmount
      });
    } else {
      console.log('❌ Contract error:', contractResponse.statusText);
      const errorData = await contractResponse.json();
      console.log('❌ Error details:', errorData);
    }
  } catch (error) {
    console.log('❌ Contract error:', error.message);
  }

  // Test checkers endpoint
  console.log('\n4. Testing Heroku checkers endpoint...');
  try {
    const checkersResponse = await fetch('https://backendkuntarn-e0ddf979d118.herokuapp.com/api/checkers?branchId=1');
    console.log('✅ Checkers status:', checkersResponse.status);
    
    if (checkersResponse.ok) {
      const data = await checkersResponse.json();
      console.log('✅ Checkers count:', data.data?.length || 0);
    } else {
      console.log('❌ Checkers error:', checkersResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Checkers error:', error.message);
  }
}

// Run test
testHerokuAPI(); 