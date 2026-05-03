import { X, Plus } from 'lucide-react';
import Badge from '../ui/Badge';
import SetRow from './SetRow';
import { useWorkoutStore } from '../../store/workout.store';

const ExerciseRow = ({ exercise, exerciseIndex }) => {
  const { removeExercise, addSet, removeSet, updateSet } = useWorkoutStore();

  return (
    <div className="card border-l-4 border-l-lime-400">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {exercise.exerciseName}
            <Badge type={exercise.muscleGroup}>{exercise.muscleGroup}</Badge>
          </h3>
        </div>
        <button 
          onClick={() => removeExercise(exercise._id)}
          className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {/* Table Header */}
        <div className="flex text-xs font-medium text-zinc-500 uppercase tracking-wider px-2">
          <div className="w-12 text-center">Set</div>
          <div className="flex-1 text-center">kg</div>
          <div className="flex-1 text-center">Reps</div>
          <div className="w-12 text-center"><CheckIcon className="w-4 h-4 mx-auto" /></div>
        </div>

        {exercise.sets.map((set, setIndex) => (
          <SetRow 
            key={setIndex}
            exerciseId={exercise._id}
            setIndex={setIndex}
            set={set}
            onRemove={() => removeSet(exercise._id, setIndex)}
            onUpdate={(field, value) => updateSet(exercise._id, setIndex, field, value)}
          />
        ))}
      </div>

      <button 
        onClick={() => addSet(exercise._id)}
        className="w-full py-2 border border-dashed border-zinc-700 text-zinc-400 hover:text-lime-400 hover:border-lime-400/50 hover:bg-lime-400/5 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all"
      >
        <Plus className="w-4 h-4" /> Add Set
      </button>
    </div>
  );
};

// Extracted for the header
const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default ExerciseRow;
