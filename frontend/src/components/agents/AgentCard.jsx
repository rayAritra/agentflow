import { Circle, Loader2, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

const AgentCard = ({ title, emoji, status, stream, isActive }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom as new tokens arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [stream]);

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'idle':
      default:
        return <Circle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBorderColor = () => {
    if (isActive) return 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
    if (status === 'done') return 'border-gray-800';
    return 'border-gray-800 opacity-50';
  };

  return (
    <div className={`card flex flex-col h-80 transition-all duration-300 ${getBorderColor()}`}>
      <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h3 className="font-semibold text-gray-200">{title}</h3>
        </div>
        <div>
          {getStatusIcon()}
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-gray-950 p-3 rounded-lg font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed relative"
      >
        {stream || (status === 'idle' ? 'Waiting to start...' : '')}
        
        {isActive && status === 'running' && (
          <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-cursor-blink translate-y-1"></span>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
