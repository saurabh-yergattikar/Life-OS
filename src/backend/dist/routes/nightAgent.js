"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geminiAgent_1 = require("../agent/geminiAgent");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_PATH = path_1.default.join(__dirname, '../../night-agent.log');
function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    fs_1.default.appendFileSync(LOG_PATH, line);
}
const router = (0, express_1.Router)();
// In-memory demo state
let session = null;
let progress = 0;
let completedTasks = 0;
let totalTasks = 7;
let totalSavings = 0;
let alerts = [];
let report = null;
let billNegotiationScript = null;
let marketAnalysisResult = null;
let negotiationSteps = [];
const demoTasks = [
    { id: "bill_negotiation", name: "Negotiating Comcast Bill", type: "wealth", duration: 15, impact: 30 },
    { id: "subscription_cancel", name: "Cancelling Unused Subscriptions", type: "wealth", duration: 12, impact: 10 },
    { id: "investment_opt", name: "Optimizing Investments", type: "wealth", duration: 10, impact: 0 },
    { id: "sleep_analysis", name: "Analyzing Sleep Data", type: "health", duration: 8, impact: 0 },
    { id: "massage_booking", name: "Booking Massage Appointment", type: "health", duration: 10, impact: 0 },
    { id: "job_scan", name: "Scanning Job Opportunities", type: "career", duration: 10, impact: 0 },
    { id: "market_analysis", name: "Analyzing Market Opportunities", type: "market", duration: 10, impact: 0 },
];
router.post('/start', (req, res) => {
    log('POST /api/night-agent/start called');
    session = {
        status: 'running',
        completedTasks: 0,
        totalTasks: demoTasks.length,
        currentTask: demoTasks[0],
        totalSavings: 0,
        alerts: [],
        startedAt: Date.now(),
    };
    progress = 0;
    completedTasks = 0;
    totalSavings = 0;
    alerts = [];
    report = null;
    billNegotiationScript = null;
    marketAnalysisResult = null;
    negotiationSteps = [];
    res.json({ status: 'started', session });
    // Simulate task execution in background
    simulateNightAgent();
});
router.get('/progress', (req, res) => {
    log('GET /api/night-agent/progress called');
    res.json({
        status: session ? session.status : 'idle',
        completedTasks,
        totalTasks,
        currentTask: session ? session.currentTask : null,
        totalSavings,
        alerts,
        billNegotiationScript,
        marketAnalysisResult,
        negotiationSteps,
    });
});
router.get('/report', (req, res) => {
    log('GET /api/night-agent/report called');
    if (!report) {
        log('Report not ready');
        return res.status(404).json({ error: 'Report not ready' });
    }
    log('Report returned');
    res.json(report);
});
// Mock Comcast Support Chat Endpoint
router.post('/comcast-support-chat', (req, res) => {
    const { message } = req.body;
    let response = '';
    if (!message) {
        response = 'How can I assist you with your Comcast account today?';
    }
    else if (/cancel|lower bill|cheaper|reduce/i.test(message)) {
        response = 'We value your loyalty. We can offer you a special rate of $80/month to match Xfinity.';
    }
    else if (/thank/i.test(message)) {
        response = 'You are welcome! Is there anything else I can help you with?';
    }
    else {
        response = 'Thank you for reaching out to Comcast support. Could you please provide more details?';
    }
    res.json({ supportReply: response });
});
// Mock Subscription Support Chat Endpoint
router.post('/subscription-support-chat', (req, res) => {
    const { message, provider } = req.body;
    let response = '';
    if (!message || !provider) {
        response = `How can I assist you with your ${provider || 'subscription'} today?`;
    }
    else if (/cancel|stop|terminate/i.test(message)) {
        response = `Your ${provider} subscription has been cancelled. We're sorry to see you go!`;
    }
    else if (/thank/i.test(message)) {
        response = 'You are welcome! If you need anything else, let us know.';
    }
    else {
        response = `Thank you for reaching out to ${provider} support. Could you please provide more details?`;
    }
    res.json({ supportReply: response });
});
// Mock Massage Booking Chat Endpoint
router.post('/massage-support-chat', (req, res) => {
    const { message, date, time } = req.body;
    let response = '';
    if (!message) {
        response = 'How can I assist you with your massage booking today?';
    }
    else if (/book|appointment|schedule/i.test(message)) {
        response = `Perfect! I've booked your massage for ${date} at ${time}. Your appointment is confirmed.`;
    }
    else if (/thank/i.test(message)) {
        response = 'You are welcome! Enjoy your massage session.';
    }
    else {
        response = 'Thank you for reaching out. Could you please provide more details about your booking?';
    }
    res.json({ supportReply: response });
});
// Mock Interview Booking Chat Endpoint
router.post('/interview-support-chat', (req, res) => {
    const { message, date, time } = req.body;
    let response = '';
    if (!message) {
        response = 'How can I assist you with your mock interview booking today?';
    }
    else if (/book|appointment|schedule/i.test(message)) {
        response = `Perfect! I've booked your mock interview for ${date} at ${time}. Your session is confirmed.`;
    }
    else if (/thank/i.test(message)) {
        response = 'You are welcome! Good luck with your preparation.';
    }
    else {
        response = 'Thank you for reaching out. Could you please provide more details about your booking?';
    }
    res.json({ supportReply: response });
});
async function simulateNightAgent() {
    let i = 0;
    async function nextTask() {
        if (i >= demoTasks.length) {
            session.status = 'completed';
            report = {
                generatedAt: new Date().toISOString(),
                summary: {
                    moneySaved: totalSavings,
                    healthAlertsAddressed: 1,
                    careerOpportunities: 1,
                    tasksCompleted: demoTasks.length,
                },
                details: {
                    wealth: [
                        { ...demoTasks[0], script: billNegotiationScript },
                        demoTasks[1],
                        demoTasks[2],
                    ],
                    health: [demoTasks[3], demoTasks[4]],
                    career: [demoTasks[5]],
                    market: [{ ...demoTasks[6], result: marketAnalysisResult }],
                },
            };
            log('Night Agent session completed');
            return;
        }
        session.currentTask = demoTasks[i];
        log(`Task started: ${demoTasks[i].id}`);
        if (demoTasks[i].id === "bill_negotiation") {
            negotiationSteps = [];
            negotiationSteps.push("Let me check if we can save money $ 💸 on Recurring Bills");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Analyzing James's Monthly Bills");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("James has been with Comcast for many years and at $110 / Month");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("🧠 Thinking: Checking alternatives...");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Found: Comcast $110/mo, Xfinity $80/mo");
            await new Promise(r => setTimeout(r, 800));
            // Animated working dots for chat start
            let workingMsg = "Starting chat with Comcast support for Negotiation";
            for (let i = 1; i <= 3; i++) {
                negotiationSteps.push(workingMsg + '.'.repeat(i));
                await new Promise(r => setTimeout(r, 500));
                negotiationSteps.pop();
            }
            negotiationSteps.push(workingMsg + '...');
            await new Promise(r => setTimeout(r, 800));
            // Step 1: Analyze bill and alternatives using Gemini
            let analysis = '';
            try {
                const analysisPrompt = `Customer James has a Comcast subscription at $110/month for the last 1 year. Scan the internet for alternative wifi costs and suggest if negotiation is possible. Present a summary.`;
                analysis = await (0, geminiAgent_1.geminiChat)(analysisPrompt);
                marketAnalysisResult = analysis;
                log('Gemini API called for bill analysis. Result: ' + analysis);
            }
            catch (err) {
                analysis = '[Gemini API failed, fallback: Xfinity offers $80/month. Negotiate.]';
                log('Gemini API failed for bill analysis: ' + err.message);
            }
            // Step 2: Multi-turn negotiation chat using Gemini for both sides
            let userMsg = "Hi, I've been a loyal Comcast customer for years, but my bill is $110/month. Xfinity is offering $80/month. Can you match this, or I may have to switch?";
            negotiationSteps.push("💬 To Comcast: " + userMsg);
            await new Promise(r => setTimeout(r, 800));
            let comcastReply = '';
            try {
                const comcastPrompt = `You are a Comcast support agent. A customer says: '${userMsg}'. Reply in 2-3 short lines, be positive, friendly, and confirm you will match the $80/month Xfinity offer for this loyal customer. Do not ask for more info. Example: 'Thank you for being a loyal customer! We value your business and will match the $80/month offer for you.'`;
                comcastReply = await (0, geminiAgent_1.geminiChat)(comcastPrompt);
                // Truncate to 2-3 lines if too long
                comcastReply = comcastReply.split('\n').slice(0, 3).join(' ').slice(0, 180);
            }
            catch (err) {
                comcastReply = "Thank you for being a loyal customer! We value your business and will match the $80/month offer for you.";
            }
            negotiationSteps.push("🧑‍💼 Comcast: " + comcastReply);
            await new Promise(r => setTimeout(r, 800));
            // Optional: Add a second user message if Comcast doesn't immediately offer the discount
            if (!/\$80/.test(comcastReply)) {
                userMsg = "Thank you, but unless you can match $80/month, I will need to cancel.";
                negotiationSteps.push("💬 To Comcast: " + userMsg);
                await new Promise(r => setTimeout(r, 800));
                try {
                    const comcastPrompt2 = `You are a Comcast support agent. The customer insists: '${userMsg}'. Reply in 2-3 short lines, be positive, friendly, and confirm you will match the $80/month Xfinity offer for this loyal customer. Do not ask for more info. Example: 'Thank you for being a loyal customer! We value your business and will match the $80/month offer for you.'`;
                    comcastReply = await (0, geminiAgent_1.geminiChat)(comcastPrompt2);
                    comcastReply = comcastReply.split('\n').slice(0, 3).join(' ').slice(0, 180);
                }
                catch (err) {
                    comcastReply = "Thank you for being a loyal customer! We value your business and will match the $80/month offer for you.";
                }
                negotiationSteps.push("🧑‍💼 Comcast: " + comcastReply);
                await new Promise(r => setTimeout(r, 800));
            }
            // Step 3: Closure
            if (/\$80/.test(comcastReply)) {
                totalSavings += 30; // $110 - $80 (corrected from previous incorrect value)
                alerts.push({ type: 'success', message: 'Comcast bill reduced to $80/month.' });
                billNegotiationScript = userMsg + '\n' + comcastReply + '\nNegotiation Result: Success, bill reduced to $80/month.';
                negotiationSteps.push("✅ Success: Bill reduced to $80/mo");
            }
            else {
                alerts.push({ type: 'info', message: 'Negotiation attempted, but no reduction confirmed.' });
                billNegotiationScript = userMsg + '\n' + comcastReply + '\nNegotiation Result: No reduction confirmed.';
                negotiationSteps.push("ℹ️ No reduction confirmed");
            }
            // After negotiation, stop progress for testing
            //session.status = 'paused_for_testing';
            //return;
            // Manually complete this task
            completedTasks++;
            log(`Task completed: ${demoTasks[i].id}`);
            i++;
            nextTask();
            return;
        }
        if (demoTasks[i].id === "subscription_cancel") {
            negotiationSteps = [];
            negotiationSteps.push("Let me check if we can save money $ 💸 on Unused Subscriptions");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Analyzing James's Subscriptions");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("🧠 Thinking: Reviewing usage data... James has been using Netflix, Audible, Found unused: Spotify");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Looks like Spotify has not been used for ~3 Months");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("James has been using Google's YouTube Music.");
            await new Promise(r => setTimeout(r, 800));
            // Only cancel Spotify
            let provider = "Spotify";
            let workingMsg = `Starting chat with ${provider} support for Cancellation`;
            for (let i = 1; i <= 3; i++) {
                negotiationSteps.push(workingMsg + '.'.repeat(i));
                await new Promise(r => setTimeout(r, 500));
                negotiationSteps.pop();
            }
            negotiationSteps.push(workingMsg + '...');
            await new Promise(r => setTimeout(r, 800));
            let userMsg = `Hi, I would like to cancel my Spotify subscription.`;
            negotiationSteps.push(`💬 To Spotify: ` + userMsg);
            await new Promise(r => setTimeout(r, 800));
            let providerReply = '';
            try {
                const providerPrompt = `You are a Spotify support agent. A customer says: '${userMsg}'. Reply in 2-3 short lines, be positive, friendly, and confirm you will cancel the subscription for them. Example: 'Your Spotify subscription has been cancelled. We're sorry to see you go!'`;
                providerReply = await (0, geminiAgent_1.geminiChat)(providerPrompt);
                providerReply = providerReply.split('\n').slice(0, 3).join(' ').slice(0, 180);
            }
            catch (err) {
                providerReply = `Your Spotify subscription has been cancelled. We're sorry to see you go!`;
            }
            negotiationSteps.push(`🧑‍💼 Spotify: ` + providerReply);
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push(`💬 To Spotify: Thank you!`);
            await new Promise(r => setTimeout(r, 600));
            negotiationSteps.push(`🧑‍💼 Spotify: You're welcome. If you need anything else, let us know.`);
            await new Promise(r => setTimeout(r, 600));
            negotiationSteps.push("✅ Success: Cancelled Spotify. Saved $10/mo");
            totalSavings += 10;
            alerts.push({ type: 'success', message: 'Unused Spotify subscription cancelled. Saved $10/month.' });
            billNegotiationScript = 'Unused subscription cancelled: Spotify.';
            // Manually complete this task
            completedTasks++;
            log(`Task completed: ${demoTasks[i].id}`);
            i++;
            nextTask();
            return;
        }
        if (demoTasks[i].id === "market_analysis") {
            negotiationSteps = [];
            negotiationSteps.push("Let me check if we can optimize your investments and portfolio 📈");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Analyzing James's Portfolio: AAPL, TSLA, NVDA, AMZN");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("🧠 Thinking: Reviewing market trends and stock performance...");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("1. Japan is increasing Interest Rates");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("2. There has been Sell-Off in Asian Market as of now (During US overnight)");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("3. China has joined LLM race with DeepSeek model which they are releasing as OpenSource");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("I will notify James to be cautious ✅");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Now, let's take a look at James's portfolio and analyze each stock individually.");
            await new Promise(r => setTimeout(r, 800));
            // Use Gemini for market analysis
            let analysis = '';
            try {
                const prompt = `James's portfolio: AAPL, TSLA, NVDA, AMZN. For each stock, provide exactly 1 line analysis, 1 line recommendation, 1 line actionable insight. Format as: "AAPL: [analysis]. [recommendation]. [actionable insight]." Keep each response concise and clear, no markdown formatting.`;
                analysis = await (0, geminiAgent_1.geminiChat)(prompt);
                marketAnalysisResult = analysis;
            }
            catch (err) {
                analysis = 'AAPL: Mature company with strong brand loyalty but facing slowing growth in key markets. Hold, monitor market share in India and China. Watch for new product announcements and their market reception.\nTSLA: Innovative leader in EVs, but faces increasing competition and production challenges. Hold, dependent on successful execution of new models and battery technology. Track competitor EV releases and their impact on Tesla\'s market share.\nNVDA: Dominant in AI chips, benefiting from industry tailwinds but valuation is high. Hold, cautiously, as growth potential is significant but vulnerable to market correction. Monitor data center demand and development of competing AI chips.\nAMZN: E-commerce and cloud leader, with diverse revenue streams but facing regulatory scrutiny. Buy, long term growth potential driven by AWS and expansion into new markets. Track AWS growth and the impact of regulatory actions on its business.';
                marketAnalysisResult = analysis;
            }
            // Split analysis into lines for step-by-step UI
            const steps = analysis.split('\n').filter(l => l.trim().length > 0);
            for (const step of steps) {
                negotiationSteps.push(step);
                await new Promise(r => setTimeout(r, 800));
            }
            negotiationSteps.push("Now, we had good Analysis of Global Financial Market and James Portfolio,");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("I will notify James to buy NVDA ✅");
            alerts.push({ type: 'success', message: 'Portfolio reviewed and buy recommendation given for NVDA.' });
            // Manually complete this task
            completedTasks++;
            log(`Task completed: ${demoTasks[i].id}`);
            i++;
            nextTask();
            return;
        }
        if (demoTasks[i].id === "sleep_analysis") {
            negotiationSteps = [];
            negotiationSteps.push("Let me check your health and wellness patterns 🏥");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Analyzing James's Sleep & Activity Data");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("🧠 Thinking: Reviewing sleep patterns and activity levels...");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("James has not been getting good sleep for last 2 weeks");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Active Time is less as well");
            await new Promise(r => setTimeout(r, 800));
            // Use Gemini for sleep analysis
            let analysis = '';
            try {
                const prompt = `James has poor sleep for 2 weeks and low activity. Provide 3-4 actionable health recommendations in a step-by-step, human-like way. Focus on sleep improvement and activity increase.`;
                analysis = await (0, geminiAgent_1.geminiChat)(prompt);
            }
            catch (err) {
                analysis = '1. Establish a consistent sleep schedule: Go to bed and wake up at the same time daily.\n2. Create a relaxing bedtime routine: Avoid screens 1 hour before bed.\n3. Increase daily activity: Start with 10-minute walks, gradually increase.\n4. Consider sleep environment: Ensure dark, quiet, cool bedroom.';
            }
            // Split analysis into lines for step-by-step UI
            const steps = analysis.split('\n').filter(l => l.trim().length > 0);
            for (const step of steps) {
                negotiationSteps.push(step);
                await new Promise(r => setTimeout(r, 800));
            }
            negotiationSteps.push("✅ Success: Health analysis complete. See above for actionable recommendations.");
            alerts.push({ type: 'success', message: 'Sleep and activity analysis completed with recommendations.' });
            // Manually complete this task
            completedTasks++;
            log(`Task completed: ${demoTasks[i].id}`);
            i++;
            nextTask();
            return;
        }
        if (demoTasks[i].id === "massage_booking") {
            negotiationSteps = [];
            negotiationSteps.push("Let me check if we can book wellness appointments 🧘‍♀️");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Checking James's Calendar Availability");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("🧠 Thinking: Looking for free time slots...");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Found: Friday evening is free");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Starting chat with Massage Provider for Booking...");
            await new Promise(r => setTimeout(r, 800));
            let userMsg = `Hi, I would like to book a massage appointment for Friday evening.`;
            negotiationSteps.push(`💬 To Massage Provider: ` + userMsg);
            await new Promise(r => setTimeout(r, 800));
            let providerReply = '';
            try {
                const providerPrompt = `You are a massage therapist. A customer says: '${userMsg}'. Reply in 2-3 short lines, be positive, friendly, and confirm the booking for Friday evening. Example: 'Perfect! I've booked your massage for Friday evening. Your appointment is confirmed.'`;
                providerReply = await (0, geminiAgent_1.geminiChat)(providerPrompt);
                providerReply = providerReply.split('\n').slice(0, 3).join(' ').slice(0, 180);
            }
            catch (err) {
                providerReply = `Perfect! I've booked your massage for Friday evening. Your appointment is confirmed.`;
            }
            negotiationSteps.push(`🧑‍💼 Massage Provider: ` + providerReply);
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push(`💬 To Massage Provider: Thank you!`);
            await new Promise(r => setTimeout(r, 600));
            negotiationSteps.push(`🧑‍💼 Massage Provider: You're welcome! Enjoy your massage session.`);
            await new Promise(r => setTimeout(r, 600));
            negotiationSteps.push("✅ Success: Massage booked for Friday evening");
            alerts.push({ type: 'success', message: 'Massage appointment booked for Friday evening.' });
            // Manually complete this task
            completedTasks++;
            log(`Task completed: ${demoTasks[i].id}`);
            i++;
            nextTask();
            return;
        }
        if (demoTasks[i].id === "investment_opt") {
            negotiationSteps = [];
            negotiationSteps.push("Let me check if we can book mock interviews for practice 🎯");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Finding available mock interview slots");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("🧠 Thinking: Checking interview coach availability...");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Found: Available slots for Google-style mock interview");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Starting chat with Interview Coach for Booking...");
            await new Promise(r => setTimeout(r, 800));
            let userMsg = `Hi, I would like to book a mock interview session for Google preparation.`;
            negotiationSteps.push(`💬 To Interview Coach: ` + userMsg);
            await new Promise(r => setTimeout(r, 800));
            let providerReply = '';
            try {
                const providerPrompt = `You are an interview coach. A customer says: '${userMsg}'. Reply in 2-3 short lines, be positive, friendly, and confirm the mock interview booking. Example: 'Perfect! I've booked your mock interview session. Your appointment is confirmed.'`;
                providerReply = await (0, geminiAgent_1.geminiChat)(providerPrompt);
                providerReply = providerReply.split('\n').slice(0, 3).join(' ').slice(0, 180);
            }
            catch (err) {
                providerReply = `Perfect! I've booked your mock interview session. Your appointment is confirmed.`;
            }
            negotiationSteps.push(`🧑‍💼 Interview Coach: ` + providerReply);
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push(`💬 To Interview Coach: Thank you!`);
            await new Promise(r => setTimeout(r, 600));
            negotiationSteps.push(`🧑‍💼 Interview Coach: You're welcome! Good luck with your preparation.`);
            await new Promise(r => setTimeout(r, 600));
            negotiationSteps.push("✅ Success: Mock interview booked for practice");
            alerts.push({ type: 'success', message: 'Mock interview session booked for Google preparation.' });
            // Manually complete this task
            completedTasks++;
            log(`Task completed: ${demoTasks[i].id}`);
            i++;
            nextTask();
            return;
        }
        if (demoTasks[i].id === "job_scan") {
            negotiationSteps = [];
            negotiationSteps.push("Let me check your career opportunities and interview prep 🚀");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Detecting upcoming Google Interview");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("🧠 Thinking: Researching latest interview questions...");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Found: James has upcoming Google Interview");
            await new Promise(r => setTimeout(r, 800));
            negotiationSteps.push("Researching and collecting latest interview questions...");
            await new Promise(r => setTimeout(r, 800));
            // Use Gemini for interview prep
            let analysis = '';
            try {
                const prompt = `James has an upcoming Google interview. Provide 4-5 latest Google interview questions and preparation tips in a step-by-step, human-like way. Focus on technical and behavioral questions.`;
                analysis = await (0, geminiAgent_1.geminiChat)(prompt);
            }
            catch (err) {
                analysis = '1. System Design: Design a scalable URL shortener service.\n2. Coding: Implement a rate limiter for API requests.\n3. Behavioral: Tell me about a time you disagreed with your manager.\n4. Technical: Explain how Google Search works at a high level.\n5. Preparation Tip: Practice coding on a whiteboard and review Google\'s leadership principles.';
            }
            // Split analysis into lines for step-by-step UI
            const steps = analysis.split('\n').filter(l => l.trim().length > 0);
            for (const step of steps) {
                negotiationSteps.push(step);
                await new Promise(r => setTimeout(r, 800));
            }
            negotiationSteps.push("✅ Success: Interview prep complete. See above for latest questions and tips.");
            alerts.push({ type: 'success', message: 'Google interview preparation completed with latest questions.' });
            // Manually complete this task
            completedTasks++;
            log(`Task completed: ${demoTasks[i].id}`);
            i++;
            nextTask();
            return;
        }
        // For other tasks, use the original setTimeout logic
        setTimeout(() => {
            completedTasks++;
            log(`Task completed: ${demoTasks[i].id}`);
            // Only add impact for tasks that don't have manual savings calculation
            if (demoTasks[i].type === 'wealth' && demoTasks[i].impact > 0) {
                totalSavings += demoTasks[i].impact;
            }
            i++;
            nextTask();
        }, demoTasks[i].duration * 100);
    }
    nextTask();
}
exports.default = router;
