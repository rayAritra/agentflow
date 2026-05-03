import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
  completed: { type: Boolean, default: false }
});

const workoutExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  exerciseName: { type: String, required: true }, // Denormalized for easy querying
  muscleGroup: { type: String, required: true },
  sets: [setSchema]
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: 'Workout'
    },
    date: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number, // in minutes
      default: 0
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: ''
    },
    exercises: [workoutExerciseSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total volume
workoutSchema.virtual('totalVolume').get(function() {
  if (!this.exercises) return 0;
  return this.exercises.reduce((acc, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setAcc, set) => {
      // Only count completed sets for volume
      if (set.completed) {
        return setAcc + (set.reps * set.weight);
      }
      return setAcc;
    }, 0);
    return acc + exerciseVolume;
  }, 0);
});

// Virtual for total sets
workoutSchema.virtual('totalSets').get(function() {
  if (!this.exercises) return 0;
  return this.exercises.reduce((acc, exercise) => {
    return acc + exercise.sets.length;
  }, 0);
});

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
