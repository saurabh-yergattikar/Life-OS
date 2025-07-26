# Life-OS: Agentic AI Architecture

## High-Level Architecture Overview

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

## Component Details

### 1. **Agent Core (Planner)**
- **Location**: `src/adk/enhanced_life_os_agent.py`
- **Purpose**: Orchestrates multi-task execution with ADK patterns
- **Key Features**:
  - Task prioritization based on impact (wealth > health > career)
  - Sequential execution with real-time progress tracking
  - Dynamic task adaptation based on Gemini analysis results

### 2. **Executor (Task Router)**
- **Location**: `src/adk/enhanced_life_os_agent.py` (ADK tools)
- **Purpose**: Handles LLM interactions and external API calls
- **Key Features**:
  - Secure Gemini API integration with Google Auth
  - Multi-turn conversation simulation
  - Error handling and fallback responses

### 3. **Memory Store (Session Management)**
- **Location**: `src/adk/enhanced_life_os_agent.py` (session_state)
- **Purpose**: Maintains conversation context and task state
- **Key Features**:
  - Real-time progress tracking
  - Conversation history preservation
  - Task completion status

### 4. **Tools & APIs Integration**
- **Gemini API**: Primary LLM for analysis and conversation generation
- **Mock Services**: Simulated external APIs (Comcast, Spotify, etc.)
- **File System**: Persistent logging for observability

## Framework Choice Justification

### ADK Implementation Approach
We've implemented Life-OS using **Enhanced ADK** as our primary approach to demonstrate comprehensive understanding of Google's Agent Development Kit.

### ADK Implementation (`src/adk/`)
- **Environment Setup**: Python virtual environment + `pip install google-adk`
- **Agent Definition**: Name, model, description, instructions
- **Tools/Skills**: Wealth, health, career, market tools with triggers
- **Model Configuration**: Gemini API integration
- **Running Options**: Terminal, Web UI, API Server

### Why We Chose Enhanced ADK as Primary?
1. **Direct Alignment**: Follow organizer's ADK guidance exactly
2. **Framework Knowledge**: Demonstrate deep understanding of Google's official framework
3. **Judging Points**: Address all ADK requirements comprehensively
4. **Innovation**: Show how to enhance ADK with custom features
5. **Real-world Impact**: Achieve same $40/month savings with ADK

### Enhanced ADK Features?
1. **Async Execution**: Non-blocking task processing
2. **Progress Tracking**: Real-time updates throughout execution
3. **Comprehensive Logging**: Detailed audit trail
4. **Modular Design**: Easy to extend with new tools and capabilities

## Data Flow

```
User Request → Agent Core → Task Planning → Gemini Analysis → 
Mock API Calls → Result Aggregation → Real-time UI Updates
```

## Security & Observability

- **API Key Management**: Secure Gemini credentials via Google Auth
- **Logging**: Comprehensive logging in `night-agent.log`
- **Error Handling**: Graceful fallbacks for API failures
- **Session Management**: Secure in-memory session state

## Scalability Considerations

- **Modular Task System**: Easy to add new task types
- **API Abstraction**: Clean separation between LLM and external services
- **State Management**: Centralized session state for consistency

