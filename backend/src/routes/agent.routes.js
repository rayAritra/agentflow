import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Future use: Manual agent triggering or agent-specific endpoints
router.get('/status', protect, (req, res) => {
  res.json({ success: true, message: 'Agents are handled via BullMQ workers' });
});

export default router;
