import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';

const MissionCard = ({ mission }) => {
  const getStatusBadge = () => {
    switch (mission.status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Running
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  const formattedDate = new Date(mission.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <Link to={`/mission/${mission._id}`} className="block">
      <div className="card hover:border-gray-700 hover:bg-gray-800/50 transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <FileText className="text-gray-500 group-hover:text-blue-400 transition-colors" />
            <h3 className="font-semibold text-gray-200 line-clamp-1">{mission.prompt}</h3>
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div>
            {mission.urls && mission.urls.length > 0 && (
              <span className="px-2 py-1 bg-gray-800 rounded text-xs">
                {mission.urls.length} target(s)
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MissionCard;
