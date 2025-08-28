// Test script for frontend inventory API call
// This script simulates the frontend API call to see what's happening

import axios from 'axios';

// Simulate the frontend API call
const API_BASE_URL = 'https://kuntran-backend-api-86c9bb65f6fb.herokuapp.com/api';

console.log('🔍 Testing Frontend Inventory API Call...');

async function testFrontendInventoryAPI() {
  try {
    console.log('\n📡 Testing API endpoint:', `${API_BASE_URL}/inventory`);
    
    // Test 1: Simulate frontend call with limit=1000
    console.log('\n📦 Test 1: Frontend call with limit=1000');
    const frontendResponse = await axios.get(`${API_BASE_URL}/inventory`, {
      params: {
        branchId: 1,
        limit: 1000
      }
    });
    
    console.log('Frontend response:');
    console.log('  - Status:', frontendResponse.status);
    console.log('  - Data length:', frontendResponse.data?.data?.length || 0);
    console.log('  - Total items in DB:', frontendResponse.data?.pagination?.totalItems);
    console.log('  - Items per page:', frontendResponse.data?.pagination?.itemsPerPage);
    console.log('  - Total pages:', frontendResponse.data?.pagination?.totalPages);
    
    // Test 2: Test with different limit values
    console.log('\n🔢 Test 2: Different limit values');
    const limits = [15, 50, 100, 500, 1000];
    
    for (const limit of limits) {
      try {
        const response = await axios.get(`${API_BASE_URL}/inventory`, {
          params: {
            branchId: 1,
            limit: limit
          }
        });
        
        console.log(`  - Limit ${limit}: ${response.data?.data?.length || 0} items`);
      } catch (error) {
        console.log(`  - Limit ${limit}: Error - ${error.message}`);
      }
    }
    
    // Test 3: Test with different branch IDs
    console.log('\n🏢 Test 3: Different branch IDs');
    const branchIds = [1, 2, 3];
    
    for (const branchId of branchIds) {
      try {
        const response = await axios.get(`${API_BASE_URL}/inventory`, {
          params: {
            branchId: branchId,
            limit: 100
          }
        });
        
        console.log(`  - Branch ${branchId}: ${response.data?.data?.length || 0} items`);
      } catch (error) {
        console.log(`  - Branch ${branchId}: Error - ${error.message}`);
      }
    }
    
    // Test 4: Test error handling
    console.log('\n⚠️ Test 4: Error handling');
    
    // Test with invalid branch ID
    try {
      const invalidResponse = await axios.get(`${API_BASE_URL}/inventory`, {
        params: {
          branchId: 999,
          limit: 100
        }
      });
      console.log('  - Invalid branch ID: Success (unexpected)');
    } catch (error) {
      console.log('  - Invalid branch ID: Error (expected) -', error.response?.status || error.message);
    }
    
    // Test with invalid limit
    try {
      const invalidLimitResponse = await axios.get(`${API_BASE_URL}/inventory`, {
        params: {
          branchId: 1,
          limit: -1
        }
      });
      console.log('  - Invalid limit: Success (unexpected)');
    } catch (error) {
      console.log('  - Invalid limit: Error (expected) -', error.response?.status || error.message);
    }
    
    // Test 5: Check response structure
    console.log('\n🏗️ Test 5: Response structure analysis');
    if (frontendResponse.data?.data?.length > 0) {
      console.log('✅ Response has data');
      console.log('  - First item keys:', Object.keys(frontendResponse.data.data[0]));
      console.log('  - First item sample:', {
        id: frontendResponse.data.data[0].id,
        product_name: frontendResponse.data.data[0].product_name,
        status: frontendResponse.data.data[0].status,
        remaining_quantity1: frontendResponse.data.data[0].remaining_quantity1
      });
    } else {
      console.log('❌ Response has no data');
    }
    
    // Test 6: Performance test
    console.log('\n⚡ Test 6: Performance test');
    const startTime = Date.now();
    
    try {
      const perfResponse = await axios.get(`${API_BASE_URL}/inventory`, {
        params: {
          branchId: 1,
          limit: 1000
        }
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`  - Response time: ${duration}ms`);
      console.log(`  - Data size: ${JSON.stringify(perfResponse.data).length} characters`);
      console.log(`  - Items received: ${perfResponse.data?.data?.length || 0}`);
    } catch (error) {
      console.log('  - Performance test failed:', error.message);
    }
    
    // Summary
    console.log('\n📊 Summary:');
    const totalItems = frontendResponse.data?.pagination?.totalItems || 0;
    const receivedItems = frontendResponse.data?.data?.length || 0;
    
    if (receivedItems > 0) {
      console.log(`✅ Successfully received ${receivedItems} items from ${totalItems} total items`);
      console.log(`📈 Coverage: ${((receivedItems / totalItems) * 100).toFixed(1)}%`);
    } else {
      console.log('❌ No items received');
      console.log('🔍 Check the following:');
      console.log('  - API endpoint is correct');
      console.log('  - Branch ID is valid');
      console.log('  - Database has data');
      console.log('  - API is responding');
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
testFrontendInventoryAPI().then(() => {
  console.log('\n🎯 Frontend API test completed!');
  console.log('Check the results above to see if the API call works correctly.');
}).catch(error => {
  console.error('❌ Test failed:', error.message);
});
