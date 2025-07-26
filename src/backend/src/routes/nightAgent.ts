import { Router, Request, Response } from 'express';
import { geminiChat } from '../agent/geminiAgent';
import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(__dirname, '../../night-agent.log');
function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_PATH, line);
}

const router = Router();

// In-memory demo state
let session: any = null;
let progress = 0;
let completedTasks = 0;
let totalTasks = 7;
let totalSavings = 0;
let alerts: any[] = [];
let report: any = null;
let billNegotiationScript: string | null = null;
let marketAnalysisResult: string | null = null;
let negotiationSteps: string[] = [];
let currentTaskId: string | null = null;
let isSimulationRunning = false;

const demoTasks = [
  { id: "bill_negotiation", name: "💰 Smart Savings Commander", type: "wealth", duration: 15, impact: 30 },
  { id: "subscription_cancel", name: "🧼 Auto Declutter Bot", type: "wealth", duration: 12, impact: 10 },
  { id: "investment_opt", name: "📈 Growth Strategy Engine", type: "wealth", duration: 10, impact: 0 },
  { id: "sleep_analysis", name: "🛌 Wellness Monitor", type: "health", duration: 8, impact: 0 },
  { id: "massage_booking", name: "🤖 Lifestyle Buddy", type: "health", duration: 10, impact: 0 },
  { id: "job_scan", name: "🧠 Career Compass AI", type: "career", duration: 10, impact: 0 },
  { id: "market_analysis", name: "🌍 Trend & Opportunity Radar", type: "market", duration: 10, impact: 0 },
];

router.post('/start', (req: Request, res: Response) => {
  log('POST /api/night-agent/start called');
  
  // Stop any existing simulation
  isSimulationRunning = false;
  
  // Reset all state
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
  currentTaskId = null;
  
  log('Reset all state and starting new simulation');
  res.json({ status: 'started', session });
  
  // Start new simulation
  isSimulationRunning = true;
  simulateNightAgent();
});

router.get('/progress', (req: Request, res: Response) => {
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
    currentTaskId,
  });
});

router.get('/report', (req: Request, res: Response) => {
  log('GET /api/night-agent/report called');
  if (!report) {
    log('Report not ready');
    return res.status(404).json({ error: 'Report not ready' });
  }
  log('Report returned');
  res.json(report);
});

// Reset endpoint to clear all state
router.post('/reset', (req: Request, res: Response) => {
  log('POST /api/night-agent/reset called');
  
  // Stop any existing simulation
  isSimulationRunning = false;
  
  // Reset all state
  session = null;
  progress = 0;
  completedTasks = 0;
  totalSavings = 0;
  alerts = [];
  report = null;
  billNegotiationScript = null;
  marketAnalysisResult = null;
  negotiationSteps = [];
  currentTaskId = null;
  
  log('All state reset');
  res.json({ status: 'reset' });
});

// Mock Comcast Support Chat Endpoint
router.post('/comcast-support-chat', (req: Request, res: Response) => {
  const { message } = req.body;
  let response = '';
  if (!message) {
    response = 'How can I assist you with your Comcast account today?';
  } else if (/cancel|lower bill|cheaper|reduce/i.test(message)) {
    response = 'We value your loyalty. We can offer you a special rate of $80/month to match Xfinity.';
  } else if (/thank/i.test(message)) {
    response = 'You are welcome! Is there anything else I can help you with?';
  } else {
    response = 'Thank you for reaching out to Comcast support. Could you please provide more details?';
  }
  res.json({ supportReply: response });
});

// Mock Subscription Support Chat Endpoint
router.post('/subscription-support-chat', (req: Request, res: Response) => {
  const { message, provider } = req.body;
  let response = '';
  if (!message || !provider) {
    response = `How can I assist you with your ${provider || 'subscription'} today?`;
  } else if (/cancel|stop|terminate/i.test(message)) {
    response = `Your ${provider} subscription has been cancelled. We're sorry to see you go!`;
  } else if (/thank/i.test(message)) {
    response = 'You are welcome! If you need anything else, let us know.';
  } else {
    response = `Thank you for reaching out to ${provider} support. Could you please provide more details?`;
  }
  res.json({ supportReply: response });
});

// Mock Massage Booking Chat Endpoint
router.post('/massage-support-chat', (req: Request, res: Response) => {
  const { message, date, time } = req.body;
  let response = '';
  if (!message) {
    response = 'How can I assist you with your massage booking today?';
  } else if (/book|appointment|schedule/i.test(message)) {
    response = `Perfect! I've booked your massage for ${date} at ${time}. Your appointment is confirmed.`;
  } else if (/thank/i.test(message)) {
    response = 'You are welcome! Enjoy your massage session.';
  } else {
    response = 'Thank you for reaching out. Could you please provide more details about your booking?';
  }
  res.json({ supportReply: response });
});

// Mock Interview Booking Chat Endpoint
router.post('/interview-support-chat', (req: Request, res: Response) => {
  const { message, date, time } = req.body;
  let response = '';
  if (!message) {
    response = 'How can I assist you with your mock interview booking today?';
  } else if (/book|appointment|schedule/i.test(message)) {
    response = `Perfect! I've booked your mock interview for ${date} at ${time}. Your session is confirmed.`;
  } else if (/thank/i.test(message)) {
    response = 'You are welcome! Good luck with your preparation.';
  } else {
    response = 'Thank you for reaching out. Could you please provide more details about your booking?';
  }
  res.json({ supportReply: response });
});

async function simulateNightAgent() {
  let i = 0;
  async function nextTask() {
    // Check if simulation should continue
    if (!isSimulationRunning) {
      log('Simulation stopped by user request');
      return;
    }
    
    if (i >= demoTasks.length) {
      session.status = 'completed';
      report = {
        generatedAt: new Date().toISOString(),
        summary: {
          moneySaved: totalSavings,
          moneySavedMonthly: totalSavings,
          moneySavedAnnually: totalSavings * 12,
          healthWins: 2, // Sleep analysis + massage booking
          opportunitiesFound: 1, // Job applications
          tasksCompleted: demoTasks.length,
          summaryActions: [
            "Negotiated WiFi Bill and Saved $30 ✅",
            "Unused subscription cancelled: Spotify ✅",
            "Took 2 Actions for James's better Health and Wellness ✅",
            "Applied James's Resume to his Dream Companies ✅",
            "Notifying James Buy Opportunity for NVDA ✅"
          ]
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
      isSimulationRunning = false;
      return;
    }
    // Check if simulation should continue
    if (!isSimulationRunning) {
      log('Simulation stopped during task execution');
      return;
    }
    
    session.currentTask = demoTasks[i];
    currentTaskId = demoTasks[i].id;
    log(`Task started: ${demoTasks[i].id}`);
    // Clear negotiation steps at the start of each task
    negotiationSteps = [];
    log(`Cleared negotiation steps for task: ${demoTasks[i].id}`);
    await new Promise(r => setTimeout(r, 500)); // Longer delay to ensure frontend gets cleared state
    if (demoTasks[i].id === "bill_negotiation") {
      negotiationSteps.push("💰 Smart Savings Commander: Evaluating James's Car Insurance");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Car insurance was negotiated 1 month back");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Will review for any negotiation after 11 months later");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Now checking WiFi bill negotiation...");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Analyzing James's Monthly Bills");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("James has been with Comcast for many years and at $110 / Month");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("🧠 Thinking: Checking alternatives...");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Found: Comcast $110/mo, Xfinity $80/mo");
      await new Promise(r => setTimeout(r, 800));
      // Add the final working message
      negotiationSteps.push("Starting chat with Comcast support for Negotiation...");
      await new Promise(r => setTimeout(r, 800));
      // Step 1: Analyze bill and alternatives using Gemini
      let analysis = '';
      try {
        const analysisPrompt = `Customer James has a Comcast subscription at $110/month for the last 1 year. Scan the internet for alternative wifi costs and suggest if negotiation is possible. Present a summary.`;
        analysis = await geminiChat(analysisPrompt);
        marketAnalysisResult = analysis;
        log('Gemini API called for bill analysis. Result: ' + analysis);
      } catch (err) {
        analysis = '[Gemini API failed, fallback: Xfinity offers $80/month. Negotiate.]';
        log('Gemini API failed for bill analysis: ' + (err as Error).message);
      }
      // Step 2: Multi-turn negotiation chat using Gemini for both sides
      let userMsg = "Hi, I've been a loyal Comcast customer for years, but my bill is $110/month. Xfinity is offering $80/month. Can you match this, or I may have to switch?";
      negotiationSteps.push("💬 To Comcast: " + userMsg);
      await new Promise(r => setTimeout(r, 800));
      let comcastReply = '';
      try {
        const comcastPrompt = `You are a Comcast support agent. A customer says: '${userMsg}'. Reply in 2-3 short lines, be positive, friendly, and confirm you will match the $80/month Xfinity offer for this loyal customer. Do not ask for more info. Example: 'Thank you for being a loyal customer! We value your business and will match the $80/month offer for you.'`;
        comcastReply = await geminiChat(comcastPrompt);
        // Truncate to 2-3 lines if too long
        comcastReply = comcastReply.split('\n').slice(0,3).join(' ').slice(0,180);
      } catch (err) {
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
          comcastReply = await geminiChat(comcastPrompt2);
          comcastReply = comcastReply.split('\n').slice(0,3).join(' ').slice(0,180);
        } catch (err) {
          comcastReply = "Thank you for being a loyal customer! We value your business and will match the $80/month offer for you.";
        }
        negotiationSteps.push("🧑‍💼 Comcast: " + comcastReply);
        await new Promise(r => setTimeout(r, 800));
      }
      // Step 3: Closure
      if (/\$80/.test(comcastReply)) {
        totalSavings += 30; // $110 - $80 = $30 saved per month
        alerts.push({ type: 'success', message: 'Comcast bill reduced to $80/month. Saved $30/month.' });
        billNegotiationScript = userMsg + '\n' + comcastReply + '\nNegotiation Result: Success, bill reduced to $80/month.';
        negotiationSteps.push("✅ Success: Bill reduced to $80/mo (Saved $30/mo)");
      } else {
        alerts.push({ type: 'info', message: 'Negotiation attempted, but no reduction confirmed.' });
        billNegotiationScript = userMsg + '\n' + comcastReply + '\nNegotiation Result: No reduction confirmed.';
        negotiationSteps.push("ℹ️ No reduction confirmed");
      }
      // Add delay to show success message
      await new Promise(r => setTimeout(r, 1500));
      
      // Check if simulation should continue
      if (!isSimulationRunning) {
        log('Simulation stopped after bill negotiation task');
        return;
      }
      
      // Manually complete this task
      completedTasks++;
      log(`Task completed: ${demoTasks[i].id}`);
      i++;
      nextTask();
      return;
    }
    if (demoTasks[i].id === "subscription_cancel") {
      negotiationSteps.push("📱 Subscription Analysis: Let me check for unused subscriptions");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Analyzing James's Subscriptions");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("🧠 Thinking: Reviewing usage data...");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Found: Netflix (active), Audible (active), Spotify (unused for 3 months)");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("James has been using Google's YouTube Music instead of Spotify");
      await new Promise(r => setTimeout(r, 800));
      // Only cancel Spotify
      let provider = "Spotify";
      negotiationSteps.push(`Starting chat with ${provider} support for Cancellation...`);
      await new Promise(r => setTimeout(r, 800));
      let userMsg = `Hi, I would like to cancel my Spotify subscription.`;
      negotiationSteps.push(`💬 To Spotify: ` + userMsg);
      await new Promise(r => setTimeout(r, 800));
      let providerReply = '';
      try {
        const providerPrompt = `You are a Spotify support agent. A customer says: '${userMsg}'. Reply in 2-3 short lines, be positive, friendly, and confirm you will cancel the subscription for them. Example: 'Your Spotify subscription has been cancelled. We're sorry to see you go!'`;
        providerReply = await geminiChat(providerPrompt);
        providerReply = providerReply.split('\n').slice(0,3).join(' ').slice(0,180);
      } catch (err) {
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
      // Add delay to show success message
      await new Promise(r => setTimeout(r, 1500));
      
      // Check if simulation should continue
      if (!isSimulationRunning) {
        log('Simulation stopped after subscription cancellation task');
        return;
      }
      
      // Manually complete this task
      completedTasks++;
      log(`Task completed: ${demoTasks[i].id}`);
      i++;
      nextTask();
      return;
    }
    if (demoTasks[i].id === "market_analysis") {
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
        analysis = await geminiChat(prompt);
        marketAnalysisResult = analysis;
      } catch (err) {
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
      alerts.push({ type: 'career', message: 'Portfolio reviewed and buy recommendation given for NVDA.' });
      // Add delay to show success message
      await new Promise(r => setTimeout(r, 1500));
      
      // Check if simulation should continue
      if (!isSimulationRunning) {
        log('Simulation stopped after market analysis task');
        return;
      }
      
      // Manually complete this task
      completedTasks++;
      log(`Task completed: ${demoTasks[i].id}`);
      i++;
      nextTask();
      return;
    }
    if (demoTasks[i].id === "sleep_analysis") {
      negotiationSteps.push("🛌 Wellness Monitor: James had heart rate elevated for last couple of nights during sleep");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("SPO2 during sleep was ~94% as well");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Sleep monitoring app gives signal of snore as well");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("So based on these combinations, Scheduling Primary Physician Appointment for James");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("✅ Task completed");
      alerts.push({ type: 'health', message: 'Primary physician appointment scheduled based on sleep monitoring data.' });
      // Add delay to show success message
      await new Promise(r => setTimeout(r, 1500));
      // Manually complete this task
      completedTasks++;
      log(`Task completed: ${demoTasks[i].id}`);
      i++;
      nextTask();
      return;
    }
    if (demoTasks[i].id === "massage_booking") {
      negotiationSteps.push("🤖 Lifestyle Buddy: I booked Chiropractor appointment for James 2 weeks back and James already visited");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("So, After 2 weeks will revisit Chiropractor appointment");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("James has been doing commute for 2 hours round trip and Has Desk job");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Contacting Massage providers for James massage");
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
        providerReply = await geminiChat(providerPrompt);
        providerReply = providerReply.split('\n').slice(0,3).join(' ').slice(0,180);
      } catch (err) {
        providerReply = `Perfect! I've booked your massage for Friday evening. Your appointment is confirmed.`;
      }
      negotiationSteps.push(`🧑‍💼 Massage Provider: ` + providerReply);
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push(`💬 To Massage Provider: Thank you!`);
      await new Promise(r => setTimeout(r, 600));
      negotiationSteps.push(`🧑‍💼 Massage Provider: You're welcome! Enjoy your massage session.`);
      await new Promise(r => setTimeout(r, 600));
      negotiationSteps.push("✅ Success: Massage booked for Friday evening");
      alerts.push({ type: 'health', message: 'Massage appointment booked for Friday evening.' });
      // Add delay to show success message
      await new Promise(r => setTimeout(r, 1500));
      // Manually complete this task
      completedTasks++;
      log(`Task completed: ${demoTasks[i].id}`);
      i++;
      nextTask();
      return;
    }
    if (demoTasks[i].id === "investment_opt") {
      negotiationSteps.push("📈 Career Growth Strategy Engine: James has upcoming Interview with Google");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("So, I should book Mock Interview for James");
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
        providerReply = await geminiChat(providerPrompt);
        providerReply = providerReply.split('\n').slice(0,3).join(' ').slice(0,180);
      } catch (err) {
        providerReply = `Perfect! I've booked your mock interview session. Your appointment is confirmed.`;
      }
      negotiationSteps.push(`🧑‍💼 Interview Coach: ` + providerReply);
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push(`💬 To Interview Coach: Thank you!`);
      await new Promise(r => setTimeout(r, 600));
      negotiationSteps.push(`🧑‍💼 Interview Coach: You're welcome! Good luck with your preparation.`);
      await new Promise(r => setTimeout(r, 600));
      negotiationSteps.push("✅ Success: Mock interview booked for practice");
      alerts.push({ type: 'career', message: 'Mock interview session booked for Google preparation.' });
      // Add delay to show success message
      await new Promise(r => setTimeout(r, 1500));
      // Manually complete this task
      completedTasks++;
      log(`Task completed: ${demoTasks[i].id}`);
      i++;
      nextTask();
      return;
    }
    if (demoTasks[i].id === "job_scan") {
      negotiationSteps.push("🧠 Career Compass AI: James had shared with me Dream companies Google, Netflix, Meta");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("I see Job posting just happened few hours back");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("James profile matches 95% at these Jobs");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Applying to these jobs");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("Starting job application process...");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("✅ Success: Job applications submitted to Google, Netflix, Meta");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("James already has Amazon Interview");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("So, Retrieving Interview Prep resources and uploading under Career Hub for James");
      await new Promise(r => setTimeout(r, 800));
      negotiationSteps.push("✅ Success: Interview prep resources, Recent interview coding problems uploaded to Career Hub ✅");
      alerts.push({ type: 'career', message: 'Job applications submitted and interview prep resources uploaded to Career Hub.' });
      // Add delay to show success message
      await new Promise(r => setTimeout(r, 1500));
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

export default router; 