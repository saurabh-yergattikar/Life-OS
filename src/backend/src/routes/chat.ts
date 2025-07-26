import { Router, Request, Response } from 'express';
import { geminiChat, processInterviewPrep, InterviewPrepResponse } from '../agent/geminiAgent';
const router = Router();

// Store active interview prep sessions
const activeSessions = new Map<string, InterviewPrepResponse>();

// Helper function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
    
    // Check if this is an interview-related request
    const interviewKeywords = ['interview', 'amazon', 'google', 'microsoft', 'facebook', 'meta', 'apple', 'netflix', 'behavioral', 'technical', 'mock', 'prepare', 'senior', 'backend', 'frontend'];
    const isInterviewRequest = interviewKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );

    if (isInterviewRequest) {
      // Handle as interview prep agent request
      const sessionId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        // Process with interview prep agent
        const interviewResponse = await withTimeout(processInterviewPrep(prompt), 60000); // 1 minute timeout
        
        // Store session
        activeSessions.set(sessionId, interviewResponse);
        
        res.json({
          response: interviewResponse.summary, // Only send the summary
          sessionId,
          actions: interviewResponse.actions,
          summary: interviewResponse.summary,
          progress: interviewResponse.progress, // Include progress updates
          type: 'interview_prep'
        });
      } catch (error) {
        console.error('Interview prep agent failed:', error);
        
        // Fallback to simple response
        const fallbackResponse = await withTimeout(geminiChat(prompt), 10000);
        res.json({ 
          response: fallbackResponse, 
          type: 'simple',
          error: 'Interview prep processing failed, using simple response'
        });
      }
    } else {
      // Handle as simple chat with timeout
      const aiResponse = await withTimeout(geminiChat(prompt), 15000); // 15 second timeout
      res.json({ response: aiResponse, type: 'simple' });
    }
  } catch (err) {
    console.error('Chat API error:', err);
    res.status(500).json({ 
      error: 'Chat API error', 
      details: (err as Error).message,
      type: 'error'
    });
  }
});

// Get session status and actions
router.get('/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = activeSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({
    sessionId,
    analysis: session.analysis,
    actions: session.actions,
    summary: session.summary,
    progress: session.progress
  });
});

// Get all active sessions
router.get('/sessions', (req: Request, res: Response) => {
  const sessions = Array.from(activeSessions.entries()).map(([sessionId, session]) => ({
    sessionId,
    analysis: session.analysis,
    actionCount: session.actions.length,
    completedActions: session.actions.filter(a => a.status === 'completed').length,
    progress: session.progress
  }));
  
  res.json({ sessions });
});

export default router; 