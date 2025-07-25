const axios = require('axios');

const API_BASE = 'http://localhost:3001/api/auth';

// Test cases for weak passwords
const weakPasswords = [
  '123',           // Too short
  '123456',        // Common numeric
  'password',      // Common word
  'admin',         // Common admin password
  'qwerty',        // Keyboard pattern
  'abc123',        // Common pattern
  'test',          // Common test password
  'a',             // Single character
  '',              // Empty password (should fail basic validation)
  '12345',         // Short numeric
  'pass',          // Short common word
  'user',          // Common username as password
  'letmein',       // Common password
  'welcome',       // Common password
  'monkey',        // Common password
  'dragon',        // Common password
  'master',        // Common password
  'football',      // Common password
  'baseball',      // Common password
  'shadow'         // Common password
];

async function testWeakPasswordRegistration() {
  console.log('🔍 Testing Weak Password Registration Vulnerability');
  console.log('==================================================\n');

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < weakPasswords.length; i++) {
    const password = weakPasswords[i];
    const username = `testuser${i + 1}`;
    
    try {
      console.log(`Testing password: "${password}" (${password.length} chars)`);
      
      const response = await axios.post(`${API_BASE}/register`, {
        username: username,
        password: password
      });

      if (response.status === 201) {
        console.log(`✅ VULNERABLE: Accepted weak password "${password}"`);
        console.log(`   Username: ${username}`);
        console.log(`   Token: ${response.data.token.substring(0, 50)}...`);
        successCount++;
      } else {
        console.log(`❌ Unexpected response: ${response.status}`);
        failureCount++;
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log(`⚠️  Username already exists, trying next...`);
        continue;
      } else if (error.response && error.response.status === 400) {
        console.log(`❌ Rejected: ${error.response.data.message}`);
        failureCount++;
      } else {
        console.log(`❌ Error: ${error.message}`);
        failureCount++;
      }
    }
    
    console.log('');
  }

  console.log('📊 Test Results Summary');
  console.log('========================');
  console.log(`✅ Weak passwords accepted: ${successCount}`);
  console.log(`❌ Weak passwords rejected: ${failureCount}`);
  console.log(`📈 Vulnerability rate: ${((successCount / (successCount + failureCount)) * 100).toFixed(1)}%`);
  
  if (successCount > 0) {
    console.log('\n🚨 VULNERABILITY CONFIRMED!');
    console.log('The registration endpoint accepts weak passwords without validation.');
    console.log('This violates OWASP API2:2023 - Broken Authentication guidelines.');
  } else {
    console.log('\n✅ No vulnerability detected - all weak passwords were properly rejected.');
  }
}

async function testWeakPasswordLogin() {
  console.log('\n🔍 Testing Weak Password Login');
  console.log('===============================\n');

  // Test logging in with the weak users we created
  const weakUsers = [
    { username: 'weakuser1', password: '123' },
    { username: 'weakuser2', password: '123456' },
    { username: 'weakuser3', password: 'password' },
    { username: 'weakuser4', password: 'a' }
  ];

  for (const user of weakUsers) {
    try {
      console.log(`Testing login for ${user.username} with password "${user.password}"`);
      
      const response = await axios.post(`${API_BASE}/login`, {
        username: user.username,
        password: user.password
      });

      if (response.status === 200) {
        console.log(`✅ SUCCESS: Weak user can log in with weak password`);
        console.log(`   Token: ${response.data.token.substring(0, 50)}...`);
      }
    } catch (error) {
      console.log(`❌ Login failed: ${error.response?.data?.message || error.message}`);
    }
    
    console.log('');
  }
}

async function runTests() {
  try {
    await testWeakPasswordRegistration();
    await testWeakPasswordLogin();
  } catch (error) {
    console.error('Test execution error:', error.message);
  }
}

// Run the tests
runTests(); 