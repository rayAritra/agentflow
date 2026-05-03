import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Copy } from 'lucide-react';
import Badge from '../ui/Badge';

const WorkoutCard = ({ workout, onSaveAsTemplate }) => {
  return (
    <div className="card hover:border-zinc-700 transition-colors group relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {workout.isTemplate ? workout.name : workout.name}
            {workout.isTemplate && <span className="ml-2 text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Template</span>}
          </h3>
          <p className="text-sm text-zinc-500">
            {workout.isTemplate 
              ? `${workout.exercises.length} exercises`
              : formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
          </p>
        </div>
        
        {!workout.isTemplate && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-medium text-lime-400">
              {workout.totalVolume?.toLocaleString()} kg
            </span>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="w-3 h-3" />
              {workout.duration}m
            </div>
          </div>
        )}
      </div>

      {/* Preview exercises */}
      <div className="space-y-2 mb-4">
        {workout.exercises.slice(0, 3).map((ex, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-zinc-700" />
            <span className="text-zinc-300 truncate flex-1">{ex.exerciseName}</span>
            <Badge type={ex.muscleGroup}>{ex.muscleGroup}</Badge>
          </div>
        ))}
        {workout.exercises.length > 3 && (
          <div className="text-xs text-zinc-600 font-medium pl-6">
            + {workout.exercises.length - 3} more exercises
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800/50">
        {workout.isTemplate ? (
           <Link 
            to="/workouts/new" 
            state={{ template: workout }}
            className="btn-primary w-full text-center"
           >
            Use Template
           </Link>
        ) : (
          <>
            <Link to={`/workouts/${workout._id}`} className="btn-ghost flex-1 text-center bg-zinc-800/50">
              View Details
            </Link>
            {onSaveAsTemplate && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onSaveAsTemplate(workout);
                }}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800"
                title="Save as template"
              >
                <Copy className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;
