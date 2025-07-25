#!/bin/bash

# Azure Deployment Script for Insurance API Testing Project
# Usage: ./scripts/deploy-azure.sh yourdomain.com

set -e

# Check if domain is provided
if [ -z "$1" ]; then
    echo "❌ Error: Domain name is required"
    echo "Usage: $0 yourdomain.com"
    exit 1
fi

DOMAIN=$1
RESOURCE_GROUP="insurance-api-testing-rg"
LOCATION=${2:-"eastus"}

echo "🚀 Deploying Insurance API Testing Project to Azure"
echo "Domain: $DOMAIN"
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Error: Azure CLI is not installed"
    echo "Please install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Login to Azure
echo "🔐 Logging into Azure..."
az login

# Create resource group
echo "🏗️  Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create container registry
echo "📦 Creating Azure Container Registry..."
ACR_NAME="insuranceacr$(date +%s)"
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

# Login to ACR
echo "🔐 Logging into ACR..."
az acr login --name $ACR_NAME

# Build and push Docker images
echo "📦 Building and pushing Docker images..."

# Build images
docker-compose -f docker-compose.prod.yml build

# Tag images for ACR
docker tag api-testing-project-frontend:latest $ACR_NAME.azurecr.io/insurance-frontend:latest
docker tag api-testing-project-backend:latest $ACR_NAME.azurecr.io/insurance-backend:latest
docker tag api-testing-project-nginx:latest $ACR_NAME.azurecr.io/insurance-nginx:latest

# Push images
docker push $ACR_NAME.azurecr.io/insurance-frontend:latest
docker push $ACR_NAME.azurecr.io/insurance-backend:latest
docker push $ACR_NAME.azurecr.io/insurance-nginx:latest

# Create App Service Plan
echo "📋 Creating App Service Plan..."
az appservice plan create \
  --name insurance-plan \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App
echo "🚀 Creating Web App..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan insurance-plan \
  --name insurance-app \
  --deployment-container-image-name $ACR_NAME.azurecr.io/insurance-nginx:latest

# Configure environment variables
echo "🔧 Configuring environment variables..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name insurance-app \
  --settings \
    NODE_ENV=production \
    JWT_SECRET=your-super-secure-production-secret \
    DOMAIN=$DOMAIN

# Enable continuous deployment
echo "🔄 Enabling continuous deployment..."
az webapp deployment container config \
  --resource-group $RESOURCE_GROUP \
  --name insurance-app \
  --enable-cd true

# Get the web app URL
WEBAPP_URL=$(az webapp show --resource-group $RESOURCE_GROUP --name insurance-app --query defaultHostName --output tsv)

echo "✅ Azure deployment complete!"
echo ""
echo "🌐 Web App URL: https://$WEBAPP_URL"
echo "🔧 Next steps:"
echo "1. Update your DNS to point $DOMAIN to $WEBAPP_URL"
echo "2. Configure custom domain in Azure App Service"
echo "3. Set up SSL certificate"
echo "4. Monitor logs: az webapp log tail --name insurance-app --resource-group $RESOURCE_GROUP" 