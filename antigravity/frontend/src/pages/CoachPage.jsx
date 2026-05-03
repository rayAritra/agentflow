import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { useCoachStore } from '../store/coach.store';
import ChatBubble from '../components/coach/ChatBubble';
import StreamingText from '../components/coach/StreamingText';
import CoachInput from '../components/coach/CoachInput';

const CoachPage = () => {
  const { messages, isStreaming, streamingText, loadHistory, sendMessage } = useCoachStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 relative">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center gap-4 shrink-0">
        <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 border border-lime-400/20 shadow-[0_0_15px_rgba(163,230,53,0.1)]">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AntiGravity Coach</h1>
          <p className="text-sm text-lime-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            Online & Ready
          </p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && !isStreaming ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Bot className="w-16 h-16 text-zinc-800 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">How can I help you train today?</h2>
              <p className="text-zinc-500 max-w-md">
                Ask me to analyze your latest workout, give form tips, suggest a new split, or explain why your deadlift has stalled.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} message={msg} />
              ))}
              
              {isStreaming && (
                <StreamingText text={streamingText} />
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <CoachInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
};

export default CoachPage;
