import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { missionAPI } from '../services/api.service';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const NewMissionPage = () => {
  const [prompt, setPrompt] = useState('');
  const [urls, setUrls] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      toast.error('Please enter a research prompt');
      return;
    }

    // Filter out empty URLs and validate basic format
    const validUrls = urls.filter(url => url.trim().length > 0);
    
    setIsLoading(true);
    try {
      const { data } = await missionAPI.create({ prompt, urls: validUrls });
      toast.success('Mission started!');
      navigate(`/mission/${data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start mission');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">New Mission</h1>
        <p className="text-gray-400">Deploy agents to research, analyze, and generate an intelligence report.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Research Goal</label>
            <textarea
              className="input min-h-[120px] resize-y"
              placeholder="e.g. Monitor Notion vs Linear pricing and features this week, focusing on their enterprise tiers."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              Be as specific as possible. The more context you provide, the better the final report will be.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label mb-0">Target URLs (Optional)</label>
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add URL
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Provide specific websites for the Scraper Agent to read. If none are provided, it will rely on its internal knowledge base.
            </p>
            
            <div className="space-y-3">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    className="input flex-1"
                    placeholder="https://example.com/pricing"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(index)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center h-12 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Deploying Agents...
                </>
              ) : (
                'Start Mission'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMissionPage;
