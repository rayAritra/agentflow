import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Zap, LayoutDashboard, PlusCircle, LogOut, Menu, X } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Mission', path: '/missions/new', icon: PlusCircle },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight gradient-text">AgentFlow</h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-hint)]">Intelligence Platform</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all relative overflow-hidden group ${
                isActive 
                  ? 'text-white' 
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/0 opacity-50 z-0"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-cyan-400 z-10 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                </>
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 shrink-0">
        <div className="card border-[rgba(255,255,255,0.05)] p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--border-glow)] flex items-center justify-center font-bold text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{user?.name}</p>
              <p className="text-xs text-[var(--text-hint)] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-semibold border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full relative">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] fixed top-0 bottom-0 left-0 bg-[rgba(13,17,23,0.8)] backdrop-blur-[20px] border-r border-[rgba(255,255,255,0.05)] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[rgba(13,17,23,0.8)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.05)] z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Zap className="text-indigo-400 w-6 h-6 fill-current" />
          <span className="font-bold gradient-text">AgentFlow</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed top-16 bottom-0 left-0 w-[240px] bg-[rgba(13,17,23,0.95)] backdrop-blur-[20px] border-r border-[rgba(255,255,255,0.05)] z-40 flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:pl-[240px] pt-16 md:pt-0 overflow-y-auto overflow-x-hidden relative">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full" key={location.pathname}>
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
