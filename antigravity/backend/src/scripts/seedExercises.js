import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from '../models/Exercise.model.js';
import connectDB from '../config/db.js';

import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const exercises = [
  // Chest
  { name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { name: 'Incline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { name: 'Cable Fly', muscleGroup: 'Chest', equipment: 'Cable' },
  { name: 'Chest Dips', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { name: 'Push-up', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { name: 'Pec Deck Machine', muscleGroup: 'Chest', equipment: 'Machine' },

  // Back
  { name: 'Pull-up', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { name: 'Barbell Row', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },
  { name: 'Seated Cable Row', muscleGroup: 'Back', equipment: 'Cable' },
  { name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Face Pull', muscleGroup: 'Back', equipment: 'Cable' },

  // Legs
  { name: 'Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs', equipment: 'Barbell' },
  { name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Walking Lunges', muscleGroup: 'Legs', equipment: 'Dumbbell' },
  { name: 'Leg Curl', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Calf Raise', muscleGroup: 'Legs', equipment: 'Machine' },

  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Front Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { name: 'Rear Delt Fly', muscleGroup: 'Shoulders', equipment: 'Machine' },
  { name: 'Arnold Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },

  // Arms
  { name: 'Barbell Curl', muscleGroup: 'Arms', equipment: 'Barbell' },
  { name: 'Hammer Curl', muscleGroup: 'Arms', equipment: 'Dumbbell' },
  { name: 'Tricep Pushdown', muscleGroup: 'Arms', equipment: 'Cable' },
  { name: 'Skull Crusher', muscleGroup: 'Arms', equipment: 'Barbell' },
  { name: 'Tricep Dips', muscleGroup: 'Arms', equipment: 'Bodyweight' },

  // Core
  { name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'Core', equipment: 'Other' },
  { name: 'Cable Crunch', muscleGroup: 'Core', equipment: 'Cable' },
  { name: 'Hanging Leg Raise', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { name: 'Russian Twist', muscleGroup: 'Core', equipment: 'Bodyweight' },
];

const seedExercises = async () => {
  try {
    await connectDB();
    
    await Exercise.deleteMany(); // Clear existing
    console.log('Exercises cleared');

    await Exercise.insertMany(exercises);
    console.log('Exercises seeded successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
};

seedExercises();
