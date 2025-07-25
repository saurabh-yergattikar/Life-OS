import { Router, Request, Response } from 'express';
import { geminiChat } from '../agent/geminiAgent';
const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
    const aiResponse = await geminiChat(prompt);
    res.json({ response: aiResponse });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Gemini API error', details: (err as Error).message });
  }
});

export default router; 