import { User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} mb-6`}>
      {/* Avatar */}
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
        isUser 
          ? 'bg-zinc-800 border-zinc-700 text-zinc-400' 
          : 'bg-lime-400/10 border-lime-400/20 text-lime-400'
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-5 py-3 ${
          isUser 
            ? 'bg-zinc-800 text-white rounded-tr-none' 
            : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-a:text-lime-400 max-w-none'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
