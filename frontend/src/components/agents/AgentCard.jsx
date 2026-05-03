import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Loader2, Circle } from 'lucide-react';

const AgentCard = ({ title, emoji, status, stream, isActive }) => {
  const streamRef = useRef(null);

  // Auto-scroll stream to bottom
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [stream]);

  const getStatusIcon = () => {
    switch (status) {
      case 'idle':
        return <Circle className="w-5 h-5 text-[var(--text-hint)]" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />;
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] rounded-full" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400 animate-bounce" />;
      default:
        return null;
    }
  };

  const getBadgeClass = () => {
    switch (status) {
      case 'idle': return 'badge-idle';
      case 'running': return 'badge-running';
      case 'done': return 'badge-done';
      case 'failed': return 'badge-failed';
      default: return '';
    }
  };

  return (
    <div className={`card overflow-hidden flex flex-col h-full ${isActive ? 'border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] bg-[rgba(255,255,255,0.01)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent border border-[var(--border-subtle)] shadow-inner">
            {emoji}
          </div>
          <div>
            <h3 className={`font-bold ${isActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>{title}</h3>
            <span className={`badge mt-1 ${getBadgeClass()}`}>
              {status}
            </span>
          </div>
        </div>
        <div className="shrink-0 p-2 bg-[var(--bg-elevated)] rounded-full border border-[var(--border-subtle)]">
          {getStatusIcon()}
        </div>
      </div>

      {/* Stream Area */}
      <div className="p-4 flex-1 bg-[var(--bg-card)]">
        <div 
          ref={streamRef}
          className="h-48 overflow-y-auto bg-black/30 rounded-lg p-4 border border-[var(--border-subtle)]"
        >
          {stream ? (
            <div className="prose-custom">
              <pre className="!bg-transparent !border-none !p-0 !m-0">
                <code className={`text-[12px] leading-[1.7] text-[#a5f3fc] whitespace-pre-wrap ${isActive ? 'cursor-blink' : ''}`}>
                  {stream}
                </code>
              </pre>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-[var(--text-hint)] text-xs font-mono">Waiting for input...</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Bottom */}
      <div className="h-1.5 w-full bg-[rgba(255,255,255,0.05)]">
        {status === 'running' && (
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 w-full animate-[shimmer_2s_infinite]"></div>
        )}
        {status === 'done' && (
          <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
        )}
        {status === 'failed' && (
          <div className="h-full bg-red-500 w-full"></div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
