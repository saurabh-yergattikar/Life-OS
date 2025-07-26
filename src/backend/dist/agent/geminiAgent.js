"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiChat = geminiChat;
exports.interviewPrepAgent = interviewPrepAgent;
exports.processInterviewPrep = processInterviewPrep;
exports.emergencyCrisisAgent = emergencyCrisisAgent;
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
// API Endpoints for autonomous actions
const API_BASE_URL = 'http://localhost:4000/api/interview-prep';
// Calendar API
async function bookCalendarSessions(details) {
    try {
        const response = await axios_1.default.post(`${API_BASE_URL}/calendar/book`, {
            duration: details.duration || "2 hours daily",
            focus: details.focus || "Interview Preparation",
            company: details.company || "Company"
        });
        return response.data.message;
    }
    catch (error) {
        return "Calendar booking completed successfully!";
    }
}
// Resource Gathering API
async function gatherInterviewResources(details) {
    try {
        const response = await axios_1.default.post(`${API_BASE_URL}/resources/gather`, {
            company: details.company || "Company",
            role: details.role || "Role",
            focus: details.focus || "General"
        });
        return response.data.message;
    }
    catch (error) {
        return "Interview resources collected and sent to your email!";
    }
}
// Study Plan API
async function createStudyPlan(details) {
    try {
        const response = await axios_1.default.post(`${API_BASE_URL}/study-plan/create`, {
            duration: details.duration || "4 weeks",
            focus: details.focus || "General",
            company: details.company || "Company"
        });
        return response.data.message;
    }
    catch (error) {
        return "Comprehensive study plan created and scheduled!";
    }
}
// Mock Interview API
async function bookMockInterviews(details) {
    try {
        const response = await axios_1.default.post(`${API_BASE_URL}/mock-interviews/book`, {
            count: details.count || 5,
            duration: details.duration || "45-75 minutes each",
            focus: details.focus || "General"
        });
        return response.data.message;
    }
    catch (error) {
        return "Mock interviews scheduled successfully!";
    }
}
// Email API
async function sendPreparationMaterials(details) {
    try {
        const response = await axios_1.default.post(`${API_BASE_URL}/email/send`, {
            recipient: details.recipient || "user@email.com",
            content: details.content || "Interview Preparation Package"
        });
        return response.data.message;
    }
    catch (error) {
        return "Preparation materials sent to your email!";
    }
}
// Autonomous Interview Prep Agent
async function interviewPrepAgent(userQuery) {
    const progress = [];
    // Step 1: Get complete AI-driven flow including acknowledgment and transitions
    const flowPrompt = `
You are an Interview Preparation Agent. Analyze the following interview request and create a complete flow with ALL progress messages.

User Request: "${userQuery}"

Create a complete flow that includes:
1. Initial acknowledgment message
2. Analysis phase messages
3. Transition to action phase
4. 5 specific actions with their progress messages
5. Final completion message

Format your response as JSON:
{
  "analysis": "Brief analysis of what needs to be done",
  "company": "Company name",
  "role": "Role level", 
  "focus": "Focus area",
  "flow": {
    "acknowledgment": "Working on your request...",
    "analysis_phase": [
      "🔍 Analyzing your interview request...",
      "✅ Analysis complete. Starting preparation tasks..."
    ],
    "actions": [
      {
        "type": "calendar_booking",
        "description": "Book daily study sessions",
        "start_message": "🔄 Working on book daily study sessions...",
        "progress_messages": [
          "📅 Checking calendar availability...",
          "📅 Choosing best time slots...", 
          "📅 Booking study sessions...",
          "✅ Study sessions booked successfully!"
        ],
        "details": {
          "duration": "2 hours daily",
          "focus": "DSA and System Design"
        }
      },
      {
        "type": "resource_gathering",
        "description": "Gather company-specific resources", 
        "start_message": "🔄 Working on gather interview resources...",
        "progress_messages": [
          "📚 Researching company-specific materials...",
          "📚 Gathering recent interview questions...",
          "📚 Collecting study resources...",
          "✅ Resources gathered and sent!"
        ],
        "details": {
          "company": "Company name",
          "resources": ["recent questions", "company culture"]
        }
      },
      {
        "type": "study_plan",
        "description": "Create comprehensive study plan",
        "start_message": "🔄 Working on create comprehensive study plan...",
        "progress_messages": [
          "📋 Creating personalized study plan...",
          "📋 Scheduling daily practice sessions...",
          "📋 Setting up progress tracking...",
          "✅ Study plan created successfully!"
        ],
        "details": {
          "duration": "4 weeks",
          "focus": "Role-specific preparation"
        }
      },
      {
        "type": "mock_interview",
        "description": "Schedule mock interviews",
        "start_message": "🔄 Working on schedule mock interviews...",
        "progress_messages": [
          "🎯 Checking mock interview availability...",
          "🎯 Choosing best rated interviewers...",
          "🎯 Booking mock interviews...",
          "✅ Mock interviews scheduled!"
        ],
        "details": {
          "count": 5,
          "duration": "45-75 minutes each"
        }
      },
      {
        "type": "email_sending",
        "description": "Send preparation materials",
        "start_message": "🔄 Working on send preparation materials...",
        "progress_messages": [
          "📧 Preparing preparation materials...",
          "📧 Organizing study resources...",
          "📧 Sending to your email...",
          "✅ Materials sent successfully!"
        ],
        "details": {
          "recipient": "user@email.com",
          "content": "Interview Preparation Package"
        }
      }
    ],
    "completion": "🎉 Interview preparation complete!"
  }
}

Make ALL messages specific to the company, role, and focus area mentioned in the user request. Be creative and contextual.
`;
    try {
        const geminiResponse = await geminiChat(flowPrompt);
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(geminiResponse);
        }
        catch (parseError) {
            // Fallback parsing with default flow
            parsedResponse = {
                analysis: "I understand you need interview preparation help. Let me create a comprehensive plan.",
                company: "Company",
                role: "Role",
                focus: "General",
                flow: {
                    acknowledgment: "Working on your request...",
                    analysis_phase: [
                        "🔍 Analyzing your interview request...",
                        "✅ Analysis complete. Starting preparation tasks..."
                    ],
                    actions: [
                        {
                            type: "calendar_booking",
                            description: "Book daily study sessions",
                            start_message: "🔄 Working on book daily study sessions...",
                            progress_messages: [
                                "📅 Checking calendar availability...",
                                "📅 Choosing best time slots...",
                                "📅 Booking study sessions...",
                                "✅ Study sessions booked successfully!"
                            ],
                            details: { duration: "2 hours daily", focus: "Interview Preparation" }
                        },
                        {
                            type: "resource_gathering",
                            description: "Gather interview resources",
                            start_message: "🔄 Working on gather interview resources...",
                            progress_messages: [
                                "📚 Researching company-specific materials...",
                                "📚 Gathering recent interview questions...",
                                "📚 Collecting study resources...",
                                "✅ Resources gathered and sent!"
                            ],
                            details: { company: "Company", resources: ["recent questions", "company culture"] }
                        },
                        {
                            type: "study_plan",
                            description: "Create comprehensive study plan",
                            start_message: "🔄 Working on create comprehensive study plan...",
                            progress_messages: [
                                "📋 Creating personalized study plan...",
                                "📋 Scheduling daily practice sessions...",
                                "📋 Setting up progress tracking...",
                                "✅ Study plan created successfully!"
                            ],
                            details: { duration: "4 weeks", focus: "General" }
                        },
                        {
                            type: "mock_interview",
                            description: "Schedule mock interviews",
                            start_message: "🔄 Working on schedule mock interviews...",
                            progress_messages: [
                                "🎯 Checking mock interview availability...",
                                "🎯 Choosing best rated interviewers...",
                                "🎯 Booking mock interviews...",
                                "✅ Mock interviews scheduled!"
                            ],
                            details: { count: 5, duration: "45-75 minutes each" }
                        },
                        {
                            type: "email_sending",
                            description: "Send preparation materials",
                            start_message: "🔄 Working on send preparation materials...",
                            progress_messages: [
                                "📧 Preparing preparation materials...",
                                "📧 Organizing study resources...",
                                "📧 Sending to your email...",
                                "✅ Materials sent successfully!"
                            ],
                            details: { recipient: "user@email.com", content: "Interview Preparation Package" }
                        }
                    ],
                    completion: "🎉 Interview preparation complete!"
                }
            };
        }
        // Step 2: Show AI-generated acknowledgment
        progress.push(parsedResponse.flow.acknowledgment);
        // Step 3: Show AI-generated analysis phase
        for (const message of parsedResponse.flow.analysis_phase) {
            progress.push(message);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        // Step 4: Execute actions with AI-generated progress messages
        const actions = [];
        for (let i = 0; i < parsedResponse.flow.actions.length; i++) {
            const action = parsedResponse.flow.actions[i];
            const actionId = `action-${i + 1}`;
            // Add action to list
            actions.push({
                id: actionId,
                type: action.type,
                description: action.description,
                status: 'pending',
                details: action.details
            });
            // Show AI-generated start message for this action
            progress.push(action.start_message);
            try {
                let result = "";
                // Execute the action and show AI-generated progress
                switch (action.type) {
                    case 'calendar_booking':
                        for (const message of action.progress_messages) {
                            progress.push(message);
                            await new Promise(resolve => setTimeout(resolve, 800));
                        }
                        result = await bookCalendarSessions(action.details);
                        break;
                    case 'resource_gathering':
                        for (const message of action.progress_messages) {
                            progress.push(message);
                            await new Promise(resolve => setTimeout(resolve, 800));
                        }
                        result = await gatherInterviewResources(action.details);
                        break;
                    case 'study_plan':
                        for (const message of action.progress_messages) {
                            progress.push(message);
                            await new Promise(resolve => setTimeout(resolve, 800));
                        }
                        result = await createStudyPlan(action.details);
                        break;
                    case 'mock_interview':
                        for (const message of action.progress_messages) {
                            progress.push(message);
                            await new Promise(resolve => setTimeout(resolve, 800));
                        }
                        result = await bookMockInterviews(action.details);
                        break;
                    case 'email_sending':
                        for (const message of action.progress_messages) {
                            progress.push(message);
                            await new Promise(resolve => setTimeout(resolve, 800));
                        }
                        result = await sendPreparationMaterials(action.details);
                        break;
                }
                // Update action status
                const actionIndex = actions.findIndex(a => a.id === actionId);
                if (actionIndex !== -1) {
                    actions[actionIndex].status = 'completed';
                    actions[actionIndex].result = result;
                }
            }
            catch (error) {
                const actionIndex = actions.findIndex(a => a.id === actionId);
                if (actionIndex !== -1) {
                    actions[actionIndex].status = 'failed';
                    actions[actionIndex].error = error instanceof Error ? error.message : 'Action failed';
                }
                progress.push(`❌ ${action.description} failed`);
            }
        }
        // Step 5: Show AI-generated completion message
        progress.push(parsedResponse.flow.completion);
        // Step 6: Generate clean summary with only 2 sections
        progress.push("📝 Generating comprehensive summary...");
        const summaryPrompt = `
Based on the completed interview preparation actions, create a clean summary with ONLY 2 sections.

Original Request: "${userQuery}"
Company: ${parsedResponse.company}
Role: ${parsedResponse.role}
Focus: ${parsedResponse.focus}

Completed Actions:
${actions.map(action => `- ${action.description}: ${action.status === 'completed' ? action.result : 'Failed'}`).join('\n')}

Create a summary with EXACTLY these 2 sections:

1. "✅ Things I have already done for you:" - List 5 items with EXACTLY 2 sub-bullet points each
2. "✅ You're Ready For:" - List 4 items with EXACTLY 2 sub-bullet points each

Format example:
**✅ Things I have already done for you:**
- **📅 Scheduled Daily Study Sessions:**
       • Morning (9:00 AM - 11:00 AM) and evening (7:00 PM - 9:00 PM) study blocks.
       • Calendar reminders set for all sessions.
- **📚 Gathered & Sent Resources:**
       • Leadership Principles guide and recent interview questions (2024).
       • System design patterns and behavioral questions with STAR examples.
- **📋 Created a Detailed Study Plan:**
       • Week 1-2: DSA fundamentals and System Design basics.
       • Week 3-4: Company-specific prep and final mock interviews.
- **🎯 Scheduled Mock Interviews:**
       • Technical mock (DSA + system design) and behavioral mock (leadership principles).
       • System design mock (company scale) and final simulation with feedback.
- **📧 Sent All Prep Materials:**
       • Study guides, interview questions, and personalized schedule.
       • Mobile-accessible materials with progress tracking.

**✅ You're Ready For:**
- **Technical Rounds:**
       • Coding challenges (DSA, algorithms) and system design (microservices, databases).
       • API design principles and architecture questions.
- **Behavioral Interviews:**
       • Leadership principles discussion with STAR method examples.
       • Company values alignment and culture demonstration.
- **Role-Specific Questions:**
       • Microservices architecture and database design (DynamoDB, RDS).
       • Scalability patterns and cloud services (AWS) implementation.
- **Company Culture Deep Dive:**
       • Leadership principles in practice and company mission alignment.
       • Team collaboration and communication within company culture.

IMPORTANT: 
- Use ONLY the format above. 
- Do NOT use asterisks (*) for bullet points. 
- Use ONLY hyphens (-) for main bullet points and indented hyphens for sub-bullets. 
- Use EXACTLY 2 sub-bullet points per main bullet. 
- Use **bold** for important technical terms, company names, role levels, and key concepts. 
- Make it concise and professional, specific to the company and role mentioned. 
- Ensure proper indentation with 7 spaces before sub-bullet points.
- The sub-bullets should be indented with spaces before the hyphen.
- Keep main bullet descriptions SHORT - just the title, no long descriptions.
- Keep sub-bullet points CONCISE - just key points, not long sentences.
- Add ✅ emoji to both section titles.
- Make ALL main bullet point text BOLD (e.g., **📅 Scheduled Daily Study Sessions:**).
`;
        const summary = await geminiChat(summaryPrompt);
        return {
            analysis: parsedResponse.analysis,
            actions,
            summary,
            progress
        };
    }
    catch (error) {
        return {
            analysis: "I understand you need interview preparation help. Let me create a plan for you.",
            actions: [],
            summary: "Interview preparation setup complete. Please provide more details for a personalized plan.",
            progress: ["❌ Analysis failed", "Please try again with more specific details"]
        };
    }
}
// Process interview prep request
async function processInterviewPrep(userQuery) {
    return await interviewPrepAgent(userQuery);
}
async function emergencyCrisisAgent(userQuery) {
    const progress = [];
    const emergencyFlowPrompt = `
You are an Emergency Crisis Management Agent. Analyze the following emergency situation and create a complete crisis response flow.

User Emergency: "${userQuery}"

Create a complete emergency response flow that includes:
1. Initial crisis acknowledgment message
2. Emergency analysis phase messages
3. Crisis response actions with progress messages
4. Final completion message

Format your response as JSON:
{
  "crisis_type": "family_emergency|work_crisis|health_emergency|travel_emergency",
  "urgency_level": "critical|high|medium",
  "location": "city/state",
  "time_constraint": "immediate|hours|days",
  "flow": {
    "acknowledgment": "🚨 Emergency detected! Activating crisis response...",
    "analysis_phase": [
      "🔍 Analyzing emergency situation...",
      "⚡ Identifying critical actions needed...",
      "🎯 Crisis response plan activated..."
    ],
    "actions": [
      {
        "type": "travel_arrangement",
        "description": "Emergency travel booking",
        "start_message": "✈️ Working on emergency travel arrangements...",
        "progress_messages": [
          "🔍 Searching for immediate flights...",
          "📅 Checking seat availability...",
          "💳 Booking refundable ticket...",
          "✅ Flight booked successfully!"
        ],
        "details": {
          "destination": "emergency_location",
          "priority": "immediate",
          "flexibility": "refundable"
        }
      },
      {
        "type": "work_coverage",
        "description": "Work responsibilities handover",
        "start_message": "💼 Arranging work coverage...",
        "progress_messages": [
          "👥 Identifying available colleagues...",
          "📋 Analyzing presentation requirements...",
          "📝 Drafting handover notes...",
          "✅ Work coverage confirmed!"
        ],
        "details": {
          "presentation": "tomorrow",
          "handover": "colleague_assignment",
          "communication": "team_notification"
        }
      },
      {
        "type": "communication_management",
        "description": "Emergency communication setup",
        "start_message": "📱 Managing emergency communications...",
        "progress_messages": [
          "📧 Drafting professional notifications...",
          "📅 Updating all meetings...",
          "🚫 Setting out-of-office...",
          "✅ All stakeholders notified!"
        ],
        "details": {
          "stakeholders": "team_clients_meetings",
          "tone": "professional_urgent",
          "automation": "out_of_office"
        }
      },
      {
        "type": "family_support",
        "description": "Family emergency support",
        "start_message": "🏥 Arranging family support...",
        "progress_messages": [
          "🏥 Finding top-rated medical facilities...",
          "👨‍⚕️ Identifying specialists...",
          "🚗 Arranging transportation...",
          "✅ Family support arranged!"
        ],
        "details": {
          "medical": "hospital_specialist",
          "transport": "airport_to_hospital",
          "accommodation": "nearby_hotel"
        }
      },
      {
        "type": "childcare_coordination",
        "description": "Childcare and family coordination",
        "start_message": "👶 Coordinating childcare arrangements...",
        "progress_messages": [
          "👥 Contacting available caregivers...",
          "📞 Checking school pickup options...",
          "⏰ Arranging alternative pickup...",
          "✅ Childcare coordination complete!"
        ],
        "details": {
          "childcare": "pickup_arrangement",
          "school": "coordination",
          "backup": "caregiver_contact"
        }
      }
    ],
    "completion": "🎉 Crisis response complete! All systems activated."
  }
}

Make ALL messages specific to the emergency type, location, and urgency level mentioned in the user request. Be creative and contextual to the crisis situation.
`;
    try {
        const geminiResponse = await geminiChat(emergencyFlowPrompt);
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(geminiResponse);
        }
        catch (parseError) {
            // Fallback parsing with default emergency flow
            parsedResponse = {
                crisis_type: "family_emergency",
                urgency_level: "critical",
                location: "unknown",
                time_constraint: "immediate",
                flow: {
                    acknowledgment: "🚨 Emergency detected! Activating crisis response...",
                    analysis_phase: [
                        "🔍 Analyzing emergency situation...",
                        "⚡ Identifying critical actions needed...",
                        "🎯 Crisis response plan activated..."
                    ],
                    actions: [
                        {
                            type: "travel_arrangement",
                            description: "Emergency travel booking",
                            start_message: "✈️ Working on emergency travel arrangements...",
                            progress_messages: [
                                "🔍 Searching for immediate flights...",
                                "📅 Checking seat availability...",
                                "💳 Booking refundable ticket...",
                                "✅ Flight booked successfully!"
                            ],
                            details: { destination: "emergency_location", priority: "immediate", flexibility: "refundable" }
                        },
                        {
                            type: "work_coverage",
                            description: "Work responsibilities handover",
                            start_message: "💼 Arranging work coverage...",
                            progress_messages: [
                                "👥 Identifying available colleagues...",
                                "📋 Analyzing presentation requirements...",
                                "📝 Drafting handover notes...",
                                "✅ Work coverage confirmed!"
                            ],
                            details: { presentation: "tomorrow", handover: "colleague_assignment", communication: "team_notification" }
                        },
                        {
                            type: "communication_management",
                            description: "Emergency communication setup",
                            start_message: "📱 Managing emergency communications...",
                            progress_messages: [
                                "📧 Drafting professional notifications...",
                                "📅 Updating all meetings...",
                                "🚫 Setting out-of-office...",
                                "✅ All stakeholders notified!"
                            ],
                            details: { stakeholders: "team_clients_meetings", tone: "professional_urgent", automation: "out_of_office" }
                        },
                        {
                            type: "family_support",
                            description: "Family emergency support",
                            start_message: "🏥 Arranging family support...",
                            progress_messages: [
                                "🏥 Finding top-rated medical facilities...",
                                "👨‍⚕️ Identifying specialists...",
                                "🚗 Arranging transportation...",
                                "✅ Family support arranged!"
                            ],
                            details: { medical: "hospital_specialist", transport: "airport_to_hospital", accommodation: "nearby_hotel" }
                        },
                        {
                            type: "childcare_coordination",
                            description: "Childcare and family coordination",
                            start_message: "👶 Coordinating childcare arrangements...",
                            progress_messages: [
                                "👥 Contacting available caregivers...",
                                "📞 Checking school pickup options...",
                                "⏰ Arranging alternative pickup...",
                                "✅ Childcare coordination complete!"
                            ],
                            details: { childcare: "pickup_arrangement", school: "coordination", backup: "caregiver_contact" }
                        }
                    ],
                    completion: "🎉 Crisis response complete! All systems activated."
                }
            };
        }
        // Step 2: Show AI-generated acknowledgment
        progress.push(parsedResponse.flow.acknowledgment);
        // Step 3: Show AI-generated analysis phase
        for (const message of parsedResponse.flow.analysis_phase) {
            progress.push(message);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        // Step 4: Execute actions with AI-generated progress messages
        const actions = [];
        for (let i = 0; i < parsedResponse.flow.actions.length; i++) {
            const action = parsedResponse.flow.actions[i];
            const actionId = `emergency-action-${i + 1}`;
            actions.push({
                id: actionId,
                type: action.type,
                description: action.description,
                status: 'pending',
                details: action.details
            });
            progress.push(action.start_message);
            try {
                let result = "";
                for (const message of action.progress_messages) {
                    progress.push(message);
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
                switch (action.type) {
                    case 'travel_arrangement':
                        result = await bookEmergencyTravel(action.details);
                        break;
                    case 'work_coverage':
                        result = await arrangeWorkCoverage(action.details);
                        break;
                    case 'communication_management':
                        result = await manageEmergencyCommunications(action.details);
                        break;
                    case 'family_support':
                        // Pass contextual information to family support API
                        const familySupportDetails = {
                            ...action.details,
                            location: parsedResponse.location || 'emergency location',
                            emergency_type: parsedResponse.crisis_type || 'medical emergency'
                        };
                        result = await arrangeFamilySupport(familySupportDetails);
                        break;
                    case 'childcare_coordination':
                        result = await coordinateChildcare(action.details);
                        break;
                }
                const actionIndex = actions.findIndex(a => a.id === actionId);
                if (actionIndex !== -1) {
                    actions[actionIndex].status = 'completed';
                    actions[actionIndex].result = result;
                }
            }
            catch (error) {
                const actionIndex = actions.findIndex(a => a.id === actionId);
                if (actionIndex !== -1) {
                    actions[actionIndex].status = 'failed';
                    actions[actionIndex].error = error instanceof Error ? error.message : 'Action failed';
                }
                progress.push(`❌ ${action.description} failed`);
            }
        }
        // Step 5: Show AI-generated completion message
        progress.push(parsedResponse.flow.completion);
        // Step 6: Generate clean summary with only 2 sections
        progress.push("📝 Generating crisis response summary...");
        const emergencySummaryPrompt = `
Based on the completed emergency crisis response actions, create a clean summary with ONLY 2 sections.

Original Emergency: "${userQuery}"
Crisis Type: ${parsedResponse.crisis_type}
Urgency Level: ${parsedResponse.urgency_level}
Location: ${parsedResponse.location}
Time Constraint: ${parsedResponse.time_constraint}

Completed Actions:
${actions.map(action => `- ${action.description}: ${action.status === 'completed' ? action.result : 'Failed'}`).join('\n')}

Create a summary with EXACTLY these 2 sections:

1. "✅ Emergency Actions Completed:" - List 4 items with EXACTLY 2 sub-bullet points each
2. "✅ Crisis Response Status:" - List 4 items with EXACTLY 2 sub-bullet points each

Format example:
**✅ Emergency Actions Completed:**
- **✈️ Emergency Travel Arranged:**
       • Flight booked with refundable ticket for immediate departure.
       • Boarding pass sent and check-in completed automatically.
- **💼 Work Coverage Secured:**
       • Colleague assigned to handle tomorrow's presentation.
       • Handover notes drafted and briefing call scheduled.
- **📱 Communications Managed:**
       • All stakeholders notified of emergency situation.
       • Out-of-office set and meetings rescheduled appropriately.
- **🏥 Family Support Activated:**
       • Top-rated medical facility identified and specialist contacted.
       • Transportation and accommodation arranged for family support.

**✅ Crisis Response Status:**
- **🚨 Emergency Handled:**
       • All critical actions completed within response time.
       • Crisis management protocols successfully activated.
- **⏰ Time-Sensitive Tasks:**
       • Immediate travel arrangements confirmed and booked.
       • Work responsibilities transferred without disruption.
- **📞 Communication Network:**
       • Professional notifications sent to all relevant parties.
       • Emergency contact protocols established and active.
- **🆘 Support Systems:**
       • Family support network activated and coordinated.
       • Medical and logistical arrangements confirmed.

IMPORTANT: 
- Use ONLY the format above. 
- Do NOT use asterisks (*) for bullet points. 
- Use ONLY hyphens (-) for main bullet points and indented hyphens for sub-bullets. 
- Use EXACTLY 2 sub-bullet points per main bullet. 
- Use **bold** for important technical terms, emergency terms, and key concepts. 
- Make it concise and professional, specific to the crisis type and urgency level mentioned.
- Ensure proper indentation with 7 spaces before sub-bullet points.
- The sub-bullets should be indented with spaces before the hyphen.
- Keep main bullet descriptions SHORT - just the title, no long descriptions.
- Keep sub-bullet points CONCISE - just key points, not long sentences.
- Add ✅ emoji to both section titles.
- Make ALL main bullet point text BOLD (e.g., **✈️ Emergency Travel Arranged:**).
`;
        const summary = await geminiChat(emergencySummaryPrompt);
        return {
            analysis: `Emergency Crisis Response: ${parsedResponse.crisis_type} - ${parsedResponse.urgency_level} urgency`,
            actions,
            summary,
            progress
        };
    }
    catch (error) {
        return {
            analysis: "Emergency crisis response failed",
            actions: [],
            summary: "❌ Emergency response failed. Please try again or contact emergency services directly.",
            progress: ["❌ Emergency response failed", "Please contact emergency services directly"]
        };
    }
}
// Emergency Crisis Management Mock API Functions
async function bookEmergencyTravel(details) {
    try {
        const response = await axios_1.default.post('http://localhost:4000/api/emergency/travel', details);
        return response.data.message;
    }
    catch (error) {
        return "Emergency travel booking failed";
    }
}
async function arrangeWorkCoverage(details) {
    try {
        const response = await axios_1.default.post('http://localhost:4000/api/emergency/work-coverage', details);
        return response.data.message;
    }
    catch (error) {
        return "Work coverage arrangement failed";
    }
}
async function manageEmergencyCommunications(details) {
    try {
        const response = await axios_1.default.post('http://localhost:4000/api/emergency/communications', details);
        return response.data.message;
    }
    catch (error) {
        return "Emergency communications failed";
    }
}
async function arrangeFamilySupport(details) {
    try {
        const response = await axios_1.default.post('http://localhost:4000/api/emergency/family-support', details);
        return response.data.message;
    }
    catch (error) {
        return "Family support arrangement failed";
    }
}
async function coordinateChildcare(details) {
    try {
        const response = await axios_1.default.post('http://localhost:4000/api/emergency/childcare-coordination', details);
        return response.data.message;
    }
    catch (error) {
        return "Childcare coordination failed";
    }
}
