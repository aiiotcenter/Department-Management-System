@echo off
echo Creating .env files for Docker deployment...

REM Create root .env file for Docker Compose
(
echo # Database Configuration
echo MYSQL_ROOT_PASSWORD=DMS123-qaz
echo MYSQL_PASSWORD=DMS123-qaz
echo.
echo # Backend Configuration
echo NODE_ENV=production
echo PORT=3001
echo Database_Password=DMS123-qaz
echo DB_HOST=mysql
echo DB_USER=root
echo DB_NAME=dms
echo.
echo # JWT Secret
echo JWT_SECRET=asdfghjklqwertyuiopzxcvbnmasdfghjkl
echo.
echo # Email Configuration
echo EMAIL_HOST=smtp.gmail.com
echo EMAIL_PORT=587
echo EMAIL_USER=Department.Managment.System@gmail.com
echo EMAIL_PASS=vxla gjqq xhfw ianw
) > .env

REM Create back-end .env file
(
echo # The database password ^& the secret key for JSON Web Token
echo Database_Password = 'DMS123-qaz'
echo JWT_SECRET = "asdfghjklqwertyuiopzxcvbnmasdfghjkl"
echo.
echo # Data used in sending emails
echo Email_Host =smtp.gmail.com
echo Email_Port =587
echo Sender_Email = Department.Managment.System@gmail.com
echo Email_App_Password = "vxla gjqq xhfw ianw"
echo.
echo # Docker Database Configuration
echo DB_HOST=mysql
echo DB_USER=root
echo DB_NAME=dms
echo.
echo # Docker Environment
echo NODE_ENV=production
echo PORT=3001
echo.
echo # MySQL Root Password ^(for Docker^)
echo MYSQL_ROOT_PASSWORD=DMS123-qaz
echo MYSQL_PASSWORD=DMS123-qaz
) > back-end\.env

echo ✅ .env files created successfully!
echo 📁 Root .env file created
echo 📁 back-end\.env file created
echo.
echo 🚀 You can now run: docker-compose up --build
pause 