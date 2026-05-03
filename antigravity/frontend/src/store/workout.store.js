import { create } from 'zustand';

// Store for managing the state of an active workout being logged
export const useWorkoutStore = create((set, get) => ({
  activeWorkout: null,
  
  startWorkout: (template = null) => {
    if (template) {
      // Start from template
      const exercises = template.exercises.map(ex => ({
        ...ex,
        _id: Math.random().toString(36).substr(2, 9), // temp id for UI list key
        sets: ex.sets.map(s => ({ ...s, completed: false }))
      }));
      
      set({ 
        activeWorkout: { 
          name: template.name, 
          exercises,
          startTime: Date.now()
        } 
      });
    } else {
      // Empty workout
      set({ 
        activeWorkout: { 
          name: 'New Workout', 
          exercises: [],
          startTime: Date.now()
        } 
      });
    }
  },

  setWorkoutName: (name) => set((state) => ({
    activeWorkout: { ...state.activeWorkout, name }
  })),

  addExercise: (exercise) => set((state) => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: [
        ...state.activeWorkout.exercises,
        {
          _id: Math.random().toString(36).substr(2, 9),
          exercise: exercise._id,
          exerciseName: exercise.name,
          muscleGroup: exercise.muscleGroup,
          sets: [{ reps: 0, weight: 0, completed: false }]
        }
      ]
    }
  })),

  removeExercise: (exerciseId) => set((state) => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: state.activeWorkout.exercises.filter(ex => ex._id !== exerciseId)
    }
  })),

  addSet: (exerciseId) => set((state) => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: state.activeWorkout.exercises.map(ex => {
        if (ex._id === exerciseId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [...ex.sets, { 
              reps: lastSet ? lastSet.reps : 0, 
              weight: lastSet ? lastSet.weight : 0, 
              completed: false 
            }]
          };
        }
        return ex;
      })
    }
  })),

  removeSet: (exerciseId, setIndex) => set((state) => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: state.activeWorkout.exercises.map(ex => {
        if (ex._id === exerciseId) {
          return { ...ex, sets: ex.sets.filter((_, idx) => idx !== setIndex) };
        }
        return ex;
      })
    }
  })),

  updateSet: (exerciseId, setIndex, field, value) => set((state) => ({
    activeWorkout: {
      ...state.activeWorkout,
      exercises: state.activeWorkout.exercises.map(ex => {
        if (ex._id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((s, idx) => {
              if (idx === setIndex) {
                return { ...s, [field]: value };
              }
              return s;
            })
          };
        }
        return ex;
      })
    }
  })),

  finishWorkout: () => {
    const data = get().activeWorkout;
    set({ activeWorkout: null });
    return data;
  },

  cancelWorkout: () => set({ activeWorkout: null })
}));
