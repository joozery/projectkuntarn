// Test script for debugging contract edit
// Run this in browser console

console.log('🔍 Testing Contract Edit Debug...\n');

async function testContractEditDebug() {
  const contractId = 9;
  
  // Test 1: Test API call directly
  console.log('1. Testing API call directly...');
  try {
    const response = await fetch(`https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}`);
    console.log('✅ API Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response data:', data);
      
      if (data.success && data.data) {
        const contract = data.data;
        console.log('📋 Contract details:');
        console.log('   - ID:', contract.id);
        console.log('   - Contract Number:', contract.contractNumber);
        console.log('   - Customer Name:', contract.customerName);
        console.log('   - Product Name:', contract.productName);
        console.log('   - Total Amount:', contract.totalAmount);
        console.log('   - Customer Details:', contract.customerDetails);
        console.log('   - Product Details:', contract.productDetails);
        console.log('   - Plan:', contract.plan);
      }
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 2: Test installmentsService
  console.log('\n2. Testing installmentsService...');
  try {
    // Simulate the service call
    const response = await fetch(`https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Service response:', data);
      
      // Simulate the response handling
      let contract;
      if (data.data?.success) {
        contract = data.data.data;
      } else if (data.data) {
        contract = data.data;
      } else {
        contract = data;
      }
      
      console.log('✅ Extracted contract:', contract);
      
      // Test data mapping
      const formData = {
        contractNumber: contract.contractNumber || '',
        customerDetails: {
          name: contract.customerName || contract.customerFullName || '',
          surname: contract.customerSurname || ''
        },
        productDetails: {
          name: contract.productName || '',
          price: contract.productPrice || contract.totalAmount || ''
        },
        totalAmount: contract.totalAmount || 0
      };
      
      console.log('✅ Mapped form data:', formData);
    }
  } catch (error) {
    console.log('❌ Service error:', error.message);
  }

  // Test 3: Test React state simulation
  console.log('\n3. Testing React state simulation...');
  const mockContractForm = {
    contractNumber: '',
    customerDetails: { name: '', surname: '' },
    productDetails: { name: '', price: '' },
    totalAmount: 0
  };
  
  console.log('📋 Initial state:', mockContractForm);
  
  // Simulate setState
  const newFormData = {
    contractNumber: 'CT250729533',
    customerDetails: {
      name: 'สาวลินนา',
      surname: 'กล่อมเกลี้ยง'
    },
    productDetails: {
      name: 'เตียงนอน 5 ฟุต',
      price: '1200.00'
    },
    totalAmount: 1200
  };
  
  console.log('📋 New form data:', newFormData);
  console.log('✅ State should update to:', newFormData);
}

// Run test
testContractEditDebug(); 