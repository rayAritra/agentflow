import express from 'express';
import { createMission, getMissions, getMission } from '../controllers/mission.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect); // All mission routes require auth

router.route('/')
  .post(createMission)
  .get(getMissions);

router.route('/:id')
  .get(getMission);

export default router;
