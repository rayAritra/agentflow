import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    muscleGroup: {
      type: String,
      enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'],
      required: true
    },
    equipment: {
      type: String,
      enum: ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Other'],
      required: true
    },
    instructions: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
