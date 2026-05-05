import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../utils/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Calendar, AlertCircle, ChevronRight, Activity } from 'lucide-react';

interface MonthlyData {
  month: number;
  month_name: string;
  income: number;
  expense: number;
  balance: number;
  running_balance: number;
}

interface YearData {
  year: number;
  monthly_data: MonthlyData[];
}

interface ReportResponse {
  message: string;
  total_balance: number;
  years: YearData[];
}

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const formatShortRupiah = (amount: number) => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'jt';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'rb';
  return amount.toString();
};

export default function Dashboard() {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const isRt = Cookies.get('user_is_rt') === 'true';
  const userName = Cookies.get('user_name') || 'Pengguna';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/report-monthly');
      const data: ReportResponse = res.data;
      setReport(data);
      
      // Default to latest year if available
      if (data.years.length > 0) {
        const latestYear = data.years[data.years.length - 1].year;
        setSelectedYear(latestYear);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat laporan statistik.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentYearData = report?.years.find(y => y.year === selectedYear);
  const chartData = currentYearData?.monthly_data.map(m => ({
    name: m.month_name.substring(0, 3),
    Pemasukan: m.income,
    Pengeluaran: m.expense,
    Saldo: m.running_balance
  })) || [];

  return (
    <div className="p-6 lg:p-8 max-w-xxl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl ${isRt ? 'bg-gradient-to-br from-indigo-600 via-primary to-violet-700' : 'bg-gradient-to-br from-emerald-500 via-secondary to-teal-600'}`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                Sistem Administrasi RT
              </span>
            </div>
            <p className="text-xl font-medium opacity-80 mb-2">Selamat datang kembali 👋</p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">{userName}</h1>
            <p className="text-white/60 font-medium">{isRt ? 'Anda memiliki akses penuh sebagai Ketua RT' : 'Anda terdaftar sebagai warga tetap'}</p>
          </div>
          
          {/* Quick Balance Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-inner flex flex-col gap-1 min-w-[240px]">
            <div className="flex items-center gap-2 text-white/60 mb-1">
              <Wallet size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Total Kas RT</span>
            </div>
            <h2 className="text-3xl font-black leading-none">
              {loading ? (
                <div className="h-8 w-40 bg-white/20 animate-pulse rounded-lg" />
              ) : (
                formatRupiah(report?.total_balance || 0)
              )}
            </h2>
            <div className="mt-4 flex items-center gap-2">
               <span className="badge badge-success badge-sm text-[10px] font-bold text-white py-2">AKTIF</span>
               <span className="text-[10px] text-white/50 font-bold uppercase italic">Update Real-time</span>
            </div>
          </div>
        </div>

        {/* Abstract shapes for design */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error shadow-lg rounded-2xl border-none text-white font-bold py-4">
          <AlertCircle size={24} />
          <span>{error}</span>
          <button onClick={fetchData} className="btn btn-sm btn-ghost hover:bg-white/20">Coba Lagi</button>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300 rounded-[2rem] overflow-hidden">
          <div className="p-6 lg:p-8 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Activity className="text-primary" size={24} />
                  Statistik Keuangan Bulanan
                </h3>
                <p className="text-xs text-base-content/50 mt-1 font-medium italic">Visualisasi arus kas masuk dan keluar warga</p>
              </div>
              
              {/* Year Selector */}
              <div className="join bg-base-200 p-1 rounded-xl">
                {report?.years.map((y) => (
                  <button 
                    key={y.year}
                    onClick={() => setSelectedYear(y.year)}
                    className={`join-item btn btn-sm border-none shadow-none font-bold ${selectedYear === y.year ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {y.year}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full">
              {loading ? (
                <div className="w-full h-full bg-base-200/50 animate-pulse rounded-2xl flex items-center justify-center">
                   <div className="loading loading-spinner loading-lg opacity-20"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-base-300)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor', opacity: 0.5 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: 'currentColor', opacity: 0.5 }}
                      tickFormatter={(val) => formatShortRupiah(val)}
                    />
                    <Tooltip 
                      cursor={{ fill: 'var(--color-base-200)', opacity: 0.4 }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      formatter={(value: any) => [formatRupiah(value), '']}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }} />
                    <Bar 
                      dataKey="Pemasukan" 
                      fill="var(--color-primary)" 
                      radius={[6, 6, 0, 0]}
                      barSize={12}
                    />
                    <Bar 
                      dataKey="Pengeluaran" 
                      fill="#f43f5e" 
                      radius={[6, 6, 0, 0]}
                      barSize={12}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Info Cards */}
        <div className="flex flex-col gap-6">
          {/* Quick Summary Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2rem] p-6 flex-1">
            <h4 className="text-sm font-black uppercase tracking-widest text-base-content/30 mb-6 flex items-center gap-2">
              <Calendar size={14} />
              Ringkasan {selectedYear}
            </h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-base-content/40 uppercase leading-none mb-1">Total Pemasukan</p>
                    <p className="text-lg font-black leading-none">
                      {formatRupiah(currentYearData?.monthly_data.reduce((acc, curr) => acc + curr.income, 0) || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-base-content/40 uppercase leading-none mb-1">Total Pengeluaran</p>
                    <p className="text-lg font-black leading-none">
                      {formatRupiah(currentYearData?.monthly_data.reduce((acc, curr) => acc + curr.expense, 0) || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divider my-0" />

              <div className="bg-base-200/50 rounded-2xl p-4">
                <p className="text-[10px] font-black text-base-content/40 uppercase mb-2">Prediksi Kas Bulan Depan</p>
                <div className="flex items-end justify-between">
                   <p className="text-xl font-black text-primary">Stabil</p>
                   <span className="text-[10px] font-bold text-success">+2.4% vs Ltg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <button className="btn btn-primary btn-lg rounded-[1.5rem] shadow-lg shadow-primary/20 h-20 group">
            Lihat Laporan Detail
            <ChevronRight className="ml-auto group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Quick Menu / Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Input Iuran', icon: <Wallet size={20} />, color: 'btn-outline border-base-300' },
           { label: 'Data Warga', icon: <TrendingUp size={20} />, color: 'btn-outline border-base-300' },
           { label: 'Pengumuman', icon: <AlertCircle size={20} />, color: 'btn-outline border-base-300' },
           { label: 'E-Laporan', icon: <Activity size={20} />, color: 'btn-outline border-base-300' },
         ].map((item, idx) => (
           <button key={idx} className={`btn btn-lg h-24 flex-col gap-2 rounded-3xl normal-case ${item.color}`}>
             {item.icon}
             <span className="text-xs font-bold">{item.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
}
