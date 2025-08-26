const fetch = require('node-fetch');

// Test script to check backend installments API
// This will help identify what data is being returned from the backend

async function testInstallmentsAPI() {
  console.log('🔍 Testing Backend Installments API...\n');
  
  // Test 1: Get all installments
  console.log('1. Testing GET /api/installments...');
  try {
    const response = await fetch('http://localhost:5000/api/installments');
    const data = await response.json();
    
    console.log('✅ Status:', response.status);
    console.log('✅ Response structure:', Object.keys(data));
    
    if (data.data && Array.isArray(data.data)) {
      console.log('✅ Installments count:', data.data.length);
      
      if (data.data.length > 0) {
        const firstContract = data.data[0];
        console.log('✅ First contract sample:');
        console.log('   - ID:', firstContract.id);
        console.log('   - Contract Number:', firstContract.contractNumber);
        console.log('   - Product ID:', firstContract.productId);
        console.log('   - Product Name:', firstContract.productName);
        console.log('   - Line:', firstContract.line);
        console.log('   - Collector ID:', firstContract.collectorId);
        console.log('   - All keys:', Object.keys(firstContract));
      }
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Get specific installment by ID
  console.log('2. Testing GET /api/installments/:id...');
  
  // First get a contract ID from the list
  try {
    const listResponse = await fetch('http://localhost:5000/api/installments');
    const listData = await listResponse.json();
    
    if (listData.data && listData.data.length > 0) {
      const contractId = listData.data[0].id;
      console.log('🔍 Testing with contract ID:', contractId);
      
      const detailResponse = await fetch(`http://localhost:5000/api/installments/${contractId}`);
      const detailData = await detailResponse.json();
      
      console.log('✅ Status:', detailResponse.status);
      console.log('✅ Response structure:', Object.keys(detailData));
      
      if (detailData.data) {
        const contract = detailData.data;
        console.log('✅ Contract details:');
        console.log('   - ID:', contract.id);
        console.log('   - Contract Number:', contract.contractNumber);
        console.log('   - Product ID:', contract.productId);
        console.log('   - Product Name:', contract.productName);
        console.log('   - Line:', contract.line);
        console.log('   - Collector ID:', contract.collectorId);
        console.log('   - Customer ID:', contract.customerId);
        console.log('   - Salesperson ID:', contract.salespersonId);
        console.log('   - Inspector ID:', contract.inspectorId);
        console.log('   - All keys:', Object.keys(contract));
        
        // Check if critical fields are present
        console.log('\n🔍 Critical field check:');
        console.log('   - productId present:', !!contract.productId);
        console.log('   - collectorId present:', !!contract.collectorId);
        console.log('   - line present:', !!contract.line);
        console.log('   - customerId present:', !!contract.customerId);
        console.log('   - salespersonId present:', !!contract.salespersonId);
        console.log('   - inspectorId present:', !!contract.inspectorId);
      }
    } else {
      console.log('⚠️ No contracts found to test with');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Check database schema
  console.log('3. Testing database schema...');
  try {
    // This would require direct database access
    console.log('⚠️ Database schema check requires direct database access');
    console.log('🔍 Expected columns in installments table:');
    console.log('   - product_id (BIGINT)');
    console.log('   - collector_id (BIGINT)');
    console.log('   - line (VARCHAR)');
    console.log('   - inspector_id (BIGINT)');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run the test
testInstallmentsAPI().catch(console.error);

console.log('\n📋 To run this test:');
console.log('   1. Make sure backend is running on port 5000');
console.log('   2. Run: node test_backend_installments_api.js');
console.log('   3. Check the output for data structure and missing fields');
