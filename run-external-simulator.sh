#!/bin/bash

echo "🚀 Starting External Traffic Simulator"
echo "Target: F5 XC Load Balancer (http://ves-io-2b114046-6731-45d9-8696-504488425dff.ac.vh.ves.io/)"
echo ""

# Run the simulator container externally
docker run --rm \
  -e TRAFFIC_BASE_URL=http://ves-io-2b114046-6731-45d9-8696-504488425dff.ac.vh.ves.io \
  -e SIMULATION_DURATION=10 \
  -e REQUEST_INTERVAL=10000 \
  -e CONCURRENT_USERS=5 \
  -e MAX_REQUESTS_PER_USER=20 \
  rafauser/insurance-simulator

echo ""
echo "✅ External simulator completed!" 