"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geminiAgent_1 = require("../agent/geminiAgent");
const router = (0, express_1.Router)();
// Store active interview prep sessions
const activeSessions = new Map();
// Helper function to add timeout to promises
const withTimeout = (promise, timeoutMs) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeoutMs))
    ]);
};
router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt)
            return res.status(400).json({ error: 'Missing prompt' });
        const interviewKeywords = ['interview', 'amazon', 'google', 'microsoft', 'facebook', 'meta', 'apple', 'netflix', 'behavioral', 'technical', 'mock', 'prepare', 'senior', 'backend', 'frontend'];
        const emergencyKeywords = [
            'emergency', 'crisis', 'urgent', 'immediate', 'help', 'fall', 'accident', 'hospital', 'mom', 'dad', 'family', 'sick', 'hurt', 'broken', 'bleeding', 'pain', 'unconscious', 'ambulance', '911', 'critical', 'life', 'death', 'serious', 'emergency room', 'ER', 'ICU', 'intensive care',
            // Work-life balance conflicts
            'production deployment', 'deployment', 'pick up', 'pickup', 'daughter', 'son', 'child', 'school', 'urgent meeting', 'critical meeting', 'deadline', 'conflict', 'time conflict', 'schedule conflict',
            // Time-sensitive situations
            'now', 'immediately', 'asap', 'right now', 'urgently', 'critical', 'important', 'urgent', 'time sensitive', 'time-sensitive',
            // Family emergencies
            'family emergency', 'parent', 'childcare', 'child care', 'babysitter', 'nanny', 'caregiver',
            // Work emergencies
            'server down', 'outage', 'system crash', 'database', 'production issue', 'live issue', 'customer issue', 'client emergency'
        ];
        const isInterviewRequest = interviewKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
        const isEmergencyRequest = emergencyKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
        if (isEmergencyRequest) {
            const sessionId = `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            try {
                const emergencyResponse = await withTimeout((0, geminiAgent_1.emergencyCrisisAgent)(prompt), 60000);
                activeSessions.set(sessionId, emergencyResponse);
                res.json({
                    response: emergencyResponse.summary,
                    sessionId,
                    actions: emergencyResponse.actions,
                    summary: emergencyResponse.summary,
                    progress: emergencyResponse.progress,
                    type: 'emergency_crisis'
                });
            }
            catch (error) {
                console.error('Emergency crisis agent failed:', error);
                const fallbackResponse = await withTimeout((0, geminiAgent_1.geminiChat)(prompt), 10000);
                res.status(500).json({
                    response: fallbackResponse,
                    type: 'simple',
                    error: 'Emergency crisis processing failed, using simple response'
                });
            }
        }
        else if (isInterviewRequest) {
            const sessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            try {
                const interviewResponse = await withTimeout((0, geminiAgent_1.interviewPrepAgent)(prompt), 60000);
                activeSessions.set(sessionId, interviewResponse);
                res.json({
                    response: interviewResponse.summary,
                    sessionId,
                    actions: interviewResponse.actions,
                    summary: interviewResponse.summary,
                    progress: interviewResponse.progress,
                    type: 'interview_prep'
                });
            }
            catch (error) {
                console.error('Interview prep agent failed:', error);
                const fallbackResponse = await withTimeout((0, geminiAgent_1.geminiChat)(prompt), 10000);
                res.status(500).json({
                    response: fallbackResponse,
                    type: 'simple',
                    error: 'Interview prep processing failed, using simple response'
                });
            }
        }
        else {
            const aiResponse = await withTimeout((0, geminiAgent_1.geminiChat)(prompt), 15000);
            res.json({ response: aiResponse, type: 'simple' });
        }
    }
    catch (err) {
        console.error('Chat API error:', err);
        res.status(500).json({
            error: 'Chat API error',
            details: err.message,
            type: 'error'
        });
    }
});
// Get session status and actions
router.get('/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = activeSessions.get(sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    res.json({
        sessionId,
        type: sessionId.startsWith('emergency_') ? 'emergency_crisis' : 'interview_prep',
        analysis: session.analysis,
        actions: session.actions,
        summary: session.summary,
        progress: session.progress
    });
});
// Get all active sessions
router.get('/sessions', (req, res) => {
    const sessions = Array.from(activeSessions.entries()).map(([sessionId, session]) => ({
        sessionId,
        type: sessionId.startsWith('emergency_') ? 'emergency_crisis' : 'interview_prep',
        analysis: session.analysis,
        actions: session.actions,
        summary: session.summary,
        progress: session.progress
    }));
    res.json({ sessions });
});
exports.default = router;
