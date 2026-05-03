import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, CheckCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ReportViewer = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Report copied to clipboard', {
      style: { background: '#161b22', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <div className="card mt-8 animate-fade-in-up [animation-delay:400ms] overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-[var(--border-subtle)] gap-4">
          <h2 className="text-2xl font-extrabold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="gradient-text">Intelligence Report</span>
          </h2>
          <button
            onClick={handleCopy}
            className="btn-ghost flex items-center gap-2"
          >
            {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Markdown'}
          </button>
        </div>

        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
