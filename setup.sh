#!/bin/bash
# Project Pegasus Setup Script
# This script will help you set up Project Pegasus on your local machine

echo "════════════════════════════════════════════════════════════"
echo "  Project Pegasus - Setup Script"
echo "  Your AI, Your Rules, Your Control"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
echo "🔍 Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo "✅ Node.js $NODE_VERSION found"
fi

echo ""
echo "🔍 Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo "✅ npm $NPM_VERSION found"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "📦 Installing Frontend Dependencies"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ ! -d "node_modules" ]; then
    echo "📥 Running: npm install"
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies installed successfully"
    else
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "📦 Installing Backend Dependencies"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ ! -d "backend/node_modules" ]; then
    echo "📥 Running: npm install in backend directory"
    cd backend
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed successfully"
        cd ..
    else
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
else
    echo "✅ Backend dependencies already installed"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "🚀 To start Project Pegasus:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   └─ cd backend"
echo "   └─ node server.js"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   └─ npm start"
echo ""
echo "🌐 Access the application at: http://localhost:3000"
echo ""
echo "🔐 Default Credentials:"
echo "   Username: main_admin"
echo "   Password: password123"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
