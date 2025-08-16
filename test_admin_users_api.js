// Test script for admin-users API
const axios = require('axios');

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

// Run the test
testAdminUsersAPI(); 