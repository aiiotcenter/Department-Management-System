#!/bin/bash

echo "Creating .env files for Docker deployment..."

# Create root .env file for Docker Compose
cat > .env << 'EOF'
# Database Configuration
MYSQL_ROOT_PASSWORD=DMS123-qaz
MYSQL_PASSWORD=DMS123-qaz

# Backend Configuration
NODE_ENV=production
PORT=3001
Database_Password=DMS123-qaz
DB_HOST=mysql
DB_USER=root
DB_NAME=dms

# JWT Secret
JWT_SECRET=asdfghjklqwertyuiopzxcvbnmasdfghjkl

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=Department.Managment.System@gmail.com
EMAIL_PASS=vxla gjqq xhfw ianw
EOF

# Create back-end .env file
cat > back-end/.env << 'EOF'
# The database password & the secret key for JSON Web Token
Database_Password = 'DMS123-qaz'
JWT_SECRET = "asdfghjklqwertyuiopzxcvbnmasdfghjkl"

# Data used in sending emails
Email_Host =smtp.gmail.com
Email_Port =587
Sender_Email = Department.Managment.System@gmail.com
Email_App_Password = "vxla gjqq xhfw ianw"

# Docker Database Configuration
DB_HOST=mysql
DB_USER=root
DB_NAME=dms

# Docker Environment
NODE_ENV=production
PORT=3001

# MySQL Root Password (for Docker)
MYSQL_ROOT_PASSWORD=DMS123-qaz
MYSQL_PASSWORD=DMS123-qaz
EOF

echo "✅ .env files created successfully!"
echo "📁 Root .env file created"
echo "📁 back-end/.env file created"
echo ""
echo "🚀 You can now run: docker-compose up --build" 