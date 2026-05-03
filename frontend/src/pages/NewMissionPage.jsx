import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { missionAPI } from '../services/api.service';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2, Zap, Link as LinkIcon, Target } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

const NewMissionPage = () => {
  const [prompt, setPrompt] = useState('');
  const [urls, setUrls] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+N or Cmd+N is handled globally in App.jsx usually, 
  // but if we are already here, we can focus the input.
  useHotkeys('ctrl+enter, cmd+enter', () => {
    if (prompt.trim() && !isLoading) {
      document.getElementById('mission-form').requestSubmit();
    }
  }, { enableOnFormTags: true });

  const handleAddUrl = () => setUrls([...urls, '']);
  
  const handleRemoveUrl = (index) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a research goal');
      return;
    }

    const validUrls = urls.filter(url => url.trim().length > 0);
    
    setIsLoading(true);
    try {
      const { data } = await missionAPI.create({ prompt, urls: validUrls });
      toast.success('Agents deployed successfully!', { icon: '🚀' });
      navigate(`/mission/${data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start mission');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
          <Target className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Deploy New Mission</h1>
        <p className="text-lg text-[var(--text-muted)]">Configure your AI agents to research, analyze, and generate a comprehensive intelligence report.</p>
      </div>

      <div className="card p-1">
        <div className="bg-[var(--bg-elevated)] rounded-[15px] p-6 md:p-8">
          <form id="mission-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Research Goal Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <Zap className="w-4 h-4 text-indigo-400 fill-current" /> Research Goal
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                <textarea
                  className="input relative min-h-[160px] resize-y text-base p-4 bg-[var(--bg-card)] rounded-xl"
                  placeholder="e.g. Analyze Vercel vs Netlify for frontend deployment in 2024. Compare pricing, build minutes, bandwidth limits, and edge function support."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  autoFocus
                />
                <div className="absolute bottom-3 right-4 text-xs font-medium text-[var(--text-hint)] flex items-center gap-2 bg-[var(--bg-card)] px-2 py-1 rounded-md">
                  <span>{prompt.length} chars</span>
                  <span className="hidden sm:inline opacity-50">|</span>
                  <span className="hidden sm:inline">⌘ ↵ to submit</span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] pl-1">
                Be as specific as possible. The more context you provide, the better the final output will be.
              </p>
            </div>

            <hr className="border-[var(--border-subtle)]" />

            {/* Target URLs Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-1">
                    <LinkIcon className="w-4 h-4 text-cyan-400" /> Target URLs <span className="badge badge-idle ml-2">Optional</span>
                  </label>
                  <p className="text-xs text-[var(--text-muted)]">
                    Provide specific websites for the Scraper Agent to read.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add URL
                </button>
              </div>
              
              <div className="space-y-3">
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-3 group/url animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-[var(--text-hint)]" />
                      </div>
                      <input
                        type="url"
                        className="input pl-9 bg-[var(--bg-card)] text-sm"
                        placeholder="https://example.com/pricing"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                      />
                    </div>
                    {urls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUrl(index)}
                        className="shrink-0 p-2.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                        title="Remove URL"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className={`btn-primary w-full flex justify-center items-center h-14 text-lg tracking-wide ${isLoading ? 'animate-glow-pulse opacity-90' : ''} ${!prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-3" />
                    Initializing Agents...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2 fill-current" /> Deploy Mission
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMissionPage;
