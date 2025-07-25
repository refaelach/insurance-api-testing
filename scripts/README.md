# Traffic Simulator

## 🎯 Purpose

The Traffic Simulator is designed to generate realistic HTTP traffic to the Insurance API Testing Project, simulating real-world usage patterns and helping with API discovery via load balancers like F5 XC.

## 🚀 Features

- **Realistic Traffic Patterns**: Sends requests with realistic user agents, headers, and payloads
- **Comprehensive Endpoint Coverage**: Targets both secure and vulnerable endpoints
- **Scheduled Execution**: Runs automatically every hour via cron
- **Configurable Parameters**: Duration, interval, and target URL can be customized
- **Detailed Logging**: Comprehensive request/response logging with statistics
- **Graceful Shutdown**: Handles interruptions and termination signals

## 📋 Endpoints Covered

### Secure Endpoints (Realistic Functionality)
- `GET /api/health` - Health check
- `GET /api/policies/categories` - Policy types
- `GET /api/user/notifications` - User notifications
- `POST /api/claims/estimate` - Claim estimates
- `GET /api/coverage/details` - Coverage summary

### Vulnerable Endpoints (Security Testing)
- `GET /api/policies/mine` - Missing authentication
- `GET /api/customers/me` - JWT bypass
- `GET /api/accounts/overview` - Expired token
- `GET /api/admin/stats` - Unauthenticated admin access
- `GET /api/policies/search` - Excessive record retrieval
- `POST /api/documents/preview` - SSRF vulnerability
- `POST /api/support/contact` - Verbose error disclosure
- `PATCH /api/admin/settings` - Mass assignment
- `DELETE /api/admin/reports` - HTTP method bypass

### Frontend Routes
- `GET /` - Main dashboard
- `GET /login` - Login page
- `GET /dashboard` - Dashboard
- `GET /profile` - Profile page

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TRAFFIC_BASE_URL` | `http://nginx` | Target URL for requests |
| `SIMULATION_DURATION` | `15` | Duration in minutes |
| `REQUEST_INTERVAL` | `2000` | Interval between requests (ms) |

### Docker Configuration

The simulator is configured in `docker-compose.yml`:

```yaml
simulator:
  build:
    context: ./scripts
  container_name: traffic-simulator
  depends_on:
    - nginx
  environment:
    - TRAFFIC_BASE_URL=http://nginx
    - SIMULATION_DURATION=15
    - REQUEST_INTERVAL=2000
  volumes:
    - ./scripts/logs:/var/log
  networks:
    - insurance-network
```

## 🚀 Usage

### Automatic Execution (Docker)

The simulator runs automatically every hour when deployed with Docker:

```bash
# Start all services including simulator
docker-compose up --build

# View simulator logs
docker-compose logs -f simulator

# Check cron logs
docker exec traffic-simulator cat /var/log/traffic-simulator.log
```

### Manual Execution

#### Using Docker
```bash
# Run simulation manually in container
docker exec traffic-simulator node /simulator/traffic_simulator.js

# Run with custom parameters
docker exec -e SIMULATION_DURATION=5 -e TRAFFIC_BASE_URL=http://localhost traffic-simulator node /simulator/traffic_simulator.js
```

#### Using Local Script
```bash
# Install dependencies
cd scripts
npm install

# Run simulation
node traffic_simulator.js

# Run with custom parameters
SIMULATION_DURATION=5 TRAFFIC_BASE_URL=http://localhost node traffic_simulator.js
```

#### Using Trigger Script
```bash
# Run 5-minute simulation to localhost
./scripts/trigger_simulation.sh 5 http://localhost

# Run 10-minute simulation to production domain
./scripts/trigger_simulation.sh 10 https://yourdomain.com
```

## 📊 Monitoring

### Logs

Traffic simulation logs are available in multiple locations:

1. **Container Logs**: `docker-compose logs simulator`
2. **Cron Logs**: `docker exec traffic-simulator cat /var/log/traffic-simulator.log`
3. **Host Logs**: `./scripts/logs/traffic-simulator.log`

### Statistics

The simulator provides detailed statistics:

- Total requests sent
- Success/failure rates
- Response times
- Requests per second
- Duration breakdown

### Example Output

```
🚀 Starting traffic simulation for 15 minutes...
📡 Target URL: http://nginx
⏱️  Request interval: 2000ms
🎯 Total endpoints: 18
────────────────────────────────────────────────────────────────────────────────
🔥 Sending initial burst of requests...
[2024-01-15T10:00:00.000Z] ✅ GET /api/health - 200 (45ms) - Health check endpoint
[2024-01-15T10:00:00.500Z] ✅ GET /api/policies/categories - 200 (67ms) - Available policy types
[2024-01-15T10:00:01.000Z] ❌ GET /api/user/notifications - ERROR: 401 Unauthorized - User notifications
[2024-01-15T10:00:01.500Z] ✅ POST /api/claims/estimate - 201 (89ms) - Submit claim estimate
[2024-01-15T10:00:02.000Z] ✅ GET / - 200 (34ms) - Main dashboard page
📊 Progress: 10 requests, 8 success, 2 errors (30s elapsed, 870s remaining)
```

## 🔧 Customization

### Adding New Endpoints

Edit `traffic_simulator.js` and add new endpoints to the `endpoints` array:

```javascript
{
  method: 'POST',
  url: '/api/new-endpoint',
  description: 'New endpoint description',
  data: { key: 'value' },
  headers: { 'Content-Type': 'application/json' }
}
```

### Modifying Traffic Patterns

- **Request Frequency**: Adjust `REQUEST_INTERVAL`
- **Simulation Duration**: Modify `SIMULATION_DURATION`
- **User Agents**: Update `userAgents` array
- **Headers**: Modify `getRandomHeaders()` function

### Custom Payloads

For endpoints requiring specific data, update the `data` property:

```javascript
{
  method: 'POST',
  url: '/api/custom-endpoint',
  data: {
    amount: Math.floor(Math.random() * 10000),
    description: 'Custom description',
    timestamp: new Date().toISOString()
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if target service is running
   - Verify `TRAFFIC_BASE_URL` is correct
   - Ensure network connectivity

2. **Cron Not Running**
   - Check cron daemon: `docker exec traffic-simulator crond -l`
   - Verify cron job: `docker exec traffic-simulator crontab -l`
   - Check logs: `docker exec traffic-simulator cat /var/log/traffic-simulator.log`

3. **High Error Rate**
   - Verify endpoint availability
   - Check authentication requirements
   - Review network configuration

### Debug Commands

```bash
# Test single request
docker exec traffic-simulator node -e "require('./traffic_simulator.js').sendRequest({method:'GET',url:'/api/health',description:'Test'})"

# Check container status
docker-compose ps simulator

# View real-time logs
docker-compose logs -f simulator

# Access container shell
docker exec -it traffic-simulator sh
```

## 🔒 Security Considerations

- The simulator sends requests to vulnerable endpoints for testing purposes
- Ensure it only runs in controlled environments
- Monitor logs for unexpected behavior
- Use appropriate rate limiting in production

## 📈 Performance Impact

- **CPU**: Minimal impact (~5-10% during simulation)
- **Memory**: Low memory usage (~50-100MB)
- **Network**: Moderate bandwidth usage
- **Storage**: Log files grow ~1MB per hour of simulation

## 🎯 Integration with Load Balancers

The traffic simulator is designed to work with load balancers like F5 XC:

1. **API Discovery**: Generates traffic to help discover endpoints
2. **Load Testing**: Creates realistic load patterns
3. **Security Testing**: Triggers security policies and rules
4. **Monitoring**: Provides baseline traffic for monitoring systems

---

**Note**: This simulator is designed for educational and testing purposes. Use responsibly in production environments. 