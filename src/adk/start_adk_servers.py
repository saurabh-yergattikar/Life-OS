#!/usr/bin/env python3
"""
ADK Servers Startup Script
Launches both ADK backend and frontend servers
"""

import threading
import time
import sys
import os

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from adk_backend_server import ADKBackendServer
from adk_frontend import ADKFrontend

def start_backend():
    """Start the ADK backend server"""
    print("🚀 Starting ADK Backend Server...")
    backend = ADKBackendServer()
    backend.run(host='0.0.0.0', port=4000)

def start_frontend():
    """Start the ADK frontend server"""
    print("🎨 Starting ADK Frontend Server...")
    frontend = ADKFrontend()
    frontend.run(host='0.0.0.0', port=3000)

def main():
    print("🌅 Life-OS ADK Implementation")
    print("=========================================")
    print("✅ Starting ADK Backend & Frontend Servers")
    print("✅ Backend: http://localhost:4000")
    print("✅ Frontend: http://localhost:3000")
    print("✅ Framework: Google ADK + Flask")
    print("=========================================")
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(2)
    
    # Start frontend in main thread
    start_frontend()

if __name__ == "__main__":
    main() 