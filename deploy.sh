#!/bin/bash

# Insurance API Security Testing App - Docker Deployment Script

set -e

echo "🚀 Starting Insurance API Security Testing App Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Set environment variables
export JWT_SECRET=${JWT_SECRET:-"your-super-secret-jwt-key-for-security-testing-2024"}

echo "📦 Building and starting services..."

# Build and start services
docker-compose up --build -d

echo "⏳ Waiting for services to start..."

# Wait for backend to be ready
echo "🔍 Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    echo "⏳ Waiting for backend... (attempt $i/30)"
    sleep 2
done

# Wait for frontend to be ready
echo "🔍 Checking frontend health..."
for i in {1..30}; do
    if curl -f http://localhost:5174 > /dev/null 2>&1; then
        echo "✅ Frontend is healthy!"
        break
    fi
    echo "⏳ Waiting for frontend... (attempt $i/30)"
    sleep 2
done

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost:5174"
echo "   Backend API: http://localhost:3001"
echo "   Health Check: http://localhost:3001/api/health"
echo ""
echo "🔐 Demo Credentials:"
echo "   Admin: admin1 / adminpass"
echo "   User: user1 / userpass"
echo ""
echo "📋 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Update and restart: docker-compose up --build -d"
echo ""
echo "⚠️  Security Note: This is a testing application with intentional vulnerabilities."
echo "   Do not use in production environments." 