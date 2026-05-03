import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { missionAPI } from '../services/api.service';
import { useMissionStore } from '../store/mission.store';
import AgentOrchestrator from '../components/agents/AgentOrchestrator';
import ReportViewer from '../components/dashboard/ReportViewer';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MissionPage = () => {
  const { id } = useParams();
  const [initialLoading, setInitialLoading] = useState(true);
  const [missionPrompt, setMissionPrompt] = useState('');

  const {
    connectToMission,
    disconnect,
    hydrateFromMission,
    agentStatuses,
    agentStreams,
    missionStatus,
    finalReport,
    error
  } = useMissionStore();

  useEffect(() => {
    let mounted = true;

    const initMission = async () => {
      try {
        const { data } = await missionAPI.getById(id);
        if (mounted) {
          setMissionPrompt(data.data.prompt);
          hydrateFromMission(data.data);
          setInitialLoading(false);

          // If the mission is not completed or failed, connect to SSE stream
          if (data.data.status !== 'completed' && data.data.status !== 'failed') {
            connectToMission(id);
          }
        }
      } catch (err) {
        if (mounted) {
          toast.error('Failed to load mission details');
          setInitialLoading(false);
        }
      }
    };

    initMission();

    return () => {
      mounted = false;
      disconnect();
    };
  }, [id]);

  if (initialLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Live Mission Run</h1>
            <p className="text-gray-400 max-w-3xl">Goal: {missionPrompt}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              missionStatus === 'running' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
              missionStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
              missionStatus === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
              'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}>
              {missionStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-start gap-3 mb-8">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Mission Failed</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Agent Streaming UI */}
      <AgentOrchestrator 
        agentStatuses={agentStatuses} 
        agentStreams={agentStreams} 
      />

      {/* Final Markdown Report */}
      {finalReport && (
        <ReportViewer content={finalReport} />
      )}
    </div>
  );
};

export default MissionPage;
