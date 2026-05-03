import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout } from '../hooks/useWorkouts';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Dumbbell, Calendar, CheckCircle2 } from 'lucide-react';
import Badge from '../components/ui/Badge';

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: workout, isLoading } = useWorkout(id);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div></div>;
  }

  if (!workout) {
    return <div className="p-8 text-center text-zinc-400">Workout not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="card mb-8 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{workout.name}</h1>
            <div className="flex items-center gap-4 text-zinc-400 text-sm">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {format(new Date(workout.date), 'MMMM d, yyyy h:mm a')}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {workout.duration} min</span>
              <span className="flex items-center gap-1"><Dumbbell className="w-4 h-4" /> {workout.totalVolume?.toLocaleString()} kg volume</span>
            </div>
          </div>
        </div>

        {workout.notes && (
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-8 text-zinc-300 text-sm">
            <span className="font-bold block mb-1">Notes:</span>
            {workout.notes}
          </div>
        )}

        <div className="space-y-8">
          {workout.exercises.map((ex, index) => (
            <div key={index} className="border border-zinc-800 rounded-xl overflow-hidden">
              <div className="bg-zinc-800/50 p-4 flex justify-between items-center border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-lime-400/20 text-lime-400 text-xs flex items-center justify-center">{index + 1}</span>
                  {ex.exerciseName}
                </h3>
                <Badge type={ex.muscleGroup}>{ex.muscleGroup}</Badge>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">
                  <div>Set</div>
                  <div>kg</div>
                  <div>Reps</div>
                  <div className="text-right">Status</div>
                </div>
                
                <div className="space-y-2">
                  {ex.sets.map((set, sIndex) => (
                    <div key={sIndex} className={`grid grid-cols-4 text-sm px-2 py-2 rounded-lg items-center ${set.completed ? 'bg-lime-400/5 text-white' : 'text-zinc-500'}`}>
                      <div className="font-medium">{sIndex + 1}</div>
                      <div>{set.weight}</div>
                      <div>{set.reps}</div>
                      <div className="text-right flex justify-end">
                        {set.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-lime-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-zinc-700" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;
