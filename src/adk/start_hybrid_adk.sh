#!/bin/bash

echo "🌅 Life-OS ADK Hybrid Implementation"
echo "========================================="
echo "✅ ADK Framework + Original UI"
echo "✅ Same Process + ADK Compliance"
echo "========================================="

# Navigate to project root
cd "$(dirname "$0")/../.."

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "python3.*adk_hybrid_backend.py" 2>/dev/null
pkill -f "next" 2>/dev/null
sleep 2

# Start ADK Hybrid Backend
echo "🚀 Starting ADK Hybrid Backend..."
cd src/adk
source adk_env/bin/activate
python3 adk_hybrid_backend.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend
echo "🧪 Testing ADK Hybrid Backend..."
curl -s http://localhost:4000/api/adk/agent/status > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ ADK Hybrid Backend is running on http://localhost:4000"
else
    echo "❌ ADK Hybrid Backend failed to start"
    exit 1
fi

# Start Next.js Frontend (original UI)
echo "🎨 Starting Next.js Frontend (Original UI)..."
cd ../..
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Test frontend
echo "🧪 Testing Next.js Frontend..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Next.js Frontend is running on http://localhost:3000"
else
    echo "❌ Next.js Frontend failed to start"
    exit 1
fi

echo ""
echo "🎉 ADK Hybrid Implementation is ready!"
echo "========================================="
echo "🌐 Frontend: http://localhost:3000 (Original UI)"
echo "🔗 Backend: http://localhost:4000 (ADK Framework)"
echo "📡 API Endpoints:"
echo "   POST /api/night-agent/start (same as before)"
echo "   GET  /api/night-agent/progress (same as before)"
echo "   GET  /api/night-agent/report (same as before)"
echo "   POST /api/chat (same as before)"
echo "   GET  /api/adk/agent/status (ADK specific)"
echo "   GET  /api/adk/agent/tools (ADK specific)"
echo ""
echo "🚀 Test the agent:"
echo "   curl -X POST http://localhost:4000/api/night-agent/start"
echo ""
echo "🎯 What you get:"
echo "   ✅ Original beautiful UI (Next.js + React)"
echo "   ✅ Same process and execution flow"
echo "   ✅ Same $175/month savings"
echo "   ✅ PLUS: Google ADK framework compliance"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait 