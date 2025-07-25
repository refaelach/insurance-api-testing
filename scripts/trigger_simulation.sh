#!/bin/bash

# Manual Traffic Simulation Trigger Script
# Usage: ./scripts/trigger_simulation.sh [duration_minutes] [base_url]

# Default values
DURATION=${1:-5}
BASE_URL=${2:-"http://localhost"}

echo "🚀 Manual Traffic Simulation Trigger"
echo "⏱️  Duration: ${DURATION} minutes"
echo "📡 Target URL: ${BASE_URL}"
echo ""

# Check if we're running in Docker or locally
if [ -f "/.dockerenv" ]; then
    echo "🐳 Running inside Docker container..."
    cd /simulator
    SIMULATION_DURATION=$DURATION TRAFFIC_BASE_URL=$BASE_URL node traffic_simulator.js
else
    echo "💻 Running locally..."
    cd "$(dirname "$0")"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi
    
    # Run the simulation
    SIMULATION_DURATION=$DURATION TRAFFIC_BASE_URL=$BASE_URL node traffic_simulator.js
fi

echo ""
echo "✅ Traffic simulation completed!" 