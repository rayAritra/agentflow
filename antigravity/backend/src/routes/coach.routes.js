import express from 'express';
import { getChatHistory, streamCoachResponse } from '../controllers/coach.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/history', getChatHistory);
router.post('/stream', streamCoachResponse);

export default router;
