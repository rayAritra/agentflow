import { Link } from 'react-router-dom';
import { Flame, Dumbbell, Calendar, Trophy, Plus, ArrowRight } from 'lucide-react';
import { useStats, useWorkouts } from '../hooks/useWorkouts';
import { useAuthStore } from '../store/auth.store';
import StatCard from '../components/ui/StatCard';
import WorkoutCard from '../components/workout/WorkoutCard';
import EmptyState from '../components/ui/EmptyState';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: workouts, isLoading: workoutsLoading } = useWorkouts();

  if (statsLoading || workoutsLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div></div>;
  }

  const recentWorkouts = workouts?.slice(0, 3) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-zinc-400">Ready to crush your goals today?</p>
        </div>
        <Link to="/workouts/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Start Workout
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Current Streak" 
          value={`${stats?.streak || 0} Days`} 
          icon={Flame} 
          color="orange"
        />
        <StatCard 
          title="Total Volume (30d)" 
          value={`${(stats?.totalVolume || 0).toLocaleString()} kg`} 
          icon={Dumbbell} 
          color="lime"
        />
        <StatCard 
          title="Total PRs" 
          value={stats?.prs?.length || 0} 
          icon={Trophy} 
          color="purple"
        />
        <StatCard 
          title="Workouts (All Time)" 
          value={workouts?.length || 0} 
          icon={Calendar} 
          color="blue"
        />
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Workouts</h2>
          <Link to="/workouts/history" className="text-lime-400 hover:text-lime-300 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentWorkouts.map(workout => (
              <WorkoutCard key={workout._id} workout={workout} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Dumbbell}
            title="No workouts yet"
            description="Your fitness journey begins today. Log your first workout to start tracking your progress."
            actionText="Start First Workout"
            actionLink="/workouts/new"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
