const fetch = require('node-fetch');

const API_BASE_URL = 'https://kuntran-backend-api-86c9bb65f6fb.herokuapp.com/api';

async function testContractFormAPIs() {
  console.log('🧪 Testing ContractForm APIs...\n');

  try {
    // Test Inventory API
    console.log('📦 Testing Inventory API...');
    const inventoryResponse = await fetch(`${API_BASE_URL}/inventory?branchId=1&limit=10`);
    const inventoryData = await inventoryResponse.json();
    
    console.log('✅ Inventory API Response:');
    console.log(`- Success: ${inventoryData.success}`);
    console.log(`- Total Items: ${inventoryData.pagination?.totalItems || 'N/A'}`);
    console.log(`- Data Count: ${inventoryData.data?.length || 0}`);
    
    if (inventoryData.data && inventoryData.data.length > 0) {
      console.log('- Sample Item:');
      console.log(`  * ID: ${inventoryData.data[0].id}`);
      console.log(`  * Product Name: ${inventoryData.data[0].product_name}`);
      console.log(`  * Status: ${inventoryData.data[0].status}`);
      console.log(`  * Remaining Qty: ${inventoryData.data[0].remaining_quantity1}`);
    }
    
    // Filter active items with remaining quantity > 0
    const activeItems = inventoryData.data?.filter(item => 
      item.status === 'active' && Number(item.remaining_quantity1) > 0
    ) || [];
    
    console.log(`- Active Items with Qty > 0: ${activeItems.length}`);
    
    if (activeItems.length > 0) {
      console.log('- Sample Active Item:');
      console.log(`  * ID: ${activeItems[0].id}`);
      console.log(`  * Product Name: ${activeItems[0].product_name}`);
      console.log(`  * Status: ${activeItems[0].status}`);
      console.log(`  * Remaining Qty: ${activeItems[0].remaining_quantity1}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test Customers API
    console.log('👥 Testing Customers API...');
    const customersResponse = await fetch(`${API_BASE_URL}/customers?branchId=1&limit=5`);
    const customersData = await customersResponse.json();
    
    console.log('✅ Customers API Response:');
    console.log(`- Success: ${customersData.success}`);
    console.log(`- Total: ${customersData.total || 'N/A'}`);
    console.log(`- Data Count: ${customersData.data?.length || 0}`);
    
    if (customersData.data && customersData.data.length > 0) {
      console.log('- Sample Customer:');
      console.log(`  * ID: ${customersData.data[0].id}`);
      console.log(`  * Name: ${customersData.data[0].name}`);
      console.log(`  * Full Name: ${customersData.data[0].full_name}`);
      console.log(`  * Phone: ${customersData.data[0].phone}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test Employees API
    console.log('👷 Testing Employees API...');
    const employeesResponse = await fetch(`${API_BASE_URL}/employees?branchId=1&limit=5`);
    const employeesData = await employeesResponse.json();
    
    console.log('✅ Employees API Response:');
    console.log(`- Success: ${employeesData.success}`);
    console.log(`- Total: ${employeesData.total || 'N/A'}`);
    console.log(`- Data Count: ${employeesData.data?.length || 0}`);
    
    if (employeesData.data && employeesData.data.length > 0) {
      console.log('- Sample Employee:');
      console.log(`  * ID: ${employeesData.data[0].id}`);
      console.log(`  * Name: ${employeesData.data[0].name}`);
      console.log(`  * Full Name: ${employeesData.data[0].full_name}`);
      console.log(`  * Position: ${employeesData.data[0].position}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test Checkers API
    console.log('🔍 Testing Checkers API...');
    const checkersResponse = await fetch(`${API_BASE_URL}/checkers?branchId=1&limit=5`);
    const checkersData = await checkersResponse.json();
    
    console.log('✅ Checkers API Response:');
    console.log(`- Success: ${checkersData.success}`);
    console.log(`- Total: ${checkersData.total || 'N/A'}`);
    console.log(`- Data Count: ${checkersData.data?.length || 0}`);
    
    if (checkersData.data && checkersData.data.length > 0) {
      console.log('- Sample Checker:');
      console.log(`  * ID: ${checkersData.data[0].id}`);
      console.log(`  * Name: ${checkersData.data[0].name}`);
      console.log(`  * Full Name: ${checkersData.data[0].full_name}`);
      console.log(`  * Position: ${checkersData.data[0].position}`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Summary
    console.log('📊 SUMMARY:');
    console.log(`- Inventory: ${inventoryData.data?.length || 0} items (${activeItems.length} active with qty > 0)`);
    console.log(`- Customers: ${customersData.data?.length || 0} customers`);
    console.log(`- Employees: ${employeesData.data?.length || 0} employees`);
    console.log(`- Checkers: ${checkersData.data?.length || 0} checkers`);
    
    if (activeItems.length === 0) {
      console.log('\n⚠️  WARNING: No active inventory items with remaining quantity > 0!');
      console.log('   This means the product dropdown will be empty.');
      console.log('   Check if inventory items have correct status and remaining_quantity1 values.');
    }

  } catch (error) {
    console.error('❌ Error testing APIs:', error.message);
  }
}

// Run the test
testContractFormAPIs();


