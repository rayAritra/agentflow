import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

const CoachInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="bg-zinc-950 p-4 border-t border-zinc-800 absolute bottom-0 left-0 right-0">
      <div className="max-w-4xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder="Ask AntiGravity Coach about your form, progress, or routine..."
            className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="absolute right-2 p-2 bg-lime-400 text-zinc-950 rounded-lg hover:bg-lime-300 disabled:opacity-50 disabled:hover:bg-lime-400 transition-colors"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-xs text-zinc-600 mt-2">
          AI can make mistakes. Verify critical advice with a professional.
        </p>
      </div>
    </div>
  );
};

export default CoachInput;
