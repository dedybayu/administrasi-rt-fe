import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Home,
  Users,
  Info,
  ShieldCheck,
  Wallet,
  FileText,
  Calendar,
  BadgeDollarSign,
  RefreshCw,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import Cookies from 'js-cookie';
import api from '../utils/api';

interface KetualRTData {
  kas_rt: number;
  laporan_warga: number;
}

interface WargaData {
  jadwal_ronda: string;
  iuran_bulanan: number;
}

interface ApiResponse {
  message: string;
  data: KetualRTData | WargaData;
}

const formatRupiah = (amount: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRt = Cookies.get('user_is_rt') === 'true';
  const userName = Cookies.get('user_name') || 'Pengguna';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = isRt ? '/infort' : '/infowrg';
      const res = await api.get(endpoint);
      setApiData(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Gagal memuat data. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_is_rt');
    Cookies.remove('user_name');
    navigate('/login');
  };

  const renderStatCards = () => {
    if (!apiData) return null;

    if (isRt) {
      const data = apiData.data as KetualRTData;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Kas RT */}
          <div className="stat bg-base-100 rounded-2xl shadow border border-base-300">
            <div className="stat-figure text-success">
              <Wallet size={36} />
            </div>
            <div className="stat-title">Total Kas RT</div>
            <div className="stat-value text-success text-2xl">{formatRupiah(data.kas_rt)}</div>
            <div className="stat-desc">Saldo kas aktif</div>
          </div>

          {/* Laporan Warga */}
          <div className="stat bg-base-100 rounded-2xl shadow border border-base-300">
            <div className="stat-figure text-warning">
              <FileText size={36} />
            </div>
            <div className="stat-title">Laporan Masuk</div>
            <div className="stat-value text-warning">{data.laporan_warga}</div>
            <div className="stat-desc">Total laporan warga</div>
          </div>
        </div>
      );
    } else {
      const data = apiData.data as WargaData;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Jadwal Ronda */}
          <div className="stat bg-base-100 rounded-2xl shadow border border-base-300">
            <div className="stat-figure text-info">
              <Calendar size={36} />
            </div>
            <div className="stat-title">Jadwal Ronda</div>
            <div className="stat-value text-info text-2xl">{data.jadwal_ronda}</div>
            <div className="stat-desc">Jadwal ronda giliran</div>
          </div>

          {/* Iuran Bulanan */}
          <div className="stat bg-base-100 rounded-2xl shadow border border-base-300">
            <div className="stat-figure text-primary">
              <BadgeDollarSign size={36} />
            </div>
            <div className="stat-title">Iuran Bulanan</div>
            <div className="stat-value text-primary text-2xl">{formatRupiah(data.iuran_bulanan)}</div>
            <div className="stat-desc">Per bulan per rumah</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm border-b border-base-300 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="flex items-center gap-2 px-2">
            <div className="bg-primary text-primary-content p-2 rounded-xl">
              <Building2 size={20} />
            </div>
            <span className="text-lg font-bold">E-RT Digital</span>
          </div>
        </div>
        <div className="navbar-end gap-3 pr-4">
          {/* Role Badge */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold">{userName}</span>
            <span className={`badge badge-xs ${isRt ? 'badge-primary' : 'badge-secondary'}`}>
              {isRt ? 'Ketua RT' : 'Warga'}
            </span>
          </div>
          {/* Avatar */}
          <div className="avatar placeholder">
            <div className={`w-9 rounded-full text-white text-sm font-bold
              ${isRt ? 'bg-primary' : 'bg-secondary'}`}>
              <span>{userName.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          {/* Logout */}
          <button onClick={handleLogout} className="btn btn-ghost btn-sm text-error">
            <LogOut size={16} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">

        {/* Welcome Hero */}
        <div className={`hero rounded-2xl mb-8 py-10 shadow-lg text-primary-content
          ${isRt ? 'bg-gradient-to-br from-primary to-violet-700' : 'bg-gradient-to-br from-secondary to-blue-500'}`}>
          <div className="hero-content text-center">
            <div>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={32} />
                </div>
              </div>
              <h1 className="text-2xl font-bold">Selamat datang, {userName}!</h1>
              <p className="py-2 opacity-80 text-sm max-w-md">
                {isRt
                  ? 'Anda login sebagai Ketua RT. Berikut ringkasan administrasi RT Anda.'
                  : 'Anda login sebagai Warga. Berikut informasi untuk Anda.'}
              </p>
            </div>
          </div>
        </div>

        {/* API Info Message */}
        {apiData && !loading && (
          <div role="alert" className="alert alert-info mb-6">
            <Info size={16} />
            <span>{apiData.message}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div role="alert" className="alert alert-error mb-6">
            <AlertTriangle size={16} />
            <span className="flex-1">{error}</span>
            <button onClick={fetchDashboardData} className="btn btn-sm btn-ghost">
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="stat bg-base-100 rounded-2xl shadow border border-base-300">
                <div className="flex flex-col gap-3">
                  <div className="skeleton h-8 w-8 rounded-lg"></div>
                  <div className="skeleton h-4 w-28"></div>
                  <div className="skeleton h-8 w-36"></div>
                  <div className="skeleton h-3 w-24"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stat Cards */}
        {!loading && renderStatCards()}

        {/* Divider */}
        <div className="divider text-base-content/40 text-sm font-semibold uppercase tracking-wider">
          Menu Cepat
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
          {[
            {
              icon: <Users size={22} />,
              title: 'Data Warga',
              desc: 'Kelola data penduduk dan rumah tangga.',
              color: 'text-primary',
              bg: 'bg-primary/10',
            },
            {
              icon: <Home size={22} />,
              title: 'Iuran & Kas',
              desc: 'Pantau pembayaran iuran dan keuangan.',
              color: 'text-success',
              bg: 'bg-success/10',
            },
            {
              icon: <Info size={22} />,
              title: 'Pengumuman',
              desc: 'Bagikan informasi kepada seluruh warga.',
              color: 'text-warning',
              bg: 'bg-warning/10',
            },
          ].map((menu) => (
            <div key={menu.title} className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="card-body flex-row items-start gap-4 p-5">
                <div className={`w-10 h-10 rounded-xl ${menu.bg} ${menu.color} flex items-center justify-center shrink-0`}>
                  {menu.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{menu.title}</h3>
                  <p className="text-xs text-base-content/60 mt-0.5">{menu.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
