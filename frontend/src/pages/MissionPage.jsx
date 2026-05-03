import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMissionStore } from '../store/mission.store';
import { missionAPI } from '../services/api.service';
import AgentOrchestrator from '../components/agents/AgentOrchestrator';
import ReportViewer from '../components/dashboard/ReportViewer';
import { Loader2, Calendar, Clock, Target, AlertTriangle, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const MissionPage = () => {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    connectToMission, 
    disconnect, 
    hydrateFromMission,
    agentStreams, 
    agentStatuses, 
    missionStatus,
    finalReport,
    error
  } = useMissionStore();

  useEffect(() => {
    const initMission = async () => {
      try {
        const { data } = await missionAPI.getById(id);
        const missionData = data.data;
        setMission(missionData);
        
        hydrateFromMission(missionData);

        if (missionData.status === 'running' || missionData.status === 'pending') {
          connectToMission(id);
        }
      } catch (err) {
        toast.error('Failed to load mission details');
      } finally {
        setLoading(false);
      }
    };

    initMission();

    return () => {
      disconnect();
    };
  }, [id, connectToMission, disconnect, hydrateFromMission]);

  // Trigger confetti when mission completes!
  useEffect(() => {
    if (missionStatus === 'completed' && finalReport) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#06b6d4']
      });
    }
  }, [missionStatus, finalReport]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-[var(--text-muted)] animate-pulse">Initializing communication link...</p>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="card p-12 text-center animate-fade-in-up">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Mission Not Found</h2>
        <p className="text-[var(--text-muted)]">The intelligence operation you're looking for doesn't exist.</p>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (missionStatus) {
      case 'completed': return <span className="badge badge-done px-3 py-1 text-sm">Completed</span>;
      case 'failed': return <span className="badge badge-failed px-3 py-1 text-sm">Failed</span>;
      case 'running': 
      case 'pending':
        return <span className="badge badge-running px-3 py-1 text-sm"><Loader2 className="w-3 h-3 animate-spin mr-1 inline" /> Running</span>;
      default: return <span className="badge badge-idle px-3 py-1 text-sm">Idle</span>;
    }
  };

  const agentsList = ['scraper', 'analyzer', 'factChecker', 'writer'];
  const completedAgentsCount = agentsList.filter(a => agentStatuses[a] === 'done').length;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      {/* Top Section */}
      <div className="card p-6 md:p-8 mb-8 relative overflow-hidden">
        {missionStatus === 'running' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-[shimmer_2s_infinite]"></div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {getStatusBadge()}
              <span className="text-[var(--text-hint)] text-sm font-mono">{mission._id}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              {mission.prompt}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-400" /> {new Date(mission.createdAt).toLocaleString()}</span>
              <span className="flex items-center gap-2"><Target className="w-4 h-4 text-cyan-400" /> {mission.urls?.length || 0} Targets</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" /> {completedAgentsCount}/4 Agents Done</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 p-6 mb-8 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-red-400 mb-1">Mission Failed</h3>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Agent Orchestrator */}
      <div className="mb-4 flex items-center justify-between animate-fade-in-up [animation-delay:100ms]">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <PlayCircle className="w-5 h-5 text-indigo-400" /> Live Intelligence Feed
          {missionStatus === 'running' && (
            <span className="relative flex h-3 w-3 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </h2>
      </div>

      <div className="animate-fade-in-up [animation-delay:200ms]">
        <AgentOrchestrator 
          agentStatuses={agentStatuses} 
          agentStreams={agentStreams} 
        />
      </div>

      {/* Final Report */}
      {missionStatus === 'completed' && finalReport && (
        <ReportViewer content={finalReport} />
      )}
    </div>
  );
};

export default MissionPage;
