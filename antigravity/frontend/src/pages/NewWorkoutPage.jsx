import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Save, X, Plus } from 'lucide-react';
import { useWorkoutStore } from '../store/workout.store';
import { useSaveWorkout } from '../hooks/useWorkouts';
import { useExercises } from '../hooks/useExercises';
import ExerciseRow from '../components/workout/ExerciseRow';
import WorkoutTimer from '../components/workout/WorkoutTimer';
import toast from 'react-hot-toast';

const NewWorkoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeWorkout, startWorkout, setWorkoutName, addExercise, cancelWorkout } = useWorkoutStore();
  const saveWorkoutMutation = useSaveWorkout();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  
  const { data: searchResults } = useExercises(debouncedSearch);

  // Handle debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Start workout on mount if not active
  useEffect(() => {
    if (!activeWorkout) {
      startWorkout(location.state?.template || null);
    }
  }, [activeWorkout, startWorkout, location.state]);

  if (!activeWorkout) return null;

  const handleSave = () => {
    if (activeWorkout.exercises.length === 0) {
      toast.error('Add at least one exercise');
      return;
    }

    const duration = Math.floor((Date.now() - activeWorkout.startTime) / 60000);
    
    saveWorkoutMutation.mutate({
      name: activeWorkout.name,
      duration,
      isTemplate,
      exercises: activeWorkout.exercises.map(ex => ({
        exercise: ex.exercise,
        exerciseName: ex.exerciseName,
        muscleGroup: ex.muscleGroup,
        sets: ex.sets
      }))
    }, {
      onSuccess: () => {
        cancelWorkout();
        navigate('/workouts/history');
      }
    });
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Progress will be lost.')) {
      cancelWorkout();
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={activeWorkout.name}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="bg-transparent text-2xl font-bold text-white outline-none w-full placeholder-zinc-700"
            placeholder="Workout Name"
          />
        </div>
        <div className="flex items-center gap-4">
          <WorkoutTimer />
          <button onClick={handleCancel} className="text-zinc-500 hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={saveWorkoutMutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> 
            {saveWorkoutMutation.isPending ? 'Saving...' : 'Finish'}
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="templateToggle"
            checked={isTemplate}
            onChange={(e) => setIsTemplate(e.target.checked)}
            className="w-4 h-4 text-lime-400 bg-zinc-900 border-zinc-800 rounded focus:ring-lime-400 focus:ring-2"
          />
          <label htmlFor="templateToggle" className="text-sm text-zinc-400 font-medium cursor-pointer">
            Save as reusable Template
          </label>
        </div>

        <div className="space-y-6 mb-8">
          {activeWorkout.exercises.map((ex, idx) => (
            <ExerciseRow key={ex._id} exercise={ex} exerciseIndex={idx} />
          ))}
        </div>

        {/* Exercise Search/Add */}
        <div className="relative">
          {!showExerciseSearch ? (
            <button 
              onClick={() => setShowExerciseSearch(true)}
              className="w-full card hover:bg-zinc-800/50 border-dashed transition-all flex flex-col items-center justify-center p-8 text-zinc-400 hover:text-lime-400 group"
            >
              <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Add Exercise</span>
            </button>
          ) : (
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>
                <button 
                  onClick={() => { setShowExerciseSearch(false); setSearchTerm(''); }}
                  className="p-3 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto rounded-lg border border-zinc-800">
                {searchResults?.map(ex => (
                  <button
                    key={ex._id}
                    onClick={() => {
                      addExercise(ex);
                      setShowExerciseSearch(false);
                      setSearchTerm('');
                    }}
                    className="w-full flex items-center justify-between p-3 border-b border-zinc-800 hover:bg-zinc-800 text-left transition-colors last:border-0"
                  >
                    <div>
                      <div className="text-white font-medium">{ex.name}</div>
                      <div className="text-xs text-zinc-500">{ex.muscleGroup} • {ex.equipment}</div>
                    </div>
                    <Plus className="w-4 h-4 text-lime-400" />
                  </button>
                ))}
                {searchResults?.length === 0 && (
                  <div className="p-4 text-center text-zinc-500">No exercises found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewWorkoutPage;
