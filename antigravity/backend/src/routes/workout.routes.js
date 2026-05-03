import express from 'express';
import { createWorkout, getWorkouts, getTemplates, getWorkoutById, getStats } from '../controllers/workout.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createWorkout)
  .get(getWorkouts);

router.get('/stats', getStats);
router.get('/templates', getTemplates);
router.get('/:id', getWorkoutById);

export default router;
