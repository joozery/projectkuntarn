// Test CORS fix for the new API
const API_BASE_URL = 'https://72-60-43-104.sslip.io/kuntarn/api';

// Test 1: Simple GET request
async function testSimpleRequest() {
  try {
    console.log('🔍 Testing simple GET request...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Simple request successful:', data);
  } catch (error) {
    console.error('❌ Simple request failed:', error);
  }
}

// Test 2: GET request with CORS headers
async function testCORSRequest() {
  try {
    console.log('🔍 Testing CORS request...');
    const response = await fetch(`${API_BASE_URL}/branches`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      },
      mode: 'cors'
    });
    const data = await response.json();
    console.log('✅ CORS request successful:', data);
  } catch (error) {
    console.error('❌ CORS request failed:', error);
  }
}

// Test 3: Using XMLHttpRequest (like the error shows)
function testXMLHttpRequest() {
  console.log('🔍 Testing XMLHttpRequest...');
  const xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('✅ XMLHttpRequest successful:', xhr.responseText);
      } else {
        console.error('❌ XMLHttpRequest failed:', xhr.status, xhr.statusText);
      }
    }
  };
  
  xhr.onerror = function() {
    console.error('❌ XMLHttpRequest network error');
  };
  
  xhr.open('GET', `${API_BASE_URL}/branches`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
}

// Test 4: Check if CORS headers are present
async function checkCORSHeaders() {
  try {
    console.log('🔍 Checking CORS headers...');
    const response = await fetch(`${API_BASE_URL}/branches`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5174',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ OPTIONS request successful');
    console.log('📋 Response headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // Check specific CORS headers
    const corsHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Credentials'
    ];
    
    corsHeaders.forEach(header => {
      const value = response.headers.get(header);
      console.log(`  ${header}: ${value || 'NOT SET'}`);
    });
    
  } catch (error) {
    console.error('❌ CORS headers check failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting CORS tests...\n');
  
  await testSimpleRequest();
  console.log('');
  
  await testCORSRequest();
  console.log('');
  
  testXMLHttpRequest();
  console.log('');
  
  await checkCORSHeaders();
  console.log('\n🏁 All tests completed!');
}

// Run tests when file is executed
if (typeof window === 'undefined') {
  // Node.js environment
  runAllTests();
} else {
  // Browser environment
  console.log('🌐 Running in browser - use runAllTests() to start tests');
  window.runAllTests = runAllTests;
}
