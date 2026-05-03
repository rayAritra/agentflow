import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { missionAPI } from '../services/api.service';
import { useAuthStore } from '../store/auth.store';
import MissionCard from '../components/dashboard/MissionCard';
import { Loader2, TrendingUp, TrendingDown, Target, Zap, Clock, FileText, Sparkles, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

// Simple custom hook for count up animation
const useCountUp = (end, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

const StatCard = ({ title, value, icon: Icon, trend, isPositive, colorClass, gradientClass, delayClass }) => {
  const animatedValue = useCountUp(value);
  
  return (
    <div className={`card p-6 relative overflow-hidden group animate-fade-in-up ${delayClass}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${gradientClass} z-10 opacity-70 group-hover:opacity-100 transition-opacity`}></div>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
        <Icon className={`w-24 h-24 ${colorClass}`} />
      </div>
      
      <div className="relative z-20">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">{title}</p>
          <div className={`p-2 rounded-lg bg-[rgba(255,255,255,0.03)] ${colorClass} group-hover:bg-[rgba(255,255,255,0.08)] transition-colors`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">{animatedValue}</h2>
          {trend && (
            <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {trend}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const { data } = await missionAPI.getAll();
        setMissions(data.data);
      } catch (error) {
        toast.error('Failed to load missions');
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Calculate dummy stats for demonstration
  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === 'completed').length;
  const runningMissions = missions.filter(m => m.status === 'running').length;
  const totalAgentsDeployed = totalMissions * 4;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-[var(--text-muted)] animate-pulse">Loading intelligence feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
          Good morning, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Agent'}</span> 👋
        </h1>
        <p className="text-lg text-[var(--text-muted)]">Here's your intelligence overview for today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Missions" 
          value={totalMissions} 
          icon={Target} 
          trend={12} 
          isPositive={true}
          colorClass="text-indigo-400"
          gradientClass="bg-gradient-to-b from-indigo-400 to-indigo-600"
          delayClass=""
        />
        <StatCard 
          title="Active Runs" 
          value={runningMissions} 
          icon={Zap} 
          colorClass="text-cyan-400"
          gradientClass="bg-gradient-to-b from-cyan-400 to-cyan-600"
          delayClass="[animation-delay:100ms]"
        />
        <StatCard 
          title="Completed Reports" 
          value={completedMissions} 
          icon={FileText} 
          trend={8} 
          isPositive={true}
          colorClass="text-emerald-400"
          gradientClass="bg-gradient-to-b from-emerald-400 to-emerald-600"
          delayClass="[animation-delay:200ms]"
        />
        <StatCard 
          title="Agents Deployed" 
          value={totalAgentsDeployed} 
          icon={Clock} 
          colorClass="text-purple-400"
          gradientClass="bg-gradient-to-b from-purple-400 to-purple-600"
          delayClass="[animation-delay:300ms]"
        />
      </div>

      {/* Missions List */}
      <div className="animate-fade-in-up [animation-delay:400ms]">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Recent Missions</h2>
            <p className="text-sm text-[var(--text-muted)]">Track your active and completed intelligence tasks.</p>
          </div>
          <Link to="/missions/new" className="hidden sm:flex btn-primary items-center gap-2 text-sm py-2 px-4">
            <Plus className="w-4 h-4" /> New Mission
          </Link>
        </div>

        {missions.length === 0 ? (
          <div className="card p-12 text-center border-dashed border-2 border-[var(--border-subtle)] bg-transparent hover:border-indigo-500/30 transition-colors">
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-indigo-500/10 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <Sparkles className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 gradient-text">No missions yet</h3>
            <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8">
              Deploy your first team of AI agents to research and generate an intelligence report.
            </p>
            <Link to="/missions/new" className="btn-primary inline-flex items-center gap-2">
              <Zap className="w-5 h-5 fill-current" /> Initialize First Mission
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {missions.map((mission, idx) => (
              <div key={mission._id} className="animate-fade-in-up" style={{ animationDelay: `${500 + idx * 50}ms` }}>
                <MissionCard mission={mission} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
