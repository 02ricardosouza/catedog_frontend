#!/bin/bash
set -e

echo "🚀 Starting frontend deployment..."

# Load environment variables if .env exists
if [ -f .env ]; then
    echo "📋 Loading environment variables..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build new images
echo "🏗️ Building Docker images..."
docker-compose build --no-cache

# Start frontend service
echo "🚀 Starting frontend service..."
docker-compose up -d

# Wait for service to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:${FRONTEND_PORT:-80}/ > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    docker-compose logs frontend
    exit 1
fi

echo "✅ Frontend deployment completed successfully!"
