// Test script to verify the fix for admin users API
import axios from 'axios';

const API_BASE_URL = 'https://backendkuntarn-e0ddf979d118.herokuapp.com/api';

// Simulate the adminUsersService.getAll function
async function simulateAdminUsersService() {
  try {
    console.log('🧪 Testing AdminUsersService.getAll simulation...');
    
    const response = await axios.get(`${API_BASE_URL}/admin-users`);
    
    console.log('📡 Raw API response:', response.data);
    
    // Simulate the fixed service logic
    if (response.data.success && response.data.data) {
      console.log('✅ API response format is correct');
      const result = { data: response.data.data, total: response.data.total };
      console.log('📊 Service result:', result);
      console.log('👥 Users found:', result.data.length);
      
      result.data.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.full_name} (${user.username}) - ${user.role}`);
      });
      
      return result;
    } else {
      console.log('❌ API response format error');
      return { data: [], total: 0 };
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { data: [], total: 0 };
  }
}

// Test frontend component logic
function simulateFrontendComponent(serviceResult) {
  console.log('\n🧪 Testing Frontend Component logic...');
  
  const usersData = serviceResult.data || [];
  console.log('📊 Users data for component:', usersData);
  console.log('📈 Total users:', usersData.length);
  
  if (usersData.length > 0) {
    console.log('✅ Component should display users');
    console.log('📋 Users to display:');
    usersData.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.full_name} (${user.username})`);
      console.log(`      Role: ${user.role}`);
      console.log(`      Active: ${user.is_active ? 'Yes' : 'No'}`);
      console.log(`      Email: ${user.email}`);
    });
  } else {
    console.log('❌ Component should show "No users found"');
  }
}

// Run the test
async function runTest() {
  console.log('🚀 Testing Admin Users Fix...\n');
  
  const serviceResult = await simulateAdminUsersService();
  simulateFrontendComponent(serviceResult);
  
  console.log('\n🏁 Test completed!');
  console.log('💡 If you see users above, the fix should work!');
}

runTest(); 