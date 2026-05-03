import { useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { useExercises } from '../hooks/useExercises';
import ExerciseCard from '../components/exercises/ExerciseCard';
import EmptyState from '../components/ui/EmptyState';

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'];

const ExercisesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  
  const { data: exercises, isLoading } = useExercises(searchTerm, selectedMuscleGroup);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-lime-400" />
            Exercise Library
          </h1>
          <p className="text-zinc-400">Browse and learn about movements</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full pl-10"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <Filter className="w-5 h-5 text-zinc-500 mr-2 shrink-0" />
        {MUSCLE_GROUPS.map((mg) => (
          <button
            key={mg}
            onClick={() => setSelectedMuscleGroup(mg)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedMuscleGroup === mg 
                ? 'bg-lime-400 text-zinc-950' 
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {mg}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div></div>
      ) : (
        exercises?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exercises.map((exercise) => (
              <ExerciseCard 
                key={exercise._id} 
                exercise={exercise} 
                onClick={() => {}} // Could open a modal with details
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={BookOpen}
            title="No exercises found"
            description="Try adjusting your search or filter criteria."
          />
        )
      )}
    </div>
  );
};

export default ExercisesPage;
