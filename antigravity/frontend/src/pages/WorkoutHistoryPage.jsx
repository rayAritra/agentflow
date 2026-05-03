import { useState } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import WorkoutCard from '../components/workout/WorkoutCard';
import EmptyState from '../components/ui/EmptyState';
import { History, Search } from 'lucide-react';

const WorkoutHistoryPage = () => {
  const { data: workouts, isLoading } = useWorkouts();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div></div>;
  }

  const filteredWorkouts = workouts?.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.exercises.some(ex => ex.exerciseName.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <History className="w-8 h-8 text-lime-400" />
            Workout History
          </h1>
          <p className="text-zinc-400">Review your past performance and log</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full pl-10"
          />
        </div>
      </div>

      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map(workout => (
            <WorkoutCard key={workout._id} workout={workout} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={History}
          title="No history found"
          description={searchTerm ? "No workouts match your search." : "You haven't logged any workouts yet."}
          actionText={!searchTerm ? "Start Workout" : undefined}
          actionLink={!searchTerm ? "/workouts/new" : undefined}
        />
      )}
    </div>
  );
};

export default WorkoutHistoryPage;
