const { test, expect } = require('@playwright/test');

// Test script to verify contract edit form functionality
// This will help identify if the product type and line data are properly loaded

test.describe('Contract Edit Form - Data Loading Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to contracts page
    await page.goto('/contracts');
    
    // Wait for page to load
    await page.waitForSelector('h1:has-text("รายการสัญญา")');
  });

  test('should load product type data when editing contract', async ({ page }) => {
    // Find and click edit button on first contract
    const editButton = page.locator('button:has-text("แก้ไข")').first();
    await editButton.click();
    
    // Wait for edit form to load
    await page.waitForSelector('h2:has-text("แก้ไขสัญญา")');
    
    // Check if product type field is populated
    const productTypeField = page.locator('label:has-text("ชนิดสินค้า") + div input');
    const productTypeValue = await productTypeField.inputValue();
    
    console.log('🔍 Product type field value:', productTypeValue);
    
    // Verify product type is not empty
    expect(productTypeValue).not.toBe('');
    
    // Check if product type dropdown has options
    await productTypeField.click();
    const dropdownOptions = page.locator('.absolute.z-10 .px-3.py-2');
    const optionCount = await dropdownOptions.count();
    
    console.log('🔍 Product type dropdown options count:', optionCount);
    
    // Verify dropdown has options
    expect(optionCount).toBeGreaterThan(0);
  });

  test('should load line/collector data when editing contract', async ({ page }) => {
    // Find and click edit button on first contract
    const editButton = page.locator('button:has-text("แก้ไข")').first();
    await editButton.click();
    
    // Wait for edit form to load
    await page.waitForSelector('h2:has-text("แก้ไขสัญญา")');
    
    // Check if line/collector field is populated
    const lineField = page.locator('label:has-text("สาย") + div input');
    const lineValue = await lineField.inputValue();
    
    console.log('🔍 Line/collector field value:', lineValue);
    
    // Check if line/collector dropdown has options
    await lineField.click();
    const dropdownOptions = page.locator('.absolute.z-10 .px-3.py-2');
    const optionCount = await dropdownOptions.count();
    
    console.log('🔍 Line/collector dropdown options count:', optionCount);
    
    // Verify dropdown has options
    expect(optionCount).toBeGreaterThan(0);
  });

  test('should display correct contract data in edit form', async ({ page }) => {
    // Get contract data from table first
    const contractRow = page.locator('tr').filter({ hasText: 'แก้ไข' }).first();
    const contractNumber = await contractRow.locator('td').nth(0).textContent();
    const customerName = await contractRow.locator('td').nth(1).textContent();
    const productName = await contractRow.locator('td').nth(2).textContent();
    
    console.log('🔍 Contract data from table:', { contractNumber, customerName, productName });
    
    // Click edit button
    const editButton = contractRow.locator('button:has-text("แก้ไข")');
    await editButton.click();
    
    // Wait for edit form to load
    await page.waitForSelector('h2:has-text("แก้ไขสัญญา")');
    
    // Verify contract number is displayed
    const contractNumberDisplay = page.locator('p:has-text("เลขสัญญา:")');
    await expect(contractNumberDisplay).toContainText(contractNumber);
    
    // Check if customer field is populated
    const customerField = page.locator('label:has-text("ค้นหาลูกค้า") + div input');
    const customerValue = await customerField.inputValue();
    
    console.log('🔍 Customer field value:', customerValue);
    
    // Verify customer field is not empty
    expect(customerValue).not.toBe('');
  });
});

console.log('✅ Contract edit form test script created successfully');
console.log('🔍 This script will test:');
console.log('   - Product type data loading');
console.log('   - Line/collector data loading');
console.log('   - Contract data display in edit form');
console.log('');
console.log('📋 To run this test:');
console.log('   1. Make sure you have a contract in the system');
console.log('   2. Run: npx playwright test test_contract_edit_fixed.js');
console.log('   3. Check console logs for detailed debugging info');
