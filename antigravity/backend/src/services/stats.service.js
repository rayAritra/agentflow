import Workout from '../models/Workout.model.js';

export const computeStreak = async (userId) => {
  const workouts = await Workout.find({ user: userId, isTemplate: false })
    .sort({ date: -1 })
    .select('date');

  if (workouts.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < workouts.length; i++) {
    const workoutDate = new Date(workouts[i].date);
    workoutDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(currentDate - workoutDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Workout today, streak continues
      if (i === 0) streak = 1;
    } else if (diffDays === 1) {
      // Workout yesterday, streak continues
      streak++;
      currentDate = workoutDate;
    } else {
      // Break in streak
      if (i === 0 && diffDays > 1) {
        // No workout today or yesterday, streak is 0
        streak = 0;
      }
      break;
    }
  }

  return streak;
};

export const getTotalVolume = async (userId, days = 30) => {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const workouts = await Workout.find({ 
    user: userId, 
    isTemplate: false,
    date: { $gte: dateLimit }
  });

  return workouts.reduce((total, workout) => total + workout.totalVolume, 0);
};

export const getWeeklyVolume = async (userId, weeks = 12) => {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - (weeks * 7));

  const workouts = await Workout.find({
    user: userId,
    isTemplate: false,
    date: { $gte: dateLimit }
  }).sort({ date: 1 });

  // Group by week (using start of week)
  const weeklyData = {};
  
  workouts.forEach(workout => {
    const d = new Date(workout.date);
    // Get Monday of the week
    const day = d.getDay() || 7; 
    if(day !== 1) d.setHours(-24 * (day - 1)); 
    d.setHours(0,0,0,0);
    
    const weekKey = d.toISOString().split('T')[0];
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = 0;
    }
    weeklyData[weekKey] += workout.totalVolume;
  });

  return Object.entries(weeklyData).map(([week, volume]) => ({ week, volume }));
};

export const getPersonalRecords = async (userId) => {
  const workouts = await Workout.find({ user: userId, isTemplate: false }).populate('exercises.exercise');
  
  const prs = {}; // key: exerciseId, value: { maxWeight, date, name }
  
  workouts.forEach(workout => {
    workout.exercises.forEach(ex => {
      const exerciseId = ex.exercise?._id?.toString() || ex.exercise?.toString();
      const exerciseName = ex.exerciseName;
      
      ex.sets.forEach(set => {
        if (set.completed) {
          if (!prs[exerciseId] || set.weight > prs[exerciseId].maxWeight) {
            prs[exerciseId] = {
              name: exerciseName,
              maxWeight: set.weight,
              date: workout.date
            };
          }
        }
      });
    });
  });
  
  return Object.values(prs).sort((a, b) => b.maxWeight - a.maxWeight);
};

export const getMuscleGroupBreakdown = async (userId, days = 30) => {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const workouts = await Workout.find({ 
    user: userId, 
    isTemplate: false,
    date: { $gte: dateLimit }
  });

  const breakdown = {};
  let totalSets = 0;

  workouts.forEach(workout => {
    workout.exercises.forEach(ex => {
      const completedSets = ex.sets.filter(s => s.completed).length;
      if (completedSets > 0) {
        if (!breakdown[ex.muscleGroup]) breakdown[ex.muscleGroup] = 0;
        breakdown[ex.muscleGroup] += completedSets;
        totalSets += completedSets;
      }
    });
  });

  // Convert to percentages
  if (totalSets === 0) return {};
  
  Object.keys(breakdown).forEach(key => {
    breakdown[key] = Math.round((breakdown[key] / totalSets) * 100);
  });

  return breakdown;
};
