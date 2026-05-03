import { Dumbbell } from 'lucide-react';
import Badge from '../ui/Badge';

const ExerciseCard = ({ exercise, onClick }) => {
  return (
    <div 
      className="card hover:border-lime-400/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors">
          {exercise.name}
        </h3>
        <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-400">
          <Dumbbell className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge type={exercise.muscleGroup}>{exercise.muscleGroup}</Badge>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          {exercise.equipment}
        </span>
      </div>
    </div>
  );
};

export default ExerciseCard;
