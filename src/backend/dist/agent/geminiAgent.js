"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiChat = geminiChat;
exports.analyzeTaskAndCreateAgents = analyzeTaskAndCreateAgents;
exports.executeAgentTask = executeAgentTask;
exports.generateFinalSummary = generateFinalSummary;
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Use the correct Gemini API scope
const GEMINI_SCOPES = ['https://www.googleapis.com/auth/generative-language'];
// Try the more widely available model name
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
const CREDENTIALS_PATH = path_1.default.join(__dirname, '../../gemini-service-account.json');
let credentials = null;
if (fs_1.default.existsSync(CREDENTIALS_PATH)) {
    credentials = JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, 'utf8'));
}
else {
    throw new Error('Gemini service account credentials not found.');
}
const auth = new google_auth_library_1.GoogleAuth({
    credentials,
    scopes: GEMINI_SCOPES,
});
async function geminiChat(prompt) {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const body = {
        contents: [{ parts: [{ text: prompt }] }],
    };
    const response = await axios_1.default.post(GEMINI_API_URL, body, {
        headers: {
            Authorization: `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
        },
    });
    const candidates = response.data.candidates;
    if (candidates && candidates.length > 0) {
        return candidates[0].content.parts[0].text;
    }
    return '[No response from Gemini]';
}
async function analyzeTaskAndCreateAgents(userQuery) {
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
                tasks: parsed.tasks.map((task) => ({
                    ...task,
                    status: 'pending',
                    progress: 0
                }))
            };
        }
        catch (parseError) {
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
    }
    catch (error) {
        throw new Error(`Failed to analyze task: ${error}`);
    }
}
async function executeAgentTask(task) {
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
    }
    catch (error) {
        return {
            ...task,
            status: 'failed',
            progress: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
async function generateFinalSummary(tasks, originalQuery) {
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
    }
    catch (error) {
        return `Task analysis completed! Here's what we accomplished:\n\n${tasks.map(task => `• ${task.name}: ${task.status === 'completed' ? 'Completed successfully' : 'Encountered issues'}`).join('\n')}\n\nI recommend reviewing each task's results for detailed insights.`;
    }
}
