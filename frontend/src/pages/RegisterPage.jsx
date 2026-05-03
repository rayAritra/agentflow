import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api.service';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, User, Loader2, Bot, Radio, FileText } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      setCredentials({ name: data.name, email: data.email, _id: data._id }, data.token);
      toast.success('Account created successfully!', {
        style: { background: '#161b22', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed', {
        style: { background: '#161b22', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md space-y-12 animate-fade-in-up">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 mb-6 shadow-[0_0_40px_rgba(99,102,241,0.5)]">
              <Zap className="w-10 h-10 text-white fill-current" />
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">AgentFlow</h1>
            <p className="text-lg text-[var(--text-muted)] max-w-sm mx-auto">
              Deploy autonomous AI agents to research and synthesize intelligence for you.
            </p>
          </div>

          <div className="space-y-4 perspective-1000">
            {/* Floating Card 1 */}
            <div className="card p-4 flex items-center gap-4 bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] transform hover:scale-105 transition-all duration-500 delay-100 hover:border-indigo-500/30">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold">4 Specialized Agents</h3>
                <p className="text-xs text-[var(--text-muted)]">Scraper, Analyzer, Fact-checker, Writer</p>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="card p-4 flex items-center gap-4 bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] transform translate-x-8 hover:scale-105 transition-all duration-500 delay-200 hover:border-cyan-500/30">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Real-time Streaming</h3>
                <p className="text-xs text-[var(--text-muted)]">Watch them think token-by-token</p>
              </div>
            </div>

            {/* Floating Card 3 */}
            <div className="card p-4 flex items-center gap-4 bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] transform hover:scale-105 transition-all duration-500 delay-300 hover:border-purple-500/30">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Intelligence Reports</h3>
                <p className="text-xs text-[var(--text-muted)]">Comprehensive markdown deliverables</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-[var(--bg-base)] relative overflow-hidden">
        {/* Mobile background elements */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none lg:hidden" />
        
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <Zap className="w-8 h-8 text-white fill-current" />
            </div>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
            <p className="text-[var(--text-muted)] text-sm">Join AgentFlow and start deploying AI agents.</p>
          </div>

          <div className="card p-8 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[var(--text-hint)]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[var(--text-hint)]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input pl-10"
                    placeholder="agent@flow.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[var(--text-hint)]" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex justify-center items-center py-3 text-[15px]"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-[var(--text-muted)]">Already have an account? </span>
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors border-b border-transparent hover:border-indigo-400 pb-0.5">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
