"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geminiAgent_1 = require("../agent/geminiAgent");
const router = (0, express_1.Router)();
// Store active agent sessions
const activeSessions = new Map();
router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt)
            return res.status(400).json({ error: 'Missing prompt' });
        // Check if this looks like a complex task that needs multi-agent processing
        const complexTaskKeywords = ['interview', 'prepare', 'plan', 'strategy', 'research', 'analysis', 'project'];
        const isComplexTask = complexTaskKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
        if (isComplexTask) {
            // Handle as multi-agent task
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            // Start analysis
            activeSessions.set(sessionId, {
                tasks: [],
                originalQuery: prompt,
                status: 'analyzing'
            });
            // Analyze task and create agents
            const analysis = await (0, geminiAgent_1.analyzeTaskAndCreateAgents)(prompt);
            // Update session with tasks
            activeSessions.set(sessionId, {
                tasks: analysis.tasks,
                originalQuery: prompt,
                status: 'executing'
            });
            // Start executing tasks in parallel
            const taskPromises = analysis.tasks.map(async (task) => {
                const updatedTask = await (0, geminiAgent_1.executeAgentTask)(task);
                const session = activeSessions.get(sessionId);
                if (session) {
                    session.tasks = session.tasks.map(t => t.id === task.id ? updatedTask : t);
                    activeSessions.set(sessionId, session);
                }
                return updatedTask;
            });
            // Wait for all tasks to complete
            const completedTasks = await Promise.all(taskPromises);
            // Generate final summary
            const summary = await (0, geminiAgent_1.generateFinalSummary)(completedTasks, prompt);
            // Update session as completed
            activeSessions.set(sessionId, {
                tasks: completedTasks,
                originalQuery: prompt,
                status: 'completed',
                summary
            });
            res.json({
                response: analysis.acknowledgment,
                sessionId,
                tasks: completedTasks,
                summary,
                type: 'multi_agent'
            });
        }
        else {
            // Handle as simple chat
            const aiResponse = await (0, geminiAgent_1.geminiChat)(prompt);
            res.json({ response: aiResponse, type: 'simple' });
        }
    }
    catch (err) {
        console.error('Chat API error:', err);
        res.status(500).json({ error: 'Chat API error', details: err.message });
    }
});
// Get session status and tasks
router.get('/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = activeSessions.get(sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    res.json({
        sessionId,
        status: session.status,
        tasks: session.tasks,
        summary: session.summary,
        originalQuery: session.originalQuery
    });
});
// Get all active sessions
router.get('/sessions', (req, res) => {
    const sessions = Array.from(activeSessions.entries()).map(([sessionId, session]) => ({
        sessionId,
        status: session.status,
        taskCount: session.tasks.length,
        completedTasks: session.tasks.filter(t => t.status === 'completed').length,
        originalQuery: session.originalQuery
    }));
    res.json({ sessions });
});
exports.default = router;
