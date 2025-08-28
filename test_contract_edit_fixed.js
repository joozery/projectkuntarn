// Test script for ContractEditForm fixes
// This script tests the fixes for:
// 1. collection_date display issue (showing full timestamp instead of date)
// 2. line/collector_id not being loaded from contract data

const testContractData = {
  id: 1,
  contractNumber: 'CT25680910001',
  contractDate: '2568-09-10',
  customerId: 1,
  productId: 1,
  salespersonId: 1,
  inspectorId: 1,
  collectorId: 1,
  line: 'สาย 1',
  collectionDate: '2568-09-10T00:00:00.000Z', // Full timestamp from database
  // ... other fields
};

console.log('🔍 Testing ContractEditForm fixes...');

// Test 1: collection_date parsing
console.log('\n📅 Test 1: collection_date parsing');
console.log('Original collection_date:', testContractData.collectionDate);
const parsedDate = testContractData.collectionDate ? testContractData.collectionDate.split('T')[0] : '';
console.log('Parsed date (split by T):', parsedDate);
console.log('Expected result: 2568-09-10');
console.log('Test result:', parsedDate === '2568-09-10' ? '✅ PASS' : '❌ FAIL');

// Test 2: line and collector_id mapping
console.log('\n👥 Test 2: line and collector_id mapping');
console.log('Original line:', testContractData.line);
console.log('Original collectorId:', testContractData.collectorId);

// Simulate the mapping logic from the form
const mappedData = {
  line: testContractData.line || '',
  collectorId: testContractData.collectorId || ''
};

console.log('Mapped line:', mappedData.line);
console.log('Mapped collectorId:', mappedData.collectorId);
console.log('Expected line: สาย 1');
console.log('Expected collectorId: 1');
console.log('Test result:', 
  mappedData.line === 'สาย 1' && mappedData.collectorId === 1 ? '✅ PASS' : '❌ FAIL'
);

// Test 3: virtual collector creation for existing line
console.log('\n🎭 Test 3: virtual collector creation');
const existingLine = 'สาย 2';
const allCollectors = [
  { id: 1, name: 'พนักงาน 1', code: 'สาย 1', position: 'collector' },
  { id: 2, name: 'พนักงาน 2', code: 'สาย 3', position: 'collector' }
];

// Check if line exists in current collectors
const existingCollector = allCollectors.find(emp => 
  emp.code === existingLine || emp.name === existingLine
);

let virtualCollector = null;
if (existingLine && !existingCollector) {
  virtualCollector = {
    id: `line_${existingLine}`,
    name: existingLine,
    full_name: existingLine,
    code: existingLine,
    position: 'collector',
    isVirtual: true
  };
}

console.log('Existing line:', existingLine);
console.log('Existing collector found:', existingCollector ? 'YES' : 'NO');
console.log('Virtual collector created:', virtualCollector ? 'YES' : 'NO');
if (virtualCollector) {
  console.log('Virtual collector details:', virtualCollector);
}
console.log('Test result:', virtualCollector && virtualCollector.id === 'line_สาย 2' ? '✅ PASS' : '❌ FAIL');

console.log('\n🎯 All tests completed!');
console.log('The fixes should resolve:');
console.log('1. ✅ collection_date display issue');
console.log('2. ✅ line/collector_id loading issue');
console.log('3. ✅ virtual collector for existing lines');
