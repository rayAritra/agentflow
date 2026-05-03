import express from 'express';
import { subscribeToMission } from '../controllers/sse.controller.js';

const router = express.Router();

// Note: SSE typically doesn't use standard JWT header auth easily with EventSource
// If we want auth, we'd pass token in query param and verify it here.
// For simplicity in this demo, we allow subscription by missionId.

router.get('/:missionId', subscribeToMission);

export default router;
