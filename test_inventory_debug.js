// Test script for inventory API debugging
// This script tests the updated inventory API with getAll parameter

import axios from 'axios';

// API base URL (ปรับตาม environment)
const API_BASE_URL = 'http://localhost:3001'; // หรือ URL ของ backend ที่รันอยู่

console.log('🔍 Testing Updated Inventory API...');

async function testInventoryAPI() {
  try {
    console.log('\n📡 Testing API endpoint:', `${API_BASE_URL}/api/inventory`);
    
    // Test 1: Default call (should return limited items)
    console.log('\n📄 Test 1: Default call (limited items)');
    const defaultResponse = await axios.get(`${API_BASE_URL}/api/inventory`, {
      params: {
        branchId: 1
      }
    });
    
    console.log('Default response:');
    console.log('  - Status:', defaultResponse.status);
    console.log('  - Data length:', defaultResponse.data?.data?.length || 0);
    console.log('  - Total items in DB:', defaultResponse.data?.pagination?.totalItems);
    console.log('  - Items per page:', defaultResponse.data?.pagination?.itemsPerPage);
    console.log('  - Total pages:', defaultResponse.data?.pagination?.totalPages);
    
    // Test 2: With getAll=true (should return all items)
    console.log('\n📦 Test 2: With getAll=true (all items)');
    const getAllResponse = await axios.get(`${API_BASE_URL}/api/inventory`, {
      params: {
        branchId: 1,
        getAll: true
      }
    });
    
    console.log('getAll response:');
    console.log('  - Status:', getAllResponse.status);
    console.log('  - Data length:', getAllResponse.data?.data?.length || 0);
    console.log('  - Total items in DB:', getAllResponse.data?.pagination?.totalItems);
    console.log('  - Items per page:', getAllResponse.data?.pagination?.itemsPerPage);
    console.log('  - Total pages:', getAllResponse.data?.pagination?.totalPages);
    
    // Test 3: With status=all (should return all items regardless of status)
    console.log('\n🌐 Test 3: With status=all');
    const statusAllResponse = await axios.get(`${API_BASE_URL}/api/inventory`, {
      params: {
        branchId: 1,
        status: 'all'
      }
    });
    
    console.log('Status all response:');
    console.log('  - Status:', statusAllResponse.status);
    console.log('  - Data length:', statusAllResponse.data?.data?.length || 0);
    console.log('  - Total items in DB:', statusAllResponse.data?.pagination?.totalItems);
    
    // Test 4: With high limit (should return many items)
    console.log('\n🔢 Test 4: With high limit');
    const highLimitResponse = await axios.get(`${API_BASE_URL}/api/inventory`, {
      params: {
        branchId: 1,
        limit: 1000
      }
    });
    
    console.log('High limit response:');
    console.log('  - Status:', highLimitResponse.status);
    console.log('  - Data length:', highLimitResponse.data?.data?.length || 0);
    console.log('  - Total items in DB:', highLimitResponse.data?.pagination?.totalItems);
    
    // Compare results
    console.log('\n📊 Comparison Results:');
    const defaultItems = defaultResponse.data?.data?.length || 0;
    const getAllItems = getAllResponse.data?.data?.length || 0;
    const statusAllItems = statusAllResponse.data?.data?.length || 0;
    const highLimitItems = highLimitResponse.data?.data?.length || 0;
    
    console.log('Default call items:', defaultItems);
    console.log('getAll call items:', getAllItems);
    console.log('Status all items:', statusAllItems);
    console.log('High limit items:', highLimitItems);
    
    // Analysis
    console.log('\n🔍 Analysis:');
    
    if (getAllItems > defaultItems) {
      console.log('✅ getAll=true returns more items than default');
    } else {
      console.log('❌ getAll=true does not return more items than default');
    }
    
    if (getAllItems === getAllResponse.data?.pagination?.totalItems) {
      console.log('✅ getAll=true returns all items from database');
    } else {
      console.log('❌ getAll=true does not return all items from database');
    }
    
    // Check item status distribution
    if (getAllResponse.data?.data?.length > 0) {
      console.log('\n📋 Item Status Distribution (getAll):');
      const statusCount = {};
      getAllResponse.data.data.forEach(item => {
        statusCount[item.status] = (statusCount[item.status] || 0) + 1;
      });
      
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`  - ${status}: ${count} items`);
      });
      
      // Check stock distribution
      console.log('\n📦 Stock Distribution (getAll):');
      const stockCount = {
        '0': 0,
        '1-5': 0,
        '6-10': 0,
        '11+': 0
      };
      
      getAllResponse.data.data.forEach(item => {
        const qty = Number(item.remaining_quantity1);
        if (qty === 0) stockCount['0']++;
        else if (qty <= 5) stockCount['1-5']++;
        else if (qty <= 10) stockCount['6-10']++;
        else stockCount['11+']++;
      });
      
      Object.entries(stockCount).forEach(([range, count]) => {
        console.log(`  - ${range}: ${count} items`);
      });
    }
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (getAllItems < getAllResponse.data?.pagination?.totalItems) {
      console.log('⚠️ getAll=true is not returning all items. Check backend logic.');
    } else {
      console.log('✅ getAll=true is working correctly.');
    }
    
    if (defaultItems < getAllItems) {
      console.log('✅ Default filter is working correctly (returning fewer items).');
    } else {
      console.log('⚠️ Default filter might not be working correctly.');
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
  console.log('Check the results above to see if the fixes work correctly.');
}).catch(error => {
  console.error('❌ Test failed:', error.message);
});
