#!/bin/bash

echo "🌅 Life-OS ADK Implementation"
echo "========================================="
echo "✅ Starting ADK Backend & Frontend Servers"
echo "✅ Framework: Google ADK + Flask"
echo "========================================="

# Navigate to ADK directory
cd "$(dirname "$0")"

# Activate virtual environment
source adk_env/bin/activate

# Kill any existing processes on ports 3000 and 4000
echo "🔄 Cleaning up existing processes..."
pkill -f "python3.*adk_backend_server.py" 2>/dev/null
pkill -f "python3.*adk_frontend.py" 2>/dev/null
sleep 2

# Start ADK Backend Server
echo "🚀 Starting ADK Backend Server..."
python3 adk_backend_server.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend
echo "🧪 Testing ADK Backend..."
curl -s http://localhost:4000/api/adk/agent/status > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ ADK Backend is running on http://localhost:4000"
else
    echo "❌ ADK Backend failed to start"
    exit 1
fi

# Start ADK Frontend Server
echo "🎨 Starting ADK Frontend Server..."
python3 adk_frontend.py &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Test frontend
echo "🧪 Testing ADK Frontend..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ ADK Frontend is running on http://localhost:3000"
else
    echo "❌ ADK Frontend failed to start"
    exit 1
fi

echo ""
echo "🎉 ADK Implementation is ready!"
echo "========================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend: http://localhost:4000"
echo "📡 API Endpoints:"
echo "   GET  /api/adk/agent/status"
echo "   POST /api/adk/agent/run"
echo "   GET  /api/adk/agent/progress"
echo "   GET  /api/adk/agent/tools"
echo "   POST /api/adk/agent/stop"
echo ""
echo "🚀 Test the agent:"
echo "   curl -X POST -H 'Content-Type: application/json' -d '{\"task\":\"start night agent\"}' http://localhost:4000/api/adk/agent/run"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait 