// Test script for missing customer data
// Run this in browser console

console.log('🔍 Testing Missing Customer Data...\n');

async function testMissingData() {
  const contractId = 9;
  
  // Test API response
  console.log('1. Testing API response for missing data...');
  try {
    const response = await fetch(`https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}?_t=${Date.now()}`);
    
    if (response.ok) {
      const data = await response.json();
      const contract = data.data;
      
      console.log('📋 Customer Data:');
      console.log('   - ID:', contract.customerId);
      console.log('   - Name:', contract.customerName);
      console.log('   - Surname:', contract.customerSurname);
      console.log('   - Age:', contract.customerAge);
      console.log('   - Phone:', contract.customerPhone1);
      console.log('   - Email:', contract.customerEmail);
      console.log('   - ID Card:', contract.customerIdCard);
      console.log('   - Nickname:', contract.customerNickname);
      
      console.log('\n📋 Guarantor Data:');
      console.log('   - ID:', contract.guarantorId);
      console.log('   - Name:', contract.guarantorName);
      console.log('   - Surname:', contract.guarantorSurname);
      console.log('   - Age:', contract.guarantorAge);
      console.log('   - Phone:', contract.guarantorPhone1);
      console.log('   - Email:', contract.guarantorEmail);
      console.log('   - ID Card:', contract.guarantorIdCard);
      console.log('   - Nickname:', contract.guarantorNickname);
      
      // Test data mapping
      console.log('\n2. Testing data mapping...');
      const formData = {
        customerDetails: {
          title: contract.customerDetails?.title || contract.customerTitle || 'นาย',
          name: contract.customerName || contract.customerFullName || '',
          surname: contract.customerSurname || '',
          nickname: contract.customerDetails?.nickname || contract.customerNickname || '',
          age: contract.customerDetails?.age || contract.customerAge || '',
          idCard: contract.customerDetails?.idCard || contract.customerIdCard || '',
          phone1: contract.customerDetails?.phone1 || contract.customerPhone1 || contract.customerPhone || '',
          email: contract.customerDetails?.email || contract.customerEmail || ''
        },
        guarantorDetails: {
          title: contract.guarantorDetails?.title || contract.guarantorTitle || 'นาย',
          name: contract.guarantorDetails?.name || contract.guarantorName || '',
          surname: contract.guarantorDetails?.surname || contract.guarantorSurname || '',
          nickname: contract.guarantorDetails?.nickname || contract.guarantorNickname || '',
          age: contract.guarantorDetails?.age || contract.guarantorAge || '',
          idCard: contract.guarantorDetails?.idCard || contract.guarantorIdCard || '',
          phone1: contract.guarantorDetails?.phone1 || contract.guarantorPhone1 || '',
          email: contract.guarantorDetails?.email || contract.guarantorEmail || ''
        }
      };
      
      console.log('✅ Mapped Customer Details:');
      console.log('   - Title:', formData.customerDetails.title);
      console.log('   - Name:', formData.customerDetails.name);
      console.log('   - Surname:', formData.customerDetails.surname);
      console.log('   - Nickname:', formData.customerDetails.nickname);
      console.log('   - Age:', formData.customerDetails.age);
      console.log('   - ID Card:', formData.customerDetails.idCard);
      console.log('   - Phone:', formData.customerDetails.phone1);
      console.log('   - Email:', formData.customerDetails.email);
      
      console.log('\n✅ Mapped Guarantor Details:');
      console.log('   - Title:', formData.guarantorDetails.title);
      console.log('   - Name:', formData.guarantorDetails.name);
      console.log('   - Surname:', formData.guarantorDetails.surname);
      console.log('   - Nickname:', formData.guarantorDetails.nickname);
      console.log('   - Age:', formData.guarantorDetails.age);
      console.log('   - ID Card:', formData.guarantorDetails.idCard);
      console.log('   - Phone:', formData.guarantorDetails.phone1);
      console.log('   - Email:', formData.guarantorDetails.email);
      
      // Check for null values
      console.log('\n3. Checking for null values...');
      const nullFields = [];
      
      if (contract.customerIdCard === null) nullFields.push('customerIdCard');
      if (contract.customerNickname === null) nullFields.push('customerNickname');
      if (contract.guarantorIdCard === null) nullFields.push('guarantorIdCard');
      if (contract.guarantorNickname === null) nullFields.push('guarantorNickname');
      
      if (nullFields.length > 0) {
        console.log('⚠️ Null fields found:', nullFields);
        console.log('💡 These fields are null in the database and will show as empty in the form');
      } else {
        console.log('✅ No null fields found');
      }
      
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run test
testMissingData(); 