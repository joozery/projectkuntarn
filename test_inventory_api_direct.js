// Test script for inventory API direct testing
// This script tests the inventory API directly to see if getAll parameter works

const axios = require('axios');

// API base URL (ปรับตาม environment)
const API_BASE_URL = 'http://localhost:3001'; // หรือ URL ของ backend ที่รันอยู่

console.log('🔍 Testing Inventory API directly...');

async function testInventoryAPI() {
  try {
    console.log('\n📡 Testing API endpoint:', `${API_BASE_URL}/api/inventory`);
    
    // Test 1: Default call (without getAll)
    console.log('\n📄 Test 1: Default call (without getAll)');
    const defaultResponse = await axios.get(`${API_BASE_URL}/api/inventory`, {
      params: {
        branchId: 1
      }
    });
    
    console.log('Default response status:', defaultResponse.status);
    console.log('Default response data length:', defaultResponse.data?.data?.length || 0);
    console.log('Default pagination:', defaultResponse.data?.pagination);
    console.log('Default total items:', defaultResponse.data?.pagination?.totalItems);
    
    // Test 2: With getAll=true
    console.log('\n📦 Test 2: With getAll=true');
    const getAllResponse = await axios.get(`${API_BASE_URL}/api/inventory`, {
      params: {
        branchId: 1,
        getAll: true
      }
    });
    
    console.log('getAll response status:', getAllResponse.status);
    console.log('getAll response data length:', getAllResponse.data?.data?.length || 0);
    console.log('getAll pagination:', getAllResponse.data?.pagination);
    console.log('getAll total items:', getAllResponse.data?.pagination?.totalItems);
    
    // Test 3: With high limit
    console.log('\n🔢 Test 3: With high limit');
    const highLimitResponse = await axios.get(`${API_BASE_URL}/api/inventory`, {
      params: {
        branchId: 1,
        limit: 1000
      }
    });
    
    console.log('High limit response status:', highLimitResponse.status);
    console.log('High limit response data length:', highLimitResponse.data?.data?.length || 0);
    console.log('High limit pagination:', highLimitResponse.data?.pagination);
    console.log('High limit total items:', highLimitResponse.data?.pagination?.totalItems);
    
    // Compare results
    console.log('\n📊 Comparison:');
    console.log('Default call items:', defaultResponse.data?.data?.length || 0);
    console.log('getAll call items:', getAllResponse.data?.data?.length || 0);
    console.log('High limit items:', highLimitResponse.data?.data?.length || 0);
    
    const defaultItems = defaultResponse.data?.data?.length || 0;
    const getAllItems = getAllResponse.data?.data?.length || 0;
    const highLimitItems = highLimitResponse.data?.data?.length || 0;
    
    console.log('\n✅ Results:');
    if (getAllItems > defaultItems) {
      console.log('✅ getAll=true returns more items than default');
    } else {
      console.log('❌ getAll=true does not return more items');
    }
    
    if (getAllItems === highLimitItems) {
      console.log('✅ getAll=true returns same items as high limit');
    } else {
      console.log('❌ getAll=true returns different items than high limit');
    }
    
    // Test 4: Check if items are filtered correctly
    console.log('\n🔍 Test 4: Check item filtering');
    if (getAllResponse.data?.data?.length > 0) {
      const sampleItems = getAllResponse.data.data.slice(0, 5);
      console.log('Sample items:');
      sampleItems.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id}, Name: ${item.product_name}, Status: ${item.status}, Qty: ${item.remaining_quantity1}`);
      });
      
      const activeItems = getAllResponse.data.data.filter(item => item.status === 'active');
      const itemsWithStock = getAllResponse.data.data.filter(item => Number(item.remaining_quantity1) > 0);
      
      console.log('Active items:', activeItems.length);
      console.log('Items with stock > 0:', itemsWithStock.length);
      console.log('Total items returned:', getAllResponse.data.data.length);
    }
    
    // Test 5: Check response structure
    console.log('\n🏗️ Test 5: Check response structure');
    console.log('Response has success:', !!getAllResponse.data?.success);
    console.log('Response has data array:', Array.isArray(getAllResponse.data?.data));
    console.log('Response has pagination:', !!getAllResponse.data?.pagination);
    
    if (getAllResponse.data?.pagination) {
      console.log('Pagination structure:');
      console.log('  - currentPage:', getAllResponse.data.pagination.currentPage);
      console.log('  - totalPages:', getAllResponse.data.pagination.totalPages);
      console.log('  - totalItems:', getAllResponse.data.pagination.totalItems);
      console.log('  - itemsPerPage:', getAllResponse.data.pagination.itemsPerPage);
      console.log('  - hasNextPage:', getAllResponse.data.pagination.hasNextPage);
      console.log('  - hasPrevPage:', getAllResponse.data.pagination.hasPrevPage);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testInventoryAPI().then(() => {
  console.log('\n🎯 API test completed!');
  console.log('Check the results above to see if getAll parameter works correctly.');
}).catch(error => {
  console.error('❌ Test failed:', error.message);
});
