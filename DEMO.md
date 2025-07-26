# Life-OS: Demo Guide

## 🎥 Demo Video
**Link**: [Life-OS Demo Video](https://drive.google.com/drive/folders/1tbXbvF7bnUE8QFV4EIO58b1rkFhbj5Gk?dmr=1&ec=wgc-drive-hero-goto)
**Duration**: 5 minutes
**Format**: Screen recording with Camera Video

**Video Files Available**:
- `Life-OS_ODSC_Hackathon_Saurabh_Yergattikar.m4v` (121MB) - Main demo video


## 🚀 Quick Start Demo

### Prerequisites
1. **Google Gemini API Key**: Set up service account credentials
2. **Node.js**: Version 18+ installed
3. **Git**: Clone the repository

### Setup Instructions
```bash
# Clone the repository
git clone https://github.com/saurabh-yergattikar/Life-OS
cd Life-OS

# Install ADK dependencies
cd src/adk
pip install -r requirements.txt

# Set up Gemini credentials
# Place your service account JSON file in src/adk/gemini-service-account.json
# OR set GOOGLE_APPLICATION_CREDENTIALS environment variable
```

### Running the Demo
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

### Demo Flow

#### 1. **Initialization** (0:00 - 0:30)
- Life-OS AI Agent Introduction

#### 2. **Night Agent Tasks** (0:30 - 2:15)
- **Bills Negotiation**
- **Non Used Subscriptions Cancellation**
- **Mock Interview schedule for Upcoming Mock Interview**
- **Doctor Appointment Book for Health concern**
- **Massage Appointment Book**
- **Apply for Job Postings**
- **Stocks Portfolio Analysis**

- **Gemini Integration**: AI generates negotiation script
- **Result**: $30/month savings achieved & Similar for Each Task
- **Key Features**:
  - Step-by-step progress visualization
  - Live chat simulation
  - Intelligent negotiation strategy

#### 3. **User's Home Page** (2:15 - 2:40)
- **Dashboard showing Actions Taken by Agent**


#### 4. **Chat with AI Agent to take Actions** (2:40 - 5:00)
- **Chat with AI Agent (powered by Gemini) and Agent takes Actions**
- **Chat for help to Prepare for Google Interview**
- **Chat to manage Emergency in Family and Notify Colleagues**
- **Agent initiates Restaurant booking for User's dinner with spouse**


## 🎯 Key Demo Points

### Technical Excellence
- **Real-time Progress**: Live updates throughout execution
- **Error Handling**: Graceful fallbacks for API failures
- **Responsive UI**: Modern, intuitive interface

### Innovative Gemini Integration
- **Multi-domain Analysis**: Wealth, health, career, and market
- **Context-aware Prompts**: Domain-specific interactions
- **Conversation Generation**: Realistic chat simulations

### Societal Impact
- **Financial Savings**: $40/month potential savings
- **Health Optimization**: Sleep and wellness improvements
- **Career Advancement**: Interview preparation and job opportunities
- **Market Intelligence**: Investment optimization

## 🔧 Demo Configuration

### Environment Variables
```bash
# Backend configuration
GOOGLE_APPLICATION_CREDENTIALS=src/backend/gemini-service-account.json
PORT=3001
```

### Mock Services
The demo includes realistic mock services:
- **Comcast Support**: Bill negotiation simulation
- **Spotify Support**: Subscription cancellation
- **Massage Provider**: Wellness appointment booking
- **Interview Coach**: Career preparation services

## 📊 Expected Results

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

## 🎬 Video Timestamps

#### 1. **Initialization** (0:00 - 0:30)
- Life-OS AI Agent Introduction

#### 2. **Night Agent Tasks** (0:30 - 2:15)
- **Bills Negotiation**
- **Non Used Subscriptions Cancellation**
- **Mock Interview schedule for Upcoming Mock Interview**
- **Doctor Appointment Book for Health concern**
- **Massage Appointment Book**
- **Apply for Job Postings**
- **Stocks Portfolio Analysis**

- **Gemini Integration**: AI generates negotiation script
- **Result**: $30/month savings achieved & Similar for Each Task
- **Key Features**:
  - Step-by-step progress visualization
  - Live chat simulation
  - Intelligent negotiation strategy

#### 3. **User's Home Page** (2:15 - 2:40)
- **Dashboard showing Actions Taken by Agent**


#### 4. **Chat with AI Agent to take Actions** (2:40 - 5:00)
- **Chat with AI Agent (powered by Gemini) and Agent takes Actions**
- **Chat for help to Prepare for Google Interview**
- **Chat to manage Emergency in Family and Notify Colleagues**
- **Agent initiates Restaurant booking for User's dinner with spouse**

## 🏆 Judging Criteria Alignment

### Technical Excellence ✅
- Robust error handling and fallbacks
- Real-time progress tracking
- Comprehensive logging and observability

### Solution Architecture ✅
- Clear component separation
- Modular design for extensibility
- Well-documented codebase

### Innovative Gemini Integration ✅
- Multi-domain AI analysis
- Context-aware prompt engineering
- Realistic conversation simulation

### Societal Impact ✅
- Tangible financial savings
- Health and wellness improvements
- Career advancement opportunities
- Market intelligence benefits 
