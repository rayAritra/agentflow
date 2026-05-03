import express from 'express';
import { getExercises } from '../controllers/exercise.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getExercises);

export default router;
