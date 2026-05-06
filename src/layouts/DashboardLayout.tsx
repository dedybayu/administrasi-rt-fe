import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Home, 
  Info, 
  LogOut, 
  Menu, 
  Sun, 
  Moon,
  Monitor,
  ChevronRight,
  TrendingDown,
  AlertCircle,
  CreditCard,
  Settings
} from 'lucide-react';
import Cookies from 'js-cookie';
import { ProfileModal } from './components/ProfileModal';

type Theme = 'light' | 'dark' | 'system';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  rtOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Data Warga',
    path: '/occupants',
    rtOnly: true,
    icon: <Users size={20} />,
  },
  {
    label: 'Iuran Warga',
    path: '/payments',
    rtOnly: true,
    icon: <Wallet size={20} />,
  },
  {
    label: 'Iuran Saya',
    path: '/my-dues',
    icon: <CreditCard size={20} />,
  },
  {
    label: 'Pengeluaran',
    path: '/expenses',
    rtOnly: true,
    icon: <TrendingDown size={20} />,
  },
  {
    label: 'Data Rumah',
    path: '/houses',
    rtOnly: true,
    icon: <Home size={20} />,
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>((localStorage.getItem('theme') as Theme) || 'system');

  const isRt = Cookies.get('user_is_rt') === 'true';
  const userName = Cookies.get('user_name') || 'Pengguna';

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (t: Theme) => {
      if (t === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', t);
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listen for system theme changes if in 'system' mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const cycleTheme = () => {
    const modes: Theme[] = ['light', 'dark', 'system'];
    const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const executeLogout = () => {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_is_rt');
    Cookies.remove('user_name');
    navigate('/login');
  };

  const visibleNavItems = navItems.filter((item) => !item.rtOnly || isRt);

  const ThemeButton = ({ className = "" }: { className?: string }) => {
    const icons = {
      light: <Sun size={20} className="text-amber-500" />,
      dark: <Moon size={20} className="text-indigo-500" />,
      system: <Monitor size={20} className="text-slate-500" />
    };
    const labels = {
      light: 'Mode Terang',
      dark: 'Mode Gelap',
      system: 'Mode Sistem'
    };

    return (
      <button
        onClick={cycleTheme}
        className={`btn btn-ghost justify-start gap-3 rounded-xl normal-case font-bold text-base-content/70 hover:bg-base-300 ${className}`}
      >
        {icons[theme]}
        <span>{labels[theme]}</span>
      </button>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-base-300">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
          <Home size={20} className="text-primary-content" />
        </div>
        <div>
          <p className="font-extrabold text-base leading-none text-primary">E-RT Digital</p>
          <p className="text-[10px] uppercase tracking-wider text-base-content/40 mt-1 font-bold">Sistem Administrasi</p>
        </div>
      </div>

      {/* User info */}
      <button 
        onClick={() => setIsProfileModalOpen(true)}
        className="px-4 py-4 mx-4 mt-6 mb-2 rounded-2xl bg-base-200 border border-base-300 hover:bg-base-300 transition-colors text-left w-[calc(100%-2rem)]"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${isRt ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-secondary shadow-lg shadow-secondary/30'}`}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm truncate">{userName}</p>
            <span className={`badge badge-xs font-bold py-2 ${isRt ? 'badge-primary' : 'badge-secondary'}`}>
              {isRt ? 'Ketua RT' : 'Warga'}
            </span>
          </div>
          <Settings size={14} className="text-base-content/30" />
        </div>
      </button>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/30 px-3 mb-4">Main Menu</p>
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-content shadow-md shadow-primary/20'
                      : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'
                  }`}
                >
                  <span className={isActive ? 'text-primary-content' : 'text-base-content/40'}>{item.icon}</span>
                  {item.label}
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer (Theme Toggle & Logout) */}
      <div className="p-4 border-t border-base-300 bg-base-200/50">
        <div className="flex flex-col gap-2">
          <ThemeButton className="w-full" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-ghost justify-start gap-3 rounded-xl normal-case font-bold text-error hover:bg-error/10"
          >
            <LogOut size={20} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-base-100 border-r border-base-300 fixed top-0 left-0 h-full z-30 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-base-100 border-r border-base-300 z-50 lg:hidden flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72 bg-base-200/50 min-h-screen">
        {/* Top bar (mobile) */}
        <header className="navbar bg-base-100 border-b border-base-300 px-4 sticky top-0 z-20 lg:hidden h-16">
          <button
            className="btn btn-ghost btn-square"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
              <Home size={16} className="text-primary-content" />
            </div>
            <span className="font-black text-base text-primary tracking-tight">E-RT Digital</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Mobile Theme Toggle */}
            <button 
              onClick={cycleTheme} 
              className="btn btn-ghost btn-circle"
              aria-label="Cycle Theme"
            >
              {theme === 'light' ? <Sun size={20} className="text-amber-500" /> : 
               theme === 'dark' ? <Moon size={20} className="text-indigo-500" /> : 
               <Monitor size={20} className="text-slate-500" />}
            </button>
            
            <button onClick={handleLogout} className="btn btn-ghost btn-circle text-error" aria-label="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Header (Desktop) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-base-100 border-b border-base-300 h-16 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-base-content/30">Administrasi RT Digital</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-3 hover:bg-base-200 p-2 rounded-2xl transition-colors cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{userName}</p>
                <p className="text-[10px] font-bold uppercase tracking-tighter text-base-content/40 mt-1">
                  {isRt ? 'Ketua RT' : 'Warga'}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg ${isRt ? 'bg-primary shadow-primary/20' : 'bg-secondary shadow-secondary/20'}`}>
                {userName.charAt(0).toUpperCase()}
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-base-100 w-full max-w-sm rounded-[2rem] shadow-2xl border border-base-300 overflow-hidden animate-zoom-in">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2">Konfirmasi Keluar</h3>
              <p className="text-base-content/60 font-medium mb-8">
                Apakah Anda yakin ingin keluar dari sesi administrasi ini?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={executeLogout}
                  className="btn btn-error btn-lg rounded-2xl normal-case font-black shadow-lg shadow-error/20"
                >
                  Ya, Keluar Sekarang
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="btn btn-ghost btn-lg rounded-2xl normal-case font-bold"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile/Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        isRt={isRt}
      />
    </div>
  );
}

