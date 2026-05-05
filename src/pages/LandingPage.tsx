import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  Smartphone,
  ArrowRight,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  Lock,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(
    (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto'
  );

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (t: 'light' | 'dark' | 'auto') => {
      let resolved = t;
      if (t === 'auto') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      root.setAttribute('data-theme', resolved);
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('auto');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const features = [
    {
      title: 'Manajemen Warga',
      desc: 'Kelola data penduduk dengan mudah dan terorganisir dalam satu platform terpadu.',
      icon: <Users size={24} />,
      accent: 'text-primary bg-primary/10',
    },
    {
      title: 'Keamanan Data',
      desc: 'Data warga tersimpan aman dengan enkripsi standar industri terkini.',
      icon: <Lock size={24} />,
      accent: 'text-secondary bg-secondary/10',
    },
    {
      title: 'Akses Mobile',
      desc: 'Akses kapan saja dan di mana saja melalui perangkat seluler Anda.',
      icon: <Smartphone size={24} />,
      accent: 'text-accent bg-accent/10',
    },
  ];

  const stats = [
    { value: '1,000+', label: 'Warga Terdaftar' },
    { value: '50+', label: 'RT Menggunakan' },
    { value: '24/7', label: 'Akses Sistem' },
    { value: '100%', label: 'Keamanan Data' },
  ];

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <div className="min-h-screen bg-base-100">

      {/* ── Navbar ── */}
      <div className="navbar bg-base-100/90 backdrop-blur-md border-b border-base-200 sticky top-0 z-50">
        <div className="navbar-start px-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-content p-2 rounded-xl">
              <Building2 size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">E-RT Digital</span>
          </div>
        </div>

        <div className="navbar-end gap-2 pr-2">
          {/* Theme dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <ThemeIcon size={18} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 w-48 p-2 shadow-lg border border-base-300 mt-3"
            >
              <li>
                <button onClick={() => setTheme('light')} className={theme === 'light' ? 'active' : ''}>
                  <Sun size={15} /> Light
                </button>
              </li>
              <li>
                <button onClick={() => setTheme('dark')} className={theme === 'dark' ? 'active' : ''}>
                  <Moon size={15} /> Dark
                </button>
              </li>
              <li>
                <button onClick={() => setTheme('auto')} className={theme === 'auto' ? 'active' : ''}>
                  <Monitor size={15} /> Auto (Sistem)
                </button>
              </li>
            </ul>
          </div>

          <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm px-5 rounded-xl">
            Masuk
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="hero min-h-[90vh] bg-base-100">
        <div className="hero-content text-center flex-col max-w-4xl py-20">
          {/* Badge */}
          <div className="badge badge-primary badge-outline gap-2 py-3 px-4 mb-6 text-sm">
            <CheckCircle2 size={14} />
            Solusi Digital untuk Lingkungan RT
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Modernisasi <br />
            <span className="text-primary">Administrasi RT</span>
          </h1>

          <p className="text-lg text-base-content/70 max-w-2xl leading-relaxed mb-10">
            Platform manajemen warga digital yang mempermudah pendataan, pelaporan,
            dan komunikasi antar warga dalam satu ekosistem yang aman dan efisien.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary btn-lg px-10 rounded-2xl"
            >
              Mulai Sekarang <ArrowRight size={18} />
            </button>
            <a href="#features" className="btn btn-outline btn-lg px-10 rounded-2xl">
              Pelajari Fitur
            </a>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div id="features" className="bg-base-200 py-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3">Fitur Unggulan</h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              Dirancang khusus untuk memenuhi kebutuhan pengurus RT dan warga dengan teknologi terkini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card bg-base-100 border border-base-300 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="card-body gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.accent}`}>
                    {f.icon}
                  </div>
                  <h3 className="card-title">{f.title}</h3>
                  <p className="text-base-content/60 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-primary py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="stats stats-vertical md:stats-horizontal shadow w-full bg-primary text-primary-content">
            {stats.map((s) => (
              <div key={s.label} className="stat place-items-center">
                <div className="stat-value text-primary-content">{s.value}</div>
                <div className="stat-desc text-primary-content/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-base-100 py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="card bg-base-200 border border-base-300 shadow-xl">
            <div className="card-body items-center py-14 gap-6">
              <h2 className="card-title text-4xl font-bold justify-center">Siap untuk Berdigital?</h2>
              <p className="text-base-content/60 max-w-lg text-base leading-relaxed">
                Bergabunglah dengan ratusan pengurus RT yang telah beralih ke sistem administrasi modern.
                Pendaftaran cepat, mudah, dan gratis.
              </p>
              <div className="card-actions justify-center gap-4 flex-wrap">
                <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg rounded-2xl px-10">
                  Coba Sekarang
                </button>
                <button className="btn btn-outline btn-lg rounded-2xl px-10">
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer footer-center bg-base-200 border-t border-base-300 p-10 text-base-content">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary text-primary-content p-2 rounded-xl">
              <Building2 size={20} />
            </div>
            <span className="text-lg font-bold">E-RT Digital</span>
          </div>
          <p className="text-sm text-base-content/60">
            Solusi administrasi lingkungan modern sejak 2024.
          </p>
        </div>

        <div>
          <div className="grid grid-flow-col gap-6">
            <a className="link link-hover text-sm">Tentang Kami</a>
            <a className="link link-hover text-sm">Privasi</a>
            <a className="link link-hover text-sm">Syarat & Ketentuan</a>
            <a className="link link-hover text-sm">Kontak</a>
          </div>
        </div>

        <aside>
          <p className="text-sm text-base-content/50">
            Copyright © 2026 — E-RT Digital. All rights reserved.
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default LandingPage;
