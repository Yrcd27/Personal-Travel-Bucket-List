#!/bin/bash

echo "🚀 Starting local deployment..."

# Build new images
echo "📦 Building Docker images..."
docker-compose build --no-cache

# Restart containers
echo "🔄 Restarting containers..."
docker-compose down --remove-orphans
docker-compose up -d --force-recreate

# Wait for startup
echo "⏳ Waiting for containers to start..."
sleep 10

# Health check
echo "🏥 Health check..."
curl -f http://localhost:5173 > /dev/null 2>&1 && echo "✅ Frontend: OK" || echo "❌ Frontend: Not ready"
curl -f http://localhost:5000/api/health > /dev/null 2>&1 && echo "✅ Backend: OK" || echo "❌ Backend: Not ready"

echo "🎉 Local deployment completed!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"