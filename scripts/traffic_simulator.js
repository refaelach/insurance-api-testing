const axios = require('axios');
const crypto = require('crypto');

// Configuration
const BASE_URL = process.env.TRAFFIC_BASE_URL || 'http://ves-io-0a931dd2-673d-400a-9b4c-4f36313085d9.crt.ac.vh.volterra.us';
const SIMULATION_DURATION = parseInt(process.env.SIMULATION_DURATION) || 5; // minutes
const REQUEST_INTERVAL = parseInt(process.env.REQUEST_INTERVAL) || 15000; // 15 seconds
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS) || 8;
const MAX_REQUESTS_PER_USER = parseInt(process.env.MAX_REQUESTS_PER_USER) || 30;

// Realistic user agents
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 14; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Safari/605.1.15'
];

// Realistic IP addresses (simulating different users)
const IP_ADDRESSES = [
    '192.168.1.100', '192.168.1.101', '192.168.1.102', '192.168.1.103', '192.168.1.104',
    '10.0.0.50', '10.0.0.51', '10.0.0.52', '10.0.0.53', '10.0.0.54',
    '172.16.0.10', '172.16.0.11', '172.16.0.12', '172.16.0.13', '172.16.0.14',
    '203.0.113.1', '203.0.113.2', '203.0.113.3', '203.0.113.4', '203.0.113.5'
];

// Real user accounts from the actual system
const REAL_USER_ACCOUNTS = [
    { username: 'admin1', password: 'adminpass', role: 'admin' },
    { username: 'admin2', password: 'admin123', role: 'admin' },
    { username: 'user1', password: 'userpass', role: 'user' },
    { username: 'user2', password: 'user123', role: 'user' },
    { username: 'john.smith', password: 'password123', role: 'user' },
    { username: 'sarah.johnson', password: 'sarah2024', role: 'user' },
    { username: 'admin.user', password: 'admin@insurance', role: 'admin' },
    { username: 'mike.davis', password: 'mike123', role: 'user' },
    { username: 'emily.wilson', password: 'emily2024', role: 'user' },
    { username: 'weakuser1', password: '123', role: 'user' },
    { username: 'weakuser2', password: '123456', role: 'user' },
    { username: 'weakuser3', password: 'password', role: 'user' },
    { username: 'testuser1', password: '123', role: 'user' },
    { username: 'testuser2', password: '123456', role: 'user' },
    { username: 'testuser3', password: 'password', role: 'user' }
];

// JWT Secret from the actual system
const JWT_SECRET = 'your-super-secret-jwt-key-for-security-testing-2024';

// Realistic API endpoints for discovery - treating all as secured except public ones
const ENDPOINTS = [
    // Public endpoints (no auth required)
    { method: 'GET', url: '/', weight: 25, requiresAuth: false, description: 'Frontend homepage' },
    { method: 'GET', url: '/login', weight: 15, requiresAuth: false, description: 'Login page' },

    { method: 'GET', url: '/api/health', weight: 8, requiresAuth: false, description: 'Health check' },
    { method: 'POST', url: '/api/auth/login', weight: 20, requiresAuth: false, description: 'User login', data: () => ({
        username: REAL_USER_ACCOUNTS[Math.floor(Math.random() * REAL_USER_ACCOUNTS.length)].username,
        password: REAL_USER_ACCOUNTS[Math.floor(Math.random() * REAL_USER_ACCOUNTS.length)].password
    })},
    { method: 'POST', url: '/api/auth/register', weight: 30, requiresAuth: false, description: 'User registration', data: () => ({
        username: `trafficuser${Date.now()}`,
        password: 'password123'
    })},
    { method: 'GET', url: '/api/policies/categories', weight: 12, requiresAuth: false, description: 'Policy categories' },
    
    // Secured endpoints (require authentication) - Frontend routes
    { method: 'GET', url: '/dashboard', weight: 30, requiresAuth: true, description: 'User dashboard' },
    { method: 'GET', url: '/profile', weight: 25, requiresAuth: true, description: 'User profile' },
    { method: 'GET', url: '/policies', weight: 35, requiresAuth: true, description: 'Policies page' },
    { method: 'GET', url: '/claims', weight: 20, requiresAuth: true, description: 'Claims page' },
    { method: 'GET', url: '/documents', weight: 15, requiresAuth: true, description: 'Documents page' },
    { method: 'GET', url: '/support', weight: 10, requiresAuth: true, description: 'Support page' },
    { method: 'GET', url: '/admin', weight: 8, requiresAuth: true, adminOnly: true, description: 'Admin panel' },
    
    // Secured API endpoints (require authentication)
    { method: 'GET', url: '/api/auth/profile', weight: 30, requiresAuth: true, description: 'User profile data' },
    { method: 'GET', url: '/api/user/notifications', weight: 25, requiresAuth: true, description: 'User notifications' },
    { method: 'POST', url: '/api/claims/estimate', weight: 18, requiresAuth: true, description: 'Submit claim estimate', data: () => ({
        policyId: `POL-${Math.floor(Math.random() * 10000)}`,
        incidentType: ['collision', 'theft', 'vandalism', 'weather'][Math.floor(Math.random() * 4)],
        estimatedDamage: Math.floor(Math.random() * 25000) + 500
    })},
    { method: 'GET', url: '/api/coverage/details', weight: 20, requiresAuth: true, description: 'Coverage details' },
    
    // Admin-only endpoints (require admin authentication)
    { method: 'GET', url: '/api/admin/stats', weight: 5, requiresAuth: true, adminOnly: true, description: 'Admin statistics' },
    { method: 'GET', url: '/api/admin/settings', weight: 5, requiresAuth: true, adminOnly: true, description: 'Admin settings' },
    { method: 'PUT', url: '/api/admin/settings', weight: 25, requiresAuth: true, adminOnly: true, description: 'Update admin settings', data: () => ({
        maintenance: Math.random() > 0.5,
        debug: Math.random() > 0.5
    })},
    { method: 'GET', url: '/api/admin/reports', weight: 8, requiresAuth: true, adminOnly: true, description: 'Admin reports' },
    { method: 'DELETE', url: '/api/admin/reports', weight: 3, requiresAuth: true, adminOnly: true, description: 'Clear admin reports' },
    
    // Additional realistic API endpoints for discovery
    { method: 'GET', url: '/api/customers/me', weight: 15, requiresAuth: true, description: 'Customer profile' },
    { method: 'GET', url: '/api/accounts/overview', weight: 15, requiresAuth: true, description: 'Account overview' },
    { method: 'GET', url: '/api/policies/mine', weight: 25, requiresAuth: true, description: 'User policies' },
    { method: 'GET', url: '/api/policies/search', weight: 20, requiresAuth: true, description: 'Search policies', query: () => ({
        query: '',
        page: 1,
        per_page: Math.floor(Math.random() * 50) + 10
    })},
    { method: 'POST', url: '/api/documents/preview', weight: 8, requiresAuth: true, description: 'Preview document', data: () => ({
        url: 'https://example.com/document.pdf'
    })},
    { method: 'POST', url: '/api/support/contact', weight: 10, requiresAuth: true, description: 'Contact support', data: () => ({
        name: 'Test User',
        email: 'user@example.com',
        message: 'I need help with my policy'
    })}
];

// Statistics tracking
let stats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    startTime: new Date(),
    endpoints: {},
    userAgents: {},
    ipAddresses: {},
    responseTimes: [],
    authenticatedUsers: new Set(),
    loginAttempts: 0,
    successfulLogins: 0,
    authRequiredRequests: 0,
    publicRequests: 0
};

// User session management
const userSessions = new Map();

// Generate JWT token for authenticated requests (using actual system secret)
function generateJWT(user) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        username: user.username,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900 // 15 minutes like the real system
    };
    
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Login user and get real JWT token
async function loginUser(user) {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: user.username,
            password: user.password
        }, {
            headers: {
                'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
                'X-Forwarded-For': IP_ADDRESSES[Math.floor(Math.random() * IP_ADDRESSES.length)],
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        if (response.data && response.data.token) {
            stats.successfulLogins++;
            stats.authenticatedUsers.add(user.username);
            userSessions.set(user.username, {
                token: response.data.token,
                user: response.data.user,
                loginTime: new Date()
            });
            console.log(`🔐 Login successful: ${user.username} (${user.role})`);
            return response.data.token;
        }
    } catch (error) {
        console.log(`❌ Login failed: ${user.username} - ${error.response?.status || 'NETWORK_ERROR'}`);
    }
    return null;
}

// Check if JWT token is expired
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp < currentTime;
    } catch (error) {
        return true; // If we can't parse the token, consider it expired
    }
}

// Refresh user session if token is expired
async function refreshUserSession(user) {
    const session = userSessions.get(user.username);
    if (session && session.token && isTokenExpired(session.token)) {
        console.log(`🔄 Token expired for ${user.username}, clearing session and retrying login...`);
        userSessions.delete(user.username);
        stats.authenticatedUsers.delete(user.username);
        return await loginUser(user);
    }
    return session ? session.token : null;
}

// Get random endpoint based on weights
function getRandomEndpoint(user) {
    // Filter out login/register endpoints if user is already authenticated
    let availableEndpoints = ENDPOINTS;
    
    if (user) {
        const session = userSessions.get(user.username);
        if (session && session.token) {
            // User is authenticated, exclude login/register endpoints
            availableEndpoints = ENDPOINTS.filter(ep => 
                !ep.url.includes('/auth/login') && 
                !ep.url.includes('/api/auth/register')
            );
            
        }
    }
    
    const totalWeight = availableEndpoints.reduce((sum, ep) => sum + ep.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const endpoint of availableEndpoints) {
        random -= endpoint.weight;
        if (random <= 0) return endpoint;
    }
    return availableEndpoints[0];
}

// Generate realistic request data
function generateRequestData(endpoint, user) {
    const requestData = {
        method: endpoint.method,
        url: BASE_URL + endpoint.url,
        headers: {
            'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
            'X-Forwarded-For': IP_ADDRESSES[Math.floor(Math.random() * IP_ADDRESSES.length)],
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        },
        timeout: 10000
    };

    // Add authentication if required
    if (endpoint.requiresAuth && user) {
        const session = userSessions.get(user.username);
        if (session && session.token && !isTokenExpired(session.token)) {
            requestData.headers['Authorization'] = `Bearer ${session.token}`;
            stats.authRequiredRequests++;
        } else {
            // If no valid session or expired token, skip this request
            return null;
        }
    } else {
        stats.publicRequests++;
    }

    // Add query parameters
    if (endpoint.query) {
        const queryParams = endpoint.query();
        const queryString = Object.keys(queryParams)
            .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
            .join('&');
        requestData.url += `?${queryString}`;
    }

    // Add request body
    if (endpoint.data) {
        requestData.data = endpoint.data();
        requestData.headers['Content-Type'] = 'application/json';
    }

    return requestData;
}

// Force a registration request (runs once per cycle)
async function registerNewUser() {
    const startTime = Date.now();
    const headers = {
        'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        'X-Forwarded-For': IP_ADDRESSES[Math.floor(Math.random() * IP_ADDRESSES.length)],
        'Content-Type': 'application/json'
    };
    const data = {
        username: `trafficuser${Date.now()}`,
        password: 'password123'
    };

    try {
        const response = await axios.post(`${BASE_URL}/api/auth/register`, data, { headers, timeout: 10000 });
        const responseTime = Date.now() - startTime;

        stats.totalRequests++;
        stats.successfulRequests++;
        stats.responseTimes.push(responseTime);
        stats.publicRequests++;

        if (!stats.endpoints['/api/auth/register']) {
            stats.endpoints['/api/auth/register'] = { success: 0, failed: 0 };
        }
        stats.endpoints['/api/auth/register'].success++;

        if (!stats.userAgents[headers['User-Agent']]) {
            stats.userAgents[headers['User-Agent']] = 0;
        }
        stats.userAgents[headers['User-Agent']]++;

        if (!stats.ipAddresses[headers['X-Forwarded-For']]) {
            stats.ipAddresses[headers['X-Forwarded-For']] = 0;
        }
        stats.ipAddresses[headers['X-Forwarded-For']]++;

        console.log(`[${new Date().toISOString()}] ✅ POST /api/auth/register - ${response.status} (${responseTime}ms) - anonymous - Forced user registration`);
    } catch (error) {
        const responseTime = Date.now() - startTime;

        stats.totalRequests++;
        stats.failedRequests++;
        stats.responseTimes.push(responseTime);
        stats.publicRequests++;

        if (!stats.endpoints['/api/auth/register']) {
            stats.endpoints['/api/auth/register'] = { success: 0, failed: 0 };
        }
        stats.endpoints['/api/auth/register'].failed++;

        console.log(`[${new Date().toISOString()}] ❌ POST /api/auth/register - ${error.response?.status || 'NETWORK_ERROR'} (${responseTime}ms) - anonymous - Forced user registration`);
    }
}

// Make a single request
async function makeRequest(user) {
    const endpoint = getRandomEndpoint(user);
    
    // Check if endpoint requires admin role
    if (endpoint.adminOnly && user && user.role !== 'admin') {
        // Skip admin-only endpoints for non-admin users
        return { success: false, responseTime: 0, status: 'SKIPPED_ADMIN_ONLY' };
    }
    
    // Check and refresh token if needed
    if (endpoint.requiresAuth && user) {
        await refreshUserSession(user);
    }
    
    const requestData = generateRequestData(endpoint, user);
    
    // If no valid request data (e.g., missing auth), skip
    if (!requestData) {
        return { success: false, responseTime: 0, status: 'SKIPPED_NO_AUTH' };
    }
    
    const startTime = Date.now();

    try {
        const response = await axios(requestData);
        const responseTime = Date.now() - startTime;
        
        // Update statistics
        stats.totalRequests++;
        stats.successfulRequests++;
        stats.responseTimes.push(responseTime);
        
        if (!stats.endpoints[endpoint.url]) {
            stats.endpoints[endpoint.url] = { success: 0, failed: 0 };
        }
        stats.endpoints[endpoint.url].success++;
        
        if (!stats.userAgents[requestData.headers['User-Agent']]) {
            stats.userAgents[requestData.headers['User-Agent']] = 0;
        }
        stats.userAgents[requestData.headers['User-Agent']]++;
        
        if (!stats.ipAddresses[requestData.headers['X-Forwarded-For']]) {
            stats.ipAddresses[requestData.headers['X-Forwarded-For']] = 0;
        }
        stats.ipAddresses[requestData.headers['X-Forwarded-For']]++;

        console.log(`[${new Date().toISOString()}] ✅ ${endpoint.method} ${endpoint.url} - ${response.status} (${responseTime}ms) - ${user ? user.username : 'anonymous'} - ${endpoint.description}`);
        
        return { success: true, responseTime, status: response.status };
    } catch (error) {
        const responseTime = Date.now() - startTime;
        
        // Handle 401 errors - token might be expired
        if (error.response?.status === 401 && user && endpoint.requiresAuth) {
            console.log(`🔄 401 error for ${user.username}, clearing session and retrying login...`);
            userSessions.delete(user.username);
            stats.authenticatedUsers.delete(user.username);
            
            // Try to login again
            const newToken = await loginUser(user);
            if (newToken) {
                // Retry the request with new token
                const retryRequestData = generateRequestData(endpoint, user);
                if (retryRequestData) {
                    try {
                        const retryResponse = await axios(retryRequestData);
                        const retryResponseTime = Date.now() - startTime;
                        
                        stats.totalRequests++;
                        stats.successfulRequests++;
                        stats.responseTimes.push(retryResponseTime);
                        
                        if (!stats.endpoints[endpoint.url]) {
                            stats.endpoints[endpoint.url] = { success: 0, failed: 0 };
                        }
                        stats.endpoints[endpoint.url].success++;
                        
                        console.log(`[${new Date().toISOString()}] ✅ ${endpoint.method} ${endpoint.url} - ${retryResponse.status} (${retryResponseTime}ms) - ${user.username} - ${endpoint.description} [RETRY]`);
                        
                        return { success: true, responseTime: retryResponseTime, status: retryResponse.status };
                    } catch (retryError) {
                        // If retry also fails, log the error
                        console.log(`[${new Date().toISOString()}] ❌ ${endpoint.method} ${endpoint.url} - ${retryError.response?.status || 'NETWORK_ERROR'} (${retryResponseTime}ms) - ${user.username} - ${endpoint.description} [RETRY FAILED]`);
                    }
                }
            }
        }
        
        // Update statistics
        stats.totalRequests++;
        stats.failedRequests++;
        stats.responseTimes.push(responseTime);
        
        if (!stats.endpoints[endpoint.url]) {
            stats.endpoints[endpoint.url] = { success: 0, failed: 0 };
        }
        stats.endpoints[endpoint.url].failed++;
        
        console.log(`[${new Date().toISOString()}] ❌ ${endpoint.method} ${endpoint.url} - ${error.response?.status || 'NETWORK_ERROR'} (${responseTime}ms) - ${user ? user.username : 'anonymous'} - ${endpoint.description}`);
        
        return { success: false, responseTime, status: error.response?.status || 'NETWORK_ERROR' };
    }
}

// Simulate a single user's traffic
async function simulateUser(user, maxRequests) {
    const requests = [];
    const requestCount = Math.floor(Math.random() * maxRequests) + 1;
    
    console.log(`👤 Starting user simulation: ${user.username} (${user.role}) - ${requestCount} requests`);
    
    // Try to login first
    stats.loginAttempts++;
    const token = await loginUser(user);
    
    for (let i = 0; i < requestCount; i++) {
        const delay = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds between requests
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const result = await makeRequest(user);
        requests.push(result);
    }
    
    return requests;
}

// Print statistics
function printStats() {
    const duration = (Date.now() - stats.startTime.getTime()) / 1000;
    const avgResponseTime = stats.responseTimes.length > 0 
        ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length 
        : 0;
    
    console.log('\n📊 TRAFFIC SIMULATION STATISTICS');
    console.log('=====================================');
    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
    console.log(`📈 Total Requests: ${stats.totalRequests}`);
    console.log(`✅ Successful: ${stats.successfulRequests}`);
    console.log(`❌ Failed: ${stats.failedRequests}`);
    console.log(`📊 Success Rate: ${((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2)}%`);
    console.log(`⚡ Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`🚀 Requests/Second: ${(stats.totalRequests / duration).toFixed(2)}`);
    console.log(`🔐 Login Attempts: ${stats.loginAttempts}`);
    console.log(`✅ Successful Logins: ${stats.successfulLogins}`);
    console.log(`👥 Authenticated Users: ${stats.authenticatedUsers.size}`);
    console.log(`🔒 Authenticated Requests: ${stats.authRequiredRequests}`);
    console.log(`🌐 Public Requests: ${stats.publicRequests}`);
    
    console.log('\n🔝 Top Endpoints:');
    Object.entries(stats.endpoints)
        .sort(([,a], [,b]) => (b.success + b.failed) - (a.success + a.failed))
        .slice(0, 10)
        .forEach(([url, data]) => {
            console.log(`  ${url}: ${data.success + data.failed} requests (${data.success}✅ ${data.failed}❌)`);
        });
    
    console.log('\n🌐 User Agents Used:');
    Object.entries(stats.userAgents)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([ua, count]) => {
            console.log(`  ${ua.substring(0, 50)}...: ${count} requests`);
        });
    
    console.log('\n📍 IP Addresses Used:');
    Object.entries(stats.ipAddresses)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([ip, count]) => {
            console.log(`  ${ip}: ${count} requests`);
        });
    
    console.log('\n👥 Authenticated Users:');
    Array.from(stats.authenticatedUsers).slice(0, 10).forEach(username => {
        console.log(`  ${username}`);
    });
}

// Main simulation function
async function simulateTraffic() {
    console.log('🚀 Starting Realistic API Discovery Traffic Simulation');
    console.log(`📡 Target: ${BASE_URL}`);
    console.log(`⏱️  Duration: ${SIMULATION_DURATION} minutes`);
    console.log(`👥 Concurrent Users: ${CONCURRENT_USERS}`);
    console.log(`🔄 Request Interval: ${REQUEST_INTERVAL}ms`);
    console.log(`🎯 Goal: Simulate realistic API interactions for discovery`);
    console.log('=====================================\n');

    const startTime = Date.now();
    const endTime = startTime + (SIMULATION_DURATION * 60 * 1000);
    
    // Select random users for this simulation
    const selectedUsers = REAL_USER_ACCOUNTS
        .sort(() => 0.5 - Math.random())
        .slice(0, CONCURRENT_USERS);
    
    console.log(`👥 Selected Users: ${selectedUsers.map(u => `${u.username}(${u.role})`).join(', ')}\n`);

    while (Date.now() < endTime) {
        // Create concurrent user simulations
        const userPromises = selectedUsers.map(user => 
            simulateUser(user, MAX_REQUESTS_PER_USER)
        );

        // Force at least one registration per cycle
        userPromises.push(registerNewUser());
        
        // Wait for all users to complete their requests
        await Promise.all(userPromises);
        
        // Wait before next round
        const waitTime = Math.floor(Math.random() * REQUEST_INTERVAL) + REQUEST_INTERVAL;
        console.log(`\n⏳ Waiting ${waitTime}ms before next round...\n`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    printStats();
    console.log('\n🎉 API Discovery Traffic Simulation completed!');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, printing final stats...');
    printStats();
    process.exit(0);
});

// Start simulation
if (require.main === module) {
    simulateTraffic().catch(console.error);
}

module.exports = { simulateTraffic, makeRequest, generateJWT }; 