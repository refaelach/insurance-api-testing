const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testVulnerabilities() {
  console.log('🧪 Testing Vulnerable Endpoints for Security Testing\n');

  try {
    // Test 1: JWT Signature Bypass (API2:2023)
    console.log('1. Testing JWT Signature Bypass Vulnerability...');
    console.log('   Endpoint: GET /api/customers/me');
    console.log('   Vulnerability: Uses jwt.decode() instead of jwt.verify()');
    
    // Get a valid token first
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'user1',
      password: 'userpass'
    });
    const validToken = loginResponse.data.token;
    
    // Test with valid token
    const customerResponse = await axios.get(`${BASE_URL}/customers/me`, {
      headers: { Authorization: `Bearer ${validToken}` }
    });
    console.log('   ✅ Valid token works:', customerResponse.data.customer.username);
    
    // Test with tampered token (modify payload to change role to admin)
    const tamperedToken = validToken.replace('user1', 'admin1').replace('user', 'admin');
    try {
      const tamperedResponse = await axios.get(`${BASE_URL}/customers/me`, {
        headers: { Authorization: `Bearer ${tamperedToken}` }
      });
      console.log('   🚨 VULNERABLE: Tampered token works!');
      console.log('   ✅ Tampered response:', tamperedResponse.data.customer);
    } catch (error) {
      console.log('   ❌ Tampered token rejected (unexpected)');
    }
    console.log('');

    // Test 2: Expired Token Acceptance (API2:2023)
    console.log('2. Testing Expired Token Acceptance Vulnerability...');
    console.log('   Endpoint: GET /api/accounts/overview');
    console.log('   Vulnerability: Uses ignoreExpiration: true');
    
    // Create an expired token by modifying the expiration time
    const expiredToken = validToken.replace('exp', 'expired');
    try {
      const expiredResponse = await axios.get(`${BASE_URL}/accounts/overview`, {
        headers: { Authorization: `Bearer ${expiredToken}` }
      });
      console.log('   🚨 VULNERABLE: Expired token works!');
      console.log('   ✅ Expired response:', expiredResponse.data.account.accountType);
    } catch (error) {
      console.log('   ❌ Expired token rejected (unexpected)');
    }
    console.log('');

    // Test 3: Missing Authentication (API1:2023)
    console.log('3. Testing Missing Authentication Vulnerability...');
    console.log('   Endpoint: GET /api/policies/:policyId');
    console.log('   Vulnerability: No authentication required for sensitive data');
    
    try {
      const policyResponse = await axios.get(`${BASE_URL}/policies/auto-1234`);
      console.log('   🚨 VULNERABLE: No token required!');
      console.log('   ✅ Sensitive data exposed:', {
        holderName: policyResponse.data.policy.holderName,
        email: policyResponse.data.policy.email,
        ssn: policyResponse.data.policy.socialSecurityLast4,
        address: policyResponse.data.policy.address
      });
    } catch (error) {
      console.log('   ❌ Authentication required (unexpected)');
    }
    console.log('');

    // Test 4: Test with different policy IDs
    console.log('4. Testing Multiple Policy IDs (No Auth)...');
    const policyIds = ['auto-1234', 'home-5678', 'life-9012'];
    
    for (const policyId of policyIds) {
      try {
        const response = await axios.get(`${BASE_URL}/policies/${policyId}`);
        console.log(`   ✅ ${policyId}: ${response.data.policy.holderName} - ${response.data.policy.email}`);
      } catch (error) {
        console.log(`   ❌ ${policyId}: Failed`);
      }
    }
    console.log('');

    console.log('🎉 Vulnerability Testing Complete!');
    console.log('\n📋 Vulnerability Summary:');
    console.log('- ✅ JWT Signature Bypass: Tampered tokens accepted');
    console.log('- ✅ Expired Token Acceptance: Expired tokens work');
    console.log('- ✅ Missing Authentication: Sensitive PII exposed');
    console.log('- ✅ Multiple Policy Access: All policies accessible without auth');
    console.log('\n🚨 All endpoints are intentionally vulnerable for security testing!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testVulnerabilities(); 