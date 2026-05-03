import Workout from '../models/Workout.model.js';
import { computeStreak, getTotalVolume, getWeeklyVolume, getPersonalRecords, getMuscleGroupBreakdown } from '../services/stats.service.js';

export const createWorkout = async (req, res) => {
  try {
    const { name, duration, notes, exercises, isTemplate } = req.body;

    const workout = await Workout.create({
      user: req.user.id,
      name,
      duration,
      notes,
      exercises,
      isTemplate
    });

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id, isTemplate: false })
      .sort({ date: -1 });
    
    res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await Workout.find({ user: req.user.id, isTemplate: true })
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [streak, totalVolume, weeklyVolume, prs, muscleBreakdown] = await Promise.all([
      computeStreak(userId),
      getTotalVolume(userId, 30),
      getWeeklyVolume(userId, 12),
      getPersonalRecords(userId),
      getMuscleGroupBreakdown(userId, 30)
    ]);

    res.status(200).json({
      success: true,
      data: {
        streak,
        totalVolume,
        weeklyVolume,
        prs,
        muscleBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
