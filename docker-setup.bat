@echo off
REM Department Management System - Docker Setup Script for Windows

echo 🚀 Setting up Department Management System with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please edit the .env file with your secure passwords before continuing.
    echo    You can do this by running: notepad .env
    pause
) else (
    echo ✅ .env file already exists
)

echo 🔧 Building and starting the application...
echo    This may take a few minutes on the first run...

REM Build and start the application
docker-compose up --build -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo 📊 Checking service status...
docker-compose ps

echo.
echo 🎉 Setup complete!
echo.
echo 📱 Access your application:
echo    Frontend: http://localhost
echo    Backend API: http://localhost:3001
echo    Database: localhost:3306
echo.
echo 📋 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo    Rebuild: docker-compose up --build
echo.
echo 📖 For more information, see DOCKER_README.md
pause 