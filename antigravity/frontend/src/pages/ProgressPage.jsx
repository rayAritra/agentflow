import { TrendingUp, Activity } from 'lucide-react';
import { useStats } from '../hooks/useWorkouts';
import VolumeChart from '../components/charts/VolumeChart';
import PRTable from '../components/charts/PRTable';

const ProgressPage = () => {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-lime-400" />
          Progress & Analytics
        </h1>
        <p className="text-zinc-400">Track your gains over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Weekly Volume (12 Weeks)</h2>
            <VolumeChart data={stats?.weeklyVolume || []} />
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Personal Records</h2>
            <PRTable prs={stats?.prs || []} />
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
          <div className="card">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-lime-400" />
              Muscle Distribution (30d)
            </h2>
            
            {stats?.muscleBreakdown && Object.keys(stats.muscleBreakdown).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.muscleBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([muscle, percentage]) => (
                  <div key={muscle}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">{muscle}</span>
                      <span className="text-lime-400">{percentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className="bg-lime-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm text-center">No recent data</p>
            )}
          </div>
          
          <div className="card bg-lime-400 text-zinc-950 border-none p-6">
            <h3 className="font-bold text-lg mb-2">Coach's Insight</h3>
            <p className="text-sm font-medium opacity-80 leading-relaxed mb-4">
              "Your consistency is looking great! Based on your 30-day breakdown, consider adding a bit more volume to your Back exercises to balance out your Push volume."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
