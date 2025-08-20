#!/bin/bash

echo "🔍 DNS Verification Script for Staging Environment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check DNS record
check_dns() {
    local domain=$1
    local expected_ip=$2
    local description=$3
    
    echo "📡 Checking: $description"
    echo "   Domain: $domain"
    echo "   Expected IP: $expected_ip"
    
    # Get actual IP
    actual_ip=$(nslookup $domain 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')
    
    if [ "$actual_ip" = "$expected_ip" ]; then
        echo -e "   Status: ${GREEN}✅ MATCH${NC}"
    else
        echo -e "   Status: ${RED}❌ MISMATCH${NC}"
        echo "   Actual IP: $actual_ip"
    fi
    echo ""
}

# Check main domain
echo "🌐 Main Domain Check:"
check_dns "dummyinsuranceapp.xyz" "20.105.232.33" "Production App Service"

# Check staging subdomains
echo "🚀 Staging Subdomains Check:"
check_dns "staging.dummyinsuranceapp.xyz" "4.175.196.212" "Frontend Staging"
check_dns "staging-api.dummyinsuranceapp.xyz" "20.23.160.103" "Backend API Staging"

echo "📋 Summary:"
echo "==========="
echo "• Main domain should point to Azure App Service"
echo "• Staging subdomains should point to ACI containers"
echo "• Wait 10-15 minutes for DNS propagation if records don't match"
echo ""
echo "🔒 Next: Configure F5 XC for SSL termination" 