// Test script to debug admin users API issue
import axios from 'axios';

const API_BASE_URL = 'https://backendkuntarn-e0ddf979d118.herokuapp.com/api';

async function testAdminUsersAPI() {
  try {
    console.log('🧪 Testing Admin Users API...');
    console.log('🔗 API URL:', `${API_BASE_URL}/admin-users`);
    
    const response = await axios.get(`${API_BASE_URL}/admin-users`);
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('🎉 API call successful!');
      console.log(`👥 Found ${response.data.total} users`);
      
      if (response.data.data && response.data.data.length > 0) {
        const user = response.data.data[0];
        console.log('👤 First user:');
        console.log(`   - Username: ${user.username}`);
        console.log(`   - Full Name: ${user.full_name}`);
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Active: ${user.is_active ? 'Yes' : 'No'}`);
        console.log(`   - Permissions: ${user.permissions?.length || 0} permissions`);
      }
    } else {
      console.log('❌ API call failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('📡 Error response:', error.response.data);
      console.error('📊 Status:', error.response.status);
    }
  }
}

// Test frontend API call simulation
async function testFrontendAPI() {
  try {
    console.log('\n🧪 Testing Frontend API call simulation...');
    
    // Simulate the exact call that frontend makes
    const response = await axios.get(`${API_BASE_URL}/admin-users`, {
      params: {} // No branch filter
    });
    
    console.log('✅ Frontend API call successful');
    console.log('📊 Response structure:', {
      success: response.data.success,
      hasData: !!response.data.data,
      dataLength: response.data.data?.length || 0,
      total: response.data.total
    });
    
    // Check if data is in the expected format
    if (response.data.data && Array.isArray(response.data.data)) {
      console.log('✅ Data is in correct format (array)');
      console.log('📋 Users found:', response.data.data.length);
      
      response.data.data.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.full_name} (${user.username}) - ${user.role}`);
      });
    } else {
      console.log('❌ Data is not in expected format');
      console.log('📊 Actual data type:', typeof response.data.data);
    }
    
  } catch (error) {
    console.error('❌ Frontend API call failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Admin Users API Debug Tests...\n');
  
  await testAdminUsersAPI();
  await testFrontendAPI();
  
  console.log('\n🏁 Tests completed!');
}

runTests(); 