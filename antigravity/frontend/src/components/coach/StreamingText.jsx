import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const StreamingText = ({ text }) => {
  if (!text) return null;

  return (
    <div className="flex gap-4 mb-6">
      <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border bg-lime-400/10 border-lime-400/20 text-lime-400">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>

      <div className="flex flex-col max-w-[80%] items-start">
        <div className="rounded-2xl px-5 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none prose prose-invert max-w-none relative">
          <ReactMarkdown>{text}</ReactMarkdown>
          {/* Blinking cursor */}
          <span className="inline-block w-2 h-4 bg-lime-400 ml-1 animate-cursor-blink align-middle"></span>
        </div>
      </div>
    </div>
  );
};

export default StreamingText;
