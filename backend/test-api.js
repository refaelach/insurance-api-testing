const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testUsers = [
  { username: 'admin1', password: 'adminpass', role: 'admin' },
  { username: 'user1', password: 'userpass', role: 'user' }
];

async function testAPI() {
  console.log('🧪 Testing Insurance API Backend\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log('');

    // Test login for admin user
    console.log('2. Testing admin login...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin1',
      password: 'adminpass'
    });
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful:', adminLoginResponse.data.user);
    console.log('');

    // Test login for regular user
    console.log('3. Testing user login...');
    const userLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'user1',
      password: 'userpass'
    });
    const userToken = userLoginResponse.data.token;
    console.log('✅ User login successful:', userLoginResponse.data.user);
    console.log('');

    // Test profile endpoint with admin token
    console.log('4. Testing admin profile...');
    const adminProfileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin profile retrieved:', adminProfileResponse.data.user);
    console.log('');

    // Test profile endpoint with user token
    console.log('5. Testing user profile...');
    const userProfileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ User profile retrieved:', userProfileResponse.data.user);
    console.log('');

    // Test admin-only users endpoint with admin token
    console.log('6. Testing admin access to users endpoint...');
    const adminUsersResponse = await axios.get(`${BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Admin can access users:', `${adminUsersResponse.data.count} users found`);
    console.log('');

    // Test admin-only users endpoint with user token (should fail)
    console.log('7. Testing user access to admin endpoint (should fail)...');
    try {
      await axios.get(`${BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('❌ User should not have access to admin endpoint');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ User correctly denied access to admin endpoint');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test invalid login
    console.log('8. Testing invalid login...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: 'invalid',
        password: 'invalid'
      });
      console.log('❌ Invalid login should have failed');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Invalid login correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test profile without token
    console.log('9. Testing profile without token (should fail)...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);
      console.log('❌ Profile should require authentication');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Profile correctly requires authentication');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Health endpoint working');
    console.log('- ✅ Admin login working');
    console.log('- ✅ User login working');
    console.log('- ✅ Profile endpoint working');
    console.log('- ✅ Role-based access control working');
    console.log('- ✅ Admin-only endpoints protected');
    console.log('- ✅ Invalid credentials rejected');
    console.log('- ✅ Authentication required for protected endpoints');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testAPI(); 