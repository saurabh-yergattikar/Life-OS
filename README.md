# Life-OS: Agentic AI for Personal Life Optimization

> **An intelligent AI agent that optimizes your life throughout Day & While you sleep** 💤

Life-OS is a sophisticated agentic AI system that autonomously manages personal tasks across wealth, health, career, and market domains using Google Gemini 1.5 Pro. The agent works overnight to negotiate bills, cancel unused subscriptions, book wellness appointments, prepare for interviews, and analyze investment opportunities.

## 🏆 Agentic AI Hackathon Submission

**Team Name**: Life-OS Team  
**Team Captain**: Saurabh Yergattikar  
**Repository**: https://github.com/saurabh-yergattikar/Life-OS
**Demo Video**: [Life-OS Demo Video](https://drive.google.com/drive/folders/1tbXbvF7bnUE8QFV4EIO58b1rkFhbj5Gk?dmr=1&ec=wgc-drive-hero-goto)

## 🏆 Hackathon Submission

### Judging Criteria Alignment

| Criteria | Our Implementation | Score |
|----------|-------------------|-------|
| **Technical Excellence** | Robust error handling, real-time progress, comprehensive logging | ✅ |
| **Solution Architecture** | Modular design, clear documentation, extensible framework | ✅ |
| **Innovative Gemini Integration** | Multi-domain analysis, context-aware prompts, realistic conversations | ✅ |
| **Societal Impact** | $40/month savings, health optimization, career advancement | ✅ |

### Framework Choice Justification

**Primary Approach - Enhanced ADK**: We've chosen **Enhanced ADK as our primary demo** to directly align with organizer guidance and demonstrate comprehensive understanding of Google's Agent Development Kit.

**Enhanced ADK Implementation**: See `src/adk/enhanced_life_os_agent.py` for our primary demo
- **Environment Setup**: Python virtual environment + `pip install google-adk`
- **Agent Definition**: Name, model, description, instructions
- **Tools/Skills**: Wealth, health, career, market tools with triggers
- **Model Configuration**: Gemini API integration
- **Running Options**: Terminal, Web UI, API Server
- **Enhanced Features**: Async execution, progress tracking, comprehensive logging

**Why We Chose Enhanced ADK as Primary:**
- **✅ Direct Alignment**: Follow organizer's ADK guidance exactly
- **✅ Framework Knowledge**: Demonstrate deep understanding of Google's official framework
- **✅ Judging Points**: Address all ADK requirements comprehensively
- **✅ Innovation**: Show how to enhance ADK with custom features
- **✅ Real-world Impact**: Achieve same $40/month savings with ADK



## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+ (for ADK implementation)
- Google Gemini API credentials
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/saurabh-yergattikar/Life-OS
cd Life-OS

# Install frontend dependencies
npm install

# Install backend dependencies
cd src/backend
npm install

# Set up Gemini credentials
# Place your service account JSON file in src/backend/gemini-service-account.json
# OR set GOOGLE_APPLICATION_CREDENTIALS environment variable

# For ADK implementation (optional)
cd src/adk
pip install -r requirements.txt
```

### Running the Application

#### ADK Implementation (Primary)
```bash
# Navigate to ADK directory
cd src/adk

# Run the enhanced ADK agent
python enhanced_life_os_agent.py

# Or run with web UI
python -m google_adk.web --agent enhanced_life_os_agent.py

# Or run with API server
python adk_enhanced_backend.py
```

#### ADK with Frontend
```bash
# Run the ADK backend
cd src/adk
python adk_hybrid_backend.py

# Start frontend
npm run dev
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    LIFE-OS AGENTIC AI SYSTEM                  │
├─────────────────────────────────────────────────────────────────┤
│  Enhanced ADK Implementation                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Agent Core    │  │   Task Router   │  │   Memory Store  │ │
│  │   (Planner)     │  │   (Executor)    │  │   (Session)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ADK Tools & Triggers                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Wealth Tools   │  │  Health Tools   │  │  Career Tools   │ │
│  │  (Bill Negot.)  │  │  (Wellness)     │  │  (Interview)    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Agent Core    │  │   Task Router   │  │   Memory Store  │ │
│  │   (Planner)     │  │   (Executor)    │  │   (Session)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  External APIs & Tools                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Google Gemini  │  │  Mock Services  │  │  File System    │ │
│  │  (LLM Engine)   │  │  (Chat APIs)    │  │  (Logging)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Features

### 🤖 Intelligent Task Orchestration
- **Impact-based Prioritization**: Tasks ordered by potential savings
- **Multi-domain Coverage**: Wealth, health, career, and market optimization
- **Real-time Progress**: Live updates throughout execution
- **Context-aware Prompts**: Domain-specific Gemini interactions

### 💰 Wealth Management
- **Bill Negotiation**: Automated Comcast bill reduction ($30/month savings)
- **Subscription Optimization**: Cancel unused services ($10/month savings)
- **Investment Analysis**: Portfolio review and recommendations

### 🏥 Health & Wellness
- **Sleep Analysis**: Personalized recommendations based on patterns
- **Wellness Booking**: Automated massage appointment scheduling
- **Health Monitoring**: Activity tracking and improvement suggestions

### 🚀 Career Development
- **Interview Preparation**: Latest Google interview questions and tips
- **Mock Interviews**: Automated booking of practice sessions
- **Job Scanning**: Market opportunity analysis

### 📈 Market Intelligence
- **Portfolio Review**: AAPL, TSLA, NVDA, AMZN analysis
- **Investment Recommendations**: Data-driven buy/sell suggestions
- **Market Trends**: Global financial market insights

## 🔧 Technical Implementation

### Agent Workflow
1. **User Input Reception**: Session initialization and task queue creation
2. **Task Planning**: Impact-based prioritization and execution timeline
3. **LLM-Powered Analysis**: Gemini API calls for domain-specific analysis
4. **Tool Integration**: Mock service interactions for realistic scenarios
5. **Result Aggregation**: Comprehensive reporting with total impact

### Key Modules
- **Planner** (`enhanced_life_os_agent.py`): Orchestrates multi-task execution with ADK patterns
- **Executor** (`geminiAgent.ts`): Handles LLM interactions and API calls
- **Memory Store**: Session-based state management and progress tracking

### Tool Integration
- **Google Gemini API**: Primary LLM for analysis and conversation generation
- **Mock Services**: Realistic external API simulations
- **File System**: Comprehensive logging and observability

## 📊 Demo Results

### Financial Impact
- **Bill Negotiation**: $30/month savings
- **Subscription Cancellation**: $10/month savings
- **Total Monthly Savings**: $40

### Health & Wellness
- **Sleep Analysis**: Personalized recommendations
- **Wellness Booking**: Massage appointment scheduled
- **Health Score**: Improved sleep and activity patterns

### Career Development
- **Interview Prep**: Latest Google interview questions
- **Mock Interview**: Scheduled practice session
- **Career Opportunities**: Job market analysis

### Market Intelligence
- **Portfolio Review**: AAPL, TSLA, NVDA, AMZN analysis
- **Investment Recommendations**: Buy recommendation for NVDA
- **Market Trends**: Global financial market insights

## 📁 Project Structure

```
Life-OS/
├── src/
│   └── adk/                   # Enhanced ADK implementation
│       ├── enhanced_life_os_agent.py  # Primary ADK agent
│       ├── life_os_agent.py           # Basic ADK implementation
│       ├── adk_enhanced_backend.py    # ADK API server
│       ├── adk_hybrid_backend.py      # ADK with frontend
│       ├── requirements.txt            # Python dependencies
│       └── README.md                  # ADK documentation
├── ARCHITECTURE.md            # System architecture
├── EXPLANATION.md             # Technical implementation
├── DEMO.md                   # Demo guide and video
└── README.md                 # This file
```

## 📦 Dependencies

### ADK Dependencies (Primary)
- google-adk
- google-generativeai
- fastapi
- uvicorn
- python-dotenv

### Frontend Dependencies (Optional)
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS



## 🔍 Observability

### Comprehensive Logging
- **Location**: `src/backend/night-agent.log`
- **Content**: All API calls, task progress, errors, and decisions
- **Format**: Timestamped entries for easy debugging

### Real-time Progress Tracking
- **Frontend**: Live updates via polling
- **Backend**: Session state with task completion status
- **UI**: Visual progress indicators and step-by-step updates

## 🚨 Known Limitations

### Performance Constraints
- **Sequential Execution**: Tasks run one at a time (could be parallelized)
- **In-memory State**: Session data lost on server restart
- **Mock Services**: Limited to predefined scenarios

### API Dependencies
- **Gemini API**: Requires valid Google service account credentials
- **Rate Limits**: Potential API throttling with high usage
- **Network Latency**: External API calls may slow down execution



---

**Built with ❤️ for the Agentic AI App Hackathon**


