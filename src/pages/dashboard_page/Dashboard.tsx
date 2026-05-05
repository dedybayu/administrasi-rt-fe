import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../utils/api';

interface KetualRTData {
  kas_rt: number;
  laporan_warga: number;
}

interface WargaData {
  jadwal_ronda: string;
  iuran_bulanan: number;
}

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export default function Dashboard() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRt = Cookies.get('user_is_rt') === 'true';
  const userName = Cookies.get('user_name') || 'Pengguna';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = isRt ? '/infort' : '/infowrg';
      const res = await api.get(endpoint);
      setApiData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [isRt]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className={`rounded-3xl p-8 mb-8 text-primary-content shadow-xl ${isRt ? 'bg-gradient-to-br from-primary to-violet-600' : 'bg-gradient-to-br from-secondary to-blue-500'}`}>
        <p className="text-sm font-semibold opacity-75 mb-1">Selamat datang kembali 👋</p>
        <h1 className="text-3xl font-extrabold">{userName}</h1>
        <p className="opacity-70 mt-1 text-sm">{isRt ? 'Anda login sebagai Ketua RT' : 'Anda login sebagai Warga'}</p>
      </div>

      {/* Error */}
      {error && !loading && (
        <div role="alert" className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span className="flex-1">{error}</span>
          <button onClick={fetchData} className="btn btn-sm btn-ghost">Coba Lagi</button>
        </div>
      )}

      {/* Info message */}
      {apiData && !loading && (
        <div role="alert" className="alert alert-info mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{apiData.message}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="stat bg-base-100 rounded-2xl shadow border border-base-300 animate-pulse">
              <div className="flex flex-col gap-3 p-4">
                <div className="skeleton h-8 w-8 rounded-lg" />
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-8 w-36" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && apiData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {isRt ? (
            <>
              <div className="stat bg-base-100 rounded-2xl shadow border border-base-300">
                <div className="stat-figure text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="stat-title">Total Kas RT</div>
                <div className="stat-value text-success text-2xl">{formatRupiah((apiData.data as KetualRTData).kas_rt)}</div>
                <div className="stat-desc">Saldo kas aktif</div>
              </div>
              <div className="stat bg-base-100 rounded-2xl shadow border border-base-300">
                <div className="stat-figure text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m-7.5 3h15a2.25 2.25 0 002.25-2.25V8.25A2.25 2.25 0 0016.5 6H12L9.75 3.75H7.5A2.25 2.25 0 005.25 6v13.5A2.25 2.25 0 007.5 21.75z" /></svg>
                </div>
                <div className="stat-title">Laporan Masuk</div>
                <div className="stat-value text-warning">{(apiData.data as KetualRTData).laporan_warga}</div>
                <div className="stat-desc">Total laporan warga</div>
              </div>
            </>
          ) : (
            <>
              <div className="stat bg-base-100 rounded-2xl shadow border border-base-300">
                <div className="stat-figure text-info">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <div className="stat-title">Jadwal Ronda</div>
                <div className="stat-value text-info text-2xl">{(apiData.data as WargaData).jadwal_ronda}</div>
                <div className="stat-desc">Giliran ronda</div>
              </div>
              <div className="stat bg-base-100 rounded-2xl shadow border border-base-300">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="stat-title">Iuran Bulanan</div>
                <div className="stat-value text-primary text-2xl">{formatRupiah((apiData.data as WargaData).iuran_bulanan)}</div>
                <div className="stat-desc">Per bulan per rumah</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="divider text-base-content/40 text-xs font-bold uppercase tracking-widest">Akses Cepat</div>

      {/* Quick menu */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {[
          { label: 'Data Warga', desc: 'Kelola data penghuni', color: 'text-primary', bg: 'bg-primary/10', show: isRt,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8zm6 8v-2a4 4 0 00-3-3.87" /></svg> },
          { label: 'Iuran & Kas', desc: 'Pantau keuangan RT', color: 'text-success', bg: 'bg-success/10', show: isRt,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: 'Informasi RT', desc: 'Lihat pengumuman', color: 'text-warning', bg: 'bg-warning/10', show: true,
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        ].filter(m => m.show).map((menu) => (
          <div key={menu.label} className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <div className="card-body flex-row items-center gap-4 p-5">
              <div className={`w-10 h-10 rounded-xl ${menu.bg} ${menu.color} flex items-center justify-center shrink-0`}>{menu.icon}</div>
              <div>
                <h3 className="font-bold text-sm">{menu.label}</h3>
                <p className="text-xs text-base-content/60 mt-0.5">{menu.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
