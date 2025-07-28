// Test script for contract edit functionality
// Run this in browser console

console.log('🔍 Testing Contract Edit Functionality...\n');

async function testContractEdit() {
  const contractId = 9; // หรือ contract ID อื่นที่มีอยู่
  
  // Test 1: Test installmentsService.getById
  console.log('1. Testing installmentsService.getById...');
  try {
    // Simulate the service call
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
        console.log('   - Branch ID:', contract.branchId);
        console.log('   - Customer ID:', contract.customerId);
        console.log('   - Product ID:', contract.productId);
      }
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
      const errorData = await response.json();
      console.log('❌ Error details:', errorData);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 2: Test ContractEditForm props
  console.log('\n2. Testing ContractEditForm props...');
  console.log('🔍 Expected props:', {
    contractId: contractId,
    selectedBranch: 1,
    onBack: 'function',
    onSuccess: 'function'
  });

  // Test 3: Test data mapping
  console.log('\n3. Testing data mapping...');
  try {
    const response = await fetch(`https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/${contractId}`);
    if (response.ok) {
      const data = await response.json();
      const contract = data.data;
      
      // Simulate the mapping logic
      const formData = {
        contractNumber: contract.contractNumber || '',
        contractDate: contract.contractDate || contract.startDate || '',
        customerId: contract.customerId || '',
        customerDetails: {
          title: contract.customerDetails?.title || contract.customerTitle || 'นาย',
          name: contract.customerName || contract.customerFullName || '',
          surname: contract.customerSurname || '',
          phone1: contract.customerDetails?.phone1 || contract.customerPhone1 || contract.customerPhone || ''
        },
        productId: contract.productId || '',
        productDetails: {
          name: contract.productName || '',
          price: contract.productPrice || contract.totalAmount || ''
        },
        totalAmount: contract.totalAmount || 0
      };
      
      console.log('✅ Mapped form data:', formData);
      console.log('✅ Customer name:', formData.customerDetails.name);
      console.log('✅ Product name:', formData.productDetails.name);
      console.log('✅ Total amount:', formData.totalAmount);
    }
  } catch (error) {
    console.log('❌ Mapping test error:', error.message);
  }

  // Test 4: Test all available contracts
  console.log('\n4. Testing all available contracts...');
  try {
    const response = await fetch('https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments');
    if (response.ok) {
      const data = await response.json();
      const contracts = data.data || [];
      console.log('✅ Available contracts:', contracts.length);
      
      contracts.forEach(contract => {
        console.log(`   ID ${contract.id}: ${contract.contractNumber} (${contract.customerName})`);
      });
    }
  } catch (error) {
    console.log('❌ Contracts list error:', error.message);
  }
}

// Run test
testContractEdit(); 