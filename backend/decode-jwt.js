const jwt = require('jsonwebtoken');

// JWT secret (same as in middleware/auth.js)
const JWT_SECRET = 'your-super-secret-jwt-key-for-security-testing-2024';

function decodeToken(token) {
  try {
    // Decode without verification (for debugging)
    const decoded = jwt.decode(token);
    console.log('🔍 JWT Token Decoded (without verification):');
    console.log(JSON.stringify(decoded, null, 2));
    console.log('');

    // Verify and decode (with secret)
    const verified = jwt.verify(token, JWT_SECRET);
    console.log('✅ JWT Token Verified:');
    console.log(JSON.stringify(verified, null, 2));
    console.log('');

    // Additional info
    const now = Math.floor(Date.now() / 1000);
    const isExpired = verified.exp < now;
    const timeUntilExpiry = verified.exp - now;

    console.log('📊 Token Information:');
    console.log(`- Issued at: ${new Date(verified.iat * 1000).toISOString()}`);
    console.log(`- Expires at: ${new Date(verified.exp * 1000).toISOString()}`);
    console.log(`- Is expired: ${isExpired}`);
    if (!isExpired) {
      console.log(`- Time until expiry: ${Math.floor(timeUntilExpiry / 60)} minutes ${timeUntilExpiry % 60} seconds`);
    }
    console.log(`- Username: ${verified.username}`);
    console.log(`- Role: ${verified.role}`);

  } catch (error) {
    console.error('❌ Error decoding token:', error.message);
  }
}

// Get token from command line argument
const token = process.argv[2];

if (!token) {
  console.log('Usage: node decode-jwt.js <jwt_token>');
  console.log('');
  console.log('Example:');
  console.log('node decode-jwt.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  process.exit(1);
}

decodeToken(token); 