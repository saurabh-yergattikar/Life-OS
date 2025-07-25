import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Use the correct Gemini API scope
const GEMINI_SCOPES = ['https://www.googleapis.com/auth/generative-language'];
// Try the more widely available model name
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

const CREDENTIALS_PATH = path.join(__dirname, '../../gemini-service-account.json');

let credentials: any = null;
if (fs.existsSync(CREDENTIALS_PATH)) {
  credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
} else {
  throw new Error('Gemini service account credentials not found.');
}

const auth = new GoogleAuth({
  credentials,
  scopes: GEMINI_SCOPES,
});

type GeminiResponse = { candidates?: { content: { parts: { text: string }[] } }[] };

export async function geminiChat(prompt: string): Promise<string> {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const response = await axios.post(
    GEMINI_API_URL,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const candidates = (response.data as GeminiResponse).candidates;
  if (candidates && candidates.length > 0) {
    return candidates[0].content.parts[0].text;
  }
  return '[No response from Gemini]';
}

// Enhanced multi-agent functionality
export interface AgentTask {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  result?: string;
  error?: string;
}

export interface MultiAgentResponse {
  acknowledgment: string;
  tasks: AgentTask[];
  summary?: string;
}

export async function analyzeTaskAndCreateAgents(userQuery: string): Promise<MultiAgentResponse> {
  const analysisPrompt = `
You are an AI task orchestrator. Analyze the following user request and break it down into 4 specific, actionable tasks that can be executed by specialized AI agents.

User Request: "${userQuery}"

Please provide:
1. An acknowledgment message for the user
2. 4 specific tasks with descriptive names and clear objectives
3. Each task should be focused and actionable

Format your response as JSON:
{
  "acknowledgment": "Your acknowledgment message",
  "tasks": [
    {
      "id": "task-1",
      "name": "Descriptive task name",
      "description": "Detailed description of what this agent will do"
    },
    {
      "id": "task-2", 
      "name": "Descriptive task name",
      "description": "Detailed description of what this agent will do"
    },
    {
      "id": "task-3",
      "name": "Descriptive task name", 
      "description": "Detailed description of what this agent will do"
    },
    {
      "id": "task-4",
      "name": "Descriptive task name",
      "description": "Detailed description of what this agent will do"
    }
  ]
}

Make sure the tasks are comprehensive and cover all aspects of the user's request. For interview preparation, consider tasks like research, practice, strategy, and preparation.
`;

  try {
    const response = await geminiChat(analysisPrompt);
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      return {
        acknowledgment: parsed.acknowledgment,
        tasks: parsed.tasks.map((task: any) => ({
          ...task,
          status: 'pending' as const,
          progress: 0
        }))
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        acknowledgment: "I understand your request. Let me break this down into actionable tasks.",
        tasks: [
          {
            id: "task-1",
            name: "Research and Analysis",
            description: "Research the company, role requirements, and interview format",
            status: 'pending',
            progress: 0
          },
          {
            id: "task-2", 
            name: "Technical Preparation",
            description: "Prepare technical skills, coding challenges, and system design",
            status: 'pending',
            progress: 0
          },
          {
            id: "task-3",
            name: "Strategy Development", 
            description: "Develop interview strategy, talking points, and questions",
            status: 'pending',
            progress: 0
          },
          {
            id: "task-4",
            name: "Practice and Mock Interviews",
            description: "Set up practice sessions and mock interviews",
            status: 'pending',
            progress: 0
          }
        ]
      };
    }
  } catch (error) {
    throw new Error(`Failed to analyze task: ${error}`);
  }
}

export async function executeAgentTask(task: AgentTask): Promise<AgentTask> {
  const executionPrompt = `
You are a specialized AI agent working on a specific task. Your task details are:

Task Name: ${task.name}
Task Description: ${task.description}

Please execute this task and provide a comprehensive result. Include:
- Detailed analysis and findings
- Specific recommendations
- Actionable next steps
- Resources or tools that might be helpful

Provide a thorough, well-structured response that would be valuable for the user.
`;

  try {
    const result = await geminiChat(executionPrompt);
    return {
      ...task,
      status: 'completed',
      progress: 100,
      result
    };
  } catch (error) {
    return {
      ...task,
      status: 'failed',
      progress: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function generateFinalSummary(tasks: AgentTask[], originalQuery: string): Promise<string> {
  const summaryPrompt = `
Based on the original user query and the completed tasks, provide a comprehensive summary.

Original Query: "${originalQuery}"

Completed Tasks:
${tasks.map(task => `
- ${task.name}: ${task.result || 'Failed to complete'}
`).join('\n')}

Please provide a comprehensive summary that:
1. Acknowledges what was accomplished
2. Highlights key findings and recommendations
3. Provides actionable next steps
4. Offers encouragement and confidence

Make it conversational and helpful.
`;

  try {
    return await geminiChat(summaryPrompt);
  } catch (error) {
    return `Task analysis completed! Here's what we accomplished:\n\n${tasks.map(task => `• ${task.name}: ${task.status === 'completed' ? 'Completed successfully' : 'Encountered issues'}`).join('\n')}\n\nI recommend reviewing each task's results for detailed insights.`;
  }
} 