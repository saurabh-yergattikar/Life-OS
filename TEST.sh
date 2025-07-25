#!/bin/bash

echo "🧪 Life-OS Agentic AI Test Suite"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Check if backend dependencies are installed
if [ ! -d "src/backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd src/backend
    npm install
    cd ../..
else
    echo "✅ Backend dependencies already installed"
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

# Check if Gemini credentials exist
if [ ! -f "src/backend/gemini-service-account.json" ]; then
    echo "⚠️  Warning: Gemini service account credentials not found"
    echo "   Please place your service account JSON file in src/backend/gemini-service-account.json"
    echo "   The demo will work with fallback responses, but Gemini features will be limited"
else
    echo "✅ Gemini credentials found"
fi

# Test backend compilation
echo "🔨 Testing backend compilation..."
cd src/backend
if npm run build &> /dev/null; then
    echo "✅ Backend compiles successfully"
else
    echo "❌ Backend compilation failed"
    exit 1
fi
cd ../..

# Test frontend compilation
echo "🔨 Testing frontend compilation..."
if npm run build &> /dev/null; then
    echo "✅ Frontend compiles successfully"
else
    echo "❌ Frontend compilation failed"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Your Life-OS application is ready to run."
echo ""
echo "🚀 To start the application:"
echo "   1. Terminal 1: cd src/backend && npm run dev"
echo "   2. Terminal 2: npm run dev"
echo "   3. Open http://localhost:3000"
echo ""
echo "📹 Don't forget to record your demo video and update DEMO.md with the link!" 