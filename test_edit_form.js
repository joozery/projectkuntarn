// Test script for ContractEditForm
// Run this in browser console to test the form

console.log('🔍 Testing ContractEditForm...');

// Simulate clicking edit button on first contract
const testEditForm = () => {
  // Find the first edit button
  const editButtons = document.querySelectorAll('button');
  const editButton = Array.from(editButtons).find(btn => 
    btn.textContent.includes('แก้ไข')
  );
  
  if (editButton) {
    console.log('🔍 Found edit button, clicking...');
    editButton.click();
  } else {
    console.log('❌ No edit button found');
  }
};

// Check if form is loaded
const checkFormLoaded = () => {
  const form = document.querySelector('form');
  if (form) {
    console.log('✅ Form found');
    
    // Check for specific fields
    const contractNumber = document.querySelector('input[placeholder*="เลขสัญญา"]');
    const customerName = document.querySelector('input[placeholder*="ชื่อ-สกุล"]');
    
    console.log('Contract Number field:', contractNumber?.value || 'Not found');
    console.log('Customer Name field:', customerName?.value || 'Not found');
    
    return true;
  } else {
    console.log('❌ Form not found');
    return false;
  }
};

// Run tests
setTimeout(() => {
  testEditForm();
  
  setTimeout(() => {
    checkFormLoaded();
  }, 2000);
}, 1000);

console.log('🔍 Test script loaded. Check console for results.'); 