import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const MissionCard = ({ mission }) => {
  const date = new Date(mission.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Calculate completion percentage
  const agents = ['scraper', 'analyzer', 'factChecker', 'writer'];
  const completedAgents = agents.filter(agent => mission.agents?.[agent]?.status === 'done').length;
  const progressPercentage = (completedAgents / agents.length) * 100;

  // Animation for progress bar on mount
  const [progressWidth, setProgressWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth(progressPercentage), 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const getStatusBadge = () => {
    switch (mission.status) {
      case 'completed':
        return <span className="badge badge-done">Completed</span>;
      case 'failed':
        return <span className="badge badge-failed">Failed</span>;
      case 'running':
      case 'pending':
        return <span className="badge badge-running">Running</span>;
      default:
        return <span className="badge badge-idle">Idle</span>;
    }
  };

  return (
    <Link to={`/mission/${mission._id}`} className="block group">
      <div className="card p-5 hover:bg-[rgba(255,255,255,0.02)] transition-all overflow-hidden relative">
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-3">
              {getStatusBadge()}
              <h3 className="font-semibold text-[var(--text-primary)] truncate text-lg group-hover:text-indigo-400 transition-colors">
                {mission.prompt}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[var(--text-hint)]" /> {date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[var(--text-hint)]" /> {completedAgents}/{agents.length} Agents</span>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center gap-4">
            {/* Mini Progress Bar */}
            <div className="w-24 md:w-32 h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)] hidden sm:block">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${mission.status === 'failed' ? 'bg-red-500' : mission.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'}`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MissionCard;
