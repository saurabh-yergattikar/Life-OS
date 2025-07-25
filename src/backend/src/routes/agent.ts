import { Router, Request, Response } from 'express';
const router = Router();
router.post('/run', (req: Request, res: Response) => {
  res.json({ message: 'Agent endpoint working!' });
});
export default router; 