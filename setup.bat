@echo off
REM Project Pegasus Setup Script for Windows
REM This script will help you set up Project Pegasus on your local machine

echo.
echo ════════════════════════════════════════════════════════════
echo   Project Pegasus - Setup Script
echo   Your AI, Your Rules, Your Control
echo ════════════════════════════════════════════════════════════
echo.

REM Check if Node.js is installed
echo 🔍 Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo 📥 Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo ✅ Node.js !NODE_VERSION! found
)

echo.
echo 🔍 Checking for npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo ✅ npm !NPM_VERSION! found
)

echo.
echo ════════════════════════════════════════════════════════════
echo 📦 Installing Frontend Dependencies
echo ════════════════════════════════════════════════════════════
echo.

if not exist "node_modules" (
    echo 📥 Running: npm install
    call npm install
    if %errorlevel% equ 0 (
        echo ✅ Frontend dependencies installed successfully
    ) else (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo ════════════════════════════════════════════════════════════
echo 📦 Installing Backend Dependencies
echo ════════════════════════════════════════════════════════════
echo.

if not exist "backend\node_modules" (
    echo 📥 Running: npm install in backend directory
    cd backend
    call npm install
    if %errorlevel% equ 0 (
        echo ✅ Backend dependencies installed successfully
        cd ..
    ) else (
        echo ❌ Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo ✅ Backend dependencies already installed
)

echo.
echo ════════════════════════════════════════════════════════════
echo ✅ Setup Complete!
echo ════════════════════════════════════════════════════════════
echo.

echo 🚀 To start Project Pegasus:
echo.
echo    Terminal 1 (Backend):
echo    └─ cd backend
echo    └─ node server.js
echo.
echo    Terminal 2 (Frontend):
echo    └─ npm start
echo.
echo 🌐 Access the application at: http://localhost:3000
echo.
echo 🔐 Default Credentials:
echo    Username: main_admin
echo    Password: password123
echo.
echo 📚 For more information, see README.md
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
