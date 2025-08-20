# GoDaddy DNS Configuration for Staging Environment

## 🌐 Domain: dummyinsuranceapp.xyz

### 📍 Current Production Setup
- **Main Domain**: dummyinsuranceapp.xyz → 20.105.232.33 (Azure App Service)
- **Status**: ✅ Active

### 🚀 New Staging Environment DNS Records

#### Frontend Staging
- **Record Type**: A Record
- **Name**: `staging`
- **Full Domain**: `staging.dummyinsuranceapp.xyz`
- **IP Address**: `4.175.196.212`
- **TTL**: 600 seconds (10 minutes)
- **Purpose**: Frontend staging application

#### Backend API Staging
- **Record Type**: A Record
- **Name**: `staging-api`
- **Full Domain**: `staging-api.dummyinsuranceapp.xyz`
- **IP Address**: `20.23.160.103`
- **TTL**: 600 seconds (10 minutes)
- **Purpose**: Backend API staging services

## 🔧 GoDaddy DNS Management Steps

### Step 1: Access GoDaddy DNS Management
1. Log into GoDaddy account
2. Go to "My Products" → "Domains"
3. Click on `dummyinsuranceapp.xyz`
4. Click "DNS" tab

### Step 2: Add Frontend A Record
1. Click "ADD" button
2. **Record Type**: A
3. **Name**: `staging`
4. **Value**: `4.175.196.212`
5. **TTL**: 600
6. Click "Save"

### Step 3: Add Backend API A Record
1. Click "ADD" button again
2. **Record Type**: A
3. **Name**: `staging-api`
4. **Value**: `20.23.160.103`
5. **TTL**: 600
6. Click "Save"

### Step 4: Verify DNS Propagation
- Wait 10-15 minutes for DNS propagation
- Test with: `nslookup staging.dummyinsuranceapp.xyz`
- Test with: `nslookup staging-api.dummyinsuranceapp.xyz`

## 🌍 Expected Results

After DNS propagation:
- `staging.dummyinsuranceapp.xyz` → `4.175.196.212` (Frontend)
- `staging-api.dummyinsuranceapp.xyz` → `20.23.160.103` (Backend)

## ⚠️ Important Notes

1. **TTL**: 600 seconds allows quick changes during testing
2. **IP Addresses**: These are from Azure Container Instances (ACI)
3. **No HTTPS Yet**: HTTP only until F5 XC is configured
4. **Testing**: Use staging subdomain for testing before production

## 🔒 Next Steps (After DNS Setup)

1. ✅ DNS Records configured
2. 🔄 Test subdomain accessibility
3. 🚀 Configure F5 XC Distributed Cloud Load Balancer
4. 🔐 Enable automatic SSL certificates
5. 🌐 Test HTTPS staging environment 