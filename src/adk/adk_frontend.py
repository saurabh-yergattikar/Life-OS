#!/usr/bin/env python3
"""
ADK Frontend for Life-OS
Beautiful web interface for ADK agent interaction
"""

from flask import Flask, render_template_string, request, jsonify
import requests
import json
import time

# HTML template for the ADK frontend
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Life-OS ADK Agent</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .card-glow { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                <span class="gradient-bg bg-clip-text text-transparent">Life-OS</span>
                <span class="text-2xl">🌅</span>
            </h1>
            <p class="text-gray-600">ADK Agent Development Kit Implementation</p>
        </div>

        <!-- Agent Status Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6 card-glow">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-gray-800">ADK Agent Status</h2>
                <div class="flex items-center gap-2">
                    <div id="status-indicator" class="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span id="status-text" class="text-sm font-medium text-gray-600">Idle</span>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-50 rounded-lg p-4">
                    <div class="text-2xl font-bold text-blue-600" id="agent-name">Life-OS-Night-Agent</div>
                    <div class="text-sm text-blue-500">Agent Name</div>
                </div>
                <div class="bg-green-50 rounded-lg p-4">
                    <div class="text-2xl font-bold text-green-600" id="agent-model">gemini-1.5-pro</div>
                    <div class="text-sm text-green-500">Model</div>
                </div>
                <div class="bg-purple-50 rounded-lg p-4">
                    <div class="text-2xl font-bold text-purple-600" id="tools-count">5</div>
                    <div class="text-sm text-purple-500">Tools</div>
                </div>
                <div class="bg-orange-50 rounded-lg p-4">
                    <div class="text-2xl font-bold text-orange-600" id="triggers-count">5</div>
                    <div class="text-sm text-orange-500">Triggers</div>
                </div>
            </div>

            <div class="flex gap-4">
                <button id="start-btn" onclick="startAgent()" 
                        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg">
                    🚀 Start ADK Agent
                </button>
                <button id="stop-btn" onclick="stopAgent()" 
                        class="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg" style="display: none;">
                    ⏹️ Stop Agent
                </button>
            </div>
        </div>

        <!-- Progress Section -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Task Progress</h3>
            
            <!-- Progress Bar -->
            <div class="mb-6">
                <div class="flex justify-between text-sm text-gray-600 mb-2">
                    <span id="progress-text">0/6 tasks completed</span>
                    <span id="progress-percentage">0%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div id="progress-bar" class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
            </div>

            <!-- Current Task -->
            <div id="current-task" class="bg-blue-50 rounded-lg p-4 mb-4" style="display: none;">
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                        <div class="font-semibold text-white" id="task-name">Current Task</div>
                        <div class="text-sm text-blue-600" id="task-type">Type</div>
                    </div>
                </div>
            </div>

            <!-- Savings Display -->
            <div class="bg-green-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-lg font-bold text-green-800">Total Savings</div>
                        <div class="text-sm text-green-600">This session</div>
                    </div>
                    <div class="text-3xl font-bold text-green-600" id="total-savings">$0</div>
                </div>
            </div>
        </div>

        <!-- Tools & Triggers -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">🛠️ ADK Tools</h3>
                <div id="tools-list" class="space-y-2">
                    <!-- Tools will be populated here -->
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">⚡ ADK Triggers</h3>
                <div id="triggers-list" class="space-y-2">
                    <!-- Triggers will be populated here -->
                </div>
            </div>
        </div>
    </div>

    <script>
        const ADK_API_BASE = 'http://localhost:4000/api/adk/agent';
        let progressInterval;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadAgentStatus();
            loadToolsAndTriggers();
        });

        async function loadAgentStatus() {
            try {
                const response = await fetch(`${ADK_API_BASE}/status`);
                const data = await response.json();
                
                document.getElementById('agent-name').textContent = data.name;
                document.getElementById('agent-model').textContent = data.model;
                document.getElementById('tools-count').textContent = data.tools;
                document.getElementById('triggers-count').textContent = data.triggers;
                
                updateStatusIndicator(data.status);
            } catch (error) {
                console.error('Error loading agent status:', error);
            }
        }

        async function startAgent() {
            try {
                const response = await fetch(`${ADK_API_BASE}/run`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ task: 'start night agent' })
                });
                
                const data = await response.json();
                console.log('Agent started:', data);
                
                document.getElementById('start-btn').style.display = 'none';
                document.getElementById('stop-btn').style.display = 'inline-block';
                
                updateStatusIndicator('running');
                startProgressTracking();
                
            } catch (error) {
                console.error('Error starting agent:', error);
            }
        }

        async function stopAgent() {
            try {
                const response = await fetch(`${ADK_API_BASE}/stop`, {
                    method: 'POST'
                });
                
                const data = await response.json();
                console.log('Agent stopped:', data);
                
                document.getElementById('start-btn').style.display = 'inline-block';
                document.getElementById('stop-btn').style.display = 'none';
                
                updateStatusIndicator('stopped');
                stopProgressTracking();
                
            } catch (error) {
                console.error('Error stopping agent:', error);
            }
        }

        function updateStatusIndicator(status) {
            const indicator = document.getElementById('status-indicator');
            const text = document.getElementById('status-text');
            
            indicator.className = 'w-3 h-3 rounded-full';
            text.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            
            switch(status) {
                case 'running':
                    indicator.classList.add('bg-green-500', 'animate-pulse');
                    break;
                case 'completed':
                    indicator.classList.add('bg-blue-500');
                    break;
                case 'stopped':
                    indicator.classList.add('bg-red-500');
                    break;
                default:
                    indicator.classList.add('bg-gray-300');
            }
        }

        function startProgressTracking() {
            progressInterval = setInterval(async () => {
                try {
                    const response = await fetch(`${ADK_API_BASE}/progress`);
                    const data = await response.json();
                    
                    updateProgress(data);
                    
                    if (data.status === 'completed') {
                        stopProgressTracking();
                        updateStatusIndicator('completed');
                        document.getElementById('start-btn').style.display = 'inline-block';
                        document.getElementById('stop-btn').style.display = 'none';
                    }
                } catch (error) {
                    console.error('Error tracking progress:', error);
                }
            }, 1000);
        }

        function stopProgressTracking() {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
        }

        function updateProgress(data) {
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            const progressPercentage = document.getElementById('progress-percentage');
            const totalSavings = document.getElementById('total-savings');
            const currentTask = document.getElementById('current-task');
            const taskName = document.getElementById('task-name');
            const taskType = document.getElementById('task-type');
            
            const percentage = (data.completedTasks / data.totalTasks) * 100;
            
            progressBar.style.width = percentage + '%';
            progressText.textContent = `${data.completedTasks}/${data.totalTasks} tasks completed`;
            progressPercentage.textContent = Math.round(percentage) + '%';
            totalSavings.textContent = `$${data.totalSavings}`;
            
            if (data.currentTask) {
                currentTask.style.display = 'block';
                taskName.textContent = data.currentTask.name;
                taskType.textContent = data.currentTask.type.charAt(0).toUpperCase() + data.currentTask.type.slice(1);
            } else {
                currentTask.style.display = 'none';
            }
        }

        async function loadToolsAndTriggers() {
            try {
                const response = await fetch(`${ADK_API_BASE}/tools`);
                const data = await response.json();
                
                const toolsList = document.getElementById('tools-list');
                const triggersList = document.getElementById('triggers-list');
                
                toolsList.innerHTML = data.tools.map(tool => 
                    `<div class="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <span class="text-blue-600">🛠️</span>
                        <div>
                            <div class="font-medium text-blue-800">${tool.name}</div>
                            <div class="text-sm text-blue-600">${tool.description}</div>
                        </div>
                    </div>`
                ).join('');
                
                triggersList.innerHTML = data.triggers.map(trigger => 
                    `<div class="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <span class="text-orange-600">⚡</span>
                        <div>
                            <div class="font-medium text-orange-800">${trigger.condition}</div>
                            <div class="text-sm text-orange-600">→ ${trigger.action}</div>
                        </div>
                    </div>`
                ).join('');
                
            } catch (error) {
                console.error('Error loading tools and triggers:', error);
            }
        }
    </script>
</body>
</html>
"""

class ADKFrontend:
    def __init__(self):
        self.app = Flask(__name__)
        self.setup_routes()
    
    def setup_routes(self):
        @self.app.route('/')
        def index():
            return render_template_string(HTML_TEMPLATE)
        
        @self.app.route('/health')
        def health():
            return jsonify({"status": "healthy", "service": "ADK Frontend"})
    
    def run(self, host='0.0.0.0', port=3000):
        print(f"🎨 ADK Frontend")
        print(f"=========================================")
        print(f"✅ Service: Life-OS ADK Interface")
        print(f"✅ Framework: Flask + Tailwind CSS")
        print(f"🌐 Web UI: http://{host}:{port}")
        print(f"🔗 Backend: http://localhost:4000")
        print(f"=========================================")
        
        self.app.run(host=host, port=port, debug=False)

if __name__ == "__main__":
    frontend = ADKFrontend()
    frontend.run() 