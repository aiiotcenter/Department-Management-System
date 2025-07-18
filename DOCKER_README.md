# Department Management System - Docker Deployment

This guide will help you deploy the Department Management System using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- Git (to clone the repository)

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repository-url>
   cd Department-Management-System
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   Edit the `.env` file with your secure passwords and configuration.

3. **Build and start the application**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001
   - MySQL Database: localhost:3306

## Services Overview

The application consists of three main services:

### 1. MySQL Database (`mysql`)
- **Port**: 3306
- **Database**: `dms`
- **Root Password**: Set via `MYSQL_ROOT_PASSWORD` environment variable
- **Data Persistence**: Stored in Docker volume `mysql_data`

### 2. Backend API (`backend`)
- **Port**: 3001
- **Technology**: Node.js/Express
- **Dependencies**: MySQL database
- **File Uploads**: Stored in Docker volumes `backend_uploads` and `backend_qrcodes`

### 3. Frontend (`frontend`)
- **Port**: 80
- **Technology**: React with Vite
- **Web Server**: Nginx
- **API Proxy**: Automatically routes `/api/*` requests to the backend

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_dms_password

# Backend Configuration
NODE_ENV=production
PORT=3001
Database_Password=your_secure_root_password
DB_HOST=mysql
DB_USER=root
DB_NAME=dms

# JWT Secret (if needed)
JWT_SECRET=your_jwt_secret_key

# Email Configuration (if using nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## Docker Commands

### Start the application:
```bash
docker-compose up
```

### Start in background:
```bash
docker-compose up -d
```

### Stop the application:
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ This will delete all data):
```bash
docker-compose down -v
```

### Rebuild containers:
```bash
docker-compose up --build
```

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### Access container shell:
```bash
# Backend container
docker-compose exec backend sh

# MySQL container
docker-compose exec mysql mysql -u root -p
```

## File Structure

```
Department-Management-System/
├── docker-compose.yml          # Main orchestration file
├── env.example                 # Environment variables template
├── DOCKER_README.md           # This file
├── back-end/
│   ├── Dockerfile             # Backend container configuration
│   ├── .dockerignore          # Files to exclude from backend build
│   └── ...
├── frontend/
│   ├── Dockerfile             # Frontend container configuration
│   ├── nginx.conf             # Nginx configuration
│   ├── .dockerignore          # Files to exclude from frontend build
│   └── ...
└── ...
```

## Troubleshooting

### Common Issues:

1. **Port already in use**:
   - Check if ports 80, 3001, or 3306 are already in use
   - Modify the port mappings in `docker-compose.yml` if needed

2. **Database connection issues**:
   - Ensure MySQL container is healthy: `docker-compose ps`
   - Check database logs: `docker-compose logs mysql`
   - Verify environment variables are set correctly

3. **Frontend not loading**:
   - Check if backend is running: `docker-compose logs backend`
   - Verify nginx configuration
   - Check browser console for errors

4. **File upload issues**:
   - Ensure Docker volumes are properly mounted
   - Check permissions on upload directories

### Health Checks:

The application includes health checks for the database and backend services. You can monitor them with:

```bash
docker-compose ps
```

### Logs and Debugging:

```bash
# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Check container status
docker-compose ps
```

## Production Deployment

For production deployment, consider:

1. **Security**:
   - Use strong passwords in `.env` file
   - Enable HTTPS with SSL certificates
   - Configure firewall rules
   - Use secrets management for sensitive data

2. **Performance**:
   - Configure MySQL for production workloads
   - Set up proper logging and monitoring
   - Consider using a reverse proxy (e.g., Traefik)

3. **Backup**:
   - Set up regular database backups
   - Backup uploaded files and QR codes

4. **Scaling**:
   - Consider using Docker Swarm or Kubernetes for scaling
   - Set up load balancing for multiple instances

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Check if all required ports are available

For additional help, please refer to the main project documentation or create an issue in the repository. 