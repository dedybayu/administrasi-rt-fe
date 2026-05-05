import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75M4.5 10.5v9a.75.75 0 00.75.75h4.5v-5.25h4.5V20.25h4.5a.75.75 0 00.75-.75v-9" />
      </svg>
    ),
  },
  {
    label: 'Data Warga',
    path: '/occupants',
    rtOnly: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8zm6 8v-2a4 4 0 00-3-3.87" />
      </svg>
    ),
  },
  {
    label: 'Iuran & Kas',
    path: '/payments',
    rtOnly: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Data Rumah',
    path: '/houses',
    rtOnly: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0l8.954 8.955M4.5 10.5V20.25a.75.75 0 00.75.75h4.5v-4.5h4.5v4.5h4.5a.75.75 0 00.75-.75V10.5" />
      </svg>
    ),
  },
  {
    label: 'Informasi',
    path: '/info',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isRt = Cookies.get('user_is_rt') === 'true';
  const userName = Cookies.get('user_name') || 'Pengguna';

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_is_rt');
    Cookies.remove('user_name');
    navigate('/login');
  };

  const visibleNavItems = navItems.filter((item) => !item.rtOnly || isRt);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-base-300">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75M4.5 10.5v9a.75.75 0 00.75.75h4.5v-5.25h4.5V20.25h4.5a.75.75 0 00.75-.75v-9" />
          </svg>
        </div>
        <div>
          <p className="font-extrabold text-base leading-none">E-RT Digital</p>
          <p className="text-xs text-base-content/50 mt-0.5">Sistem Administrasi RT</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 mx-4 mt-4 mb-2 rounded-2xl bg-primary/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${isRt ? 'bg-primary' : 'bg-secondary'}`}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{userName}</p>
            <span className={`badge badge-xs ${isRt ? 'badge-primary' : 'badge-secondary'}`}>
              {isRt ? 'Ketua RT' : 'Warga'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-base-content/30 px-3 mb-2">Menu</p>
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-content shadow-md shadow-primary/20'
                      : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                  }`}
                >
                  <span className={isActive ? 'text-primary-content' : 'text-base-content/50'}>{item.icon}</span>
                  {item.label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-content/60" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-base-300">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-error hover:bg-error/10 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-base-100 border-r border-base-300 fixed top-0 left-0 h-full z-30 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-base-100 border-r border-base-300 z-50 lg:hidden flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top bar (mobile) */}
        <header className="navbar bg-base-100 border-b border-base-300 px-4 sticky top-0 z-20 lg:hidden">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setSidebarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 flex items-center gap-2 ml-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75M4.5 10.5v9" />
              </svg>
            </div>
            <span className="font-bold text-sm">E-RT Digital</span>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-circle text-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
