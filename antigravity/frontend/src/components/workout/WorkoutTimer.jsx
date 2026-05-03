import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useWorkoutStore } from '../../store/workout.store';

const WorkoutTimer = ({ onTick }) => {
  const startTime = useWorkoutStore(state => state.activeWorkout?.startTime);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - startTime) / 1000);
      setElapsed(diffInSeconds);
      if (onTick && diffInSeconds % 60 === 0) {
        onTick(Math.floor(diffInSeconds / 60)); // tick in minutes
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, onTick]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ];
    
    if (hours > 0) {
      parts.unshift(hours.toString());
    }

    return parts.join(':');
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-lime-400 font-mono text-sm font-medium">
      <Clock className="w-4 h-4" />
      {formatTime(elapsed)}
    </div>
  );
};

export default WorkoutTimer;
