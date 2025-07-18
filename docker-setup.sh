#!/bin/bash

# Department Management System - Docker Setup Script

echo "🚀 Setting up Department Management System with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit the .env file with your secure passwords before continuing."
    echo "   You can do this by running: nano .env"
    read -p "Press Enter when you've updated the .env file..."
else
    echo "✅ .env file already exists"
fi

# Check if ports are available
echo "🔍 Checking if required ports are available..."

# Check port 80
if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 80 is already in use. You may need to stop the service using it."
fi

# Check port 3001
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3001 is already in use. You may need to stop the service using it."
fi

# Check port 3306
if lsof -Pi :3306 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3306 is already in use. You may need to stop the service using it."
fi

echo "🔧 Building and starting the application..."
echo "   This may take a few minutes on the first run..."

# Build and start the application
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "📊 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3001"
echo "   Database: localhost:3306"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Rebuild: docker-compose up --build"
echo ""
echo "📖 For more information, see DOCKER_README.md" 