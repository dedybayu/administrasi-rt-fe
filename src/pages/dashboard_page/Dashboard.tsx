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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Calendar, AlertCircle, ChevronRight, Activity, Shield, Eye, PieChart as PieChartIcon } from 'lucide-react';
import { DetailedReportModal } from './components/DetailedReportModal';

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
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailedData, setDetailedData] = useState<any>(null);
  const [loadingDetailed, setLoadingDetailed] = useState(false);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loadingDaily, setLoadingDaily] = useState(false);

  const isRt = Cookies.get('user_is_rt') === 'true';
  const userName = Cookies.get('user_name') || 'Pengguna';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/report-cashflow');
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

  const fetchDetailedData = useCallback(async (year: number, month: number) => {
    setLoadingDetailed(true);
    try {
      const res = await api.get('/dashboard/report-cashflow-detailed', {
        params: { year, month }
      });
      setDetailedData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetailed(false);
    }
  }, []);

  const fetchDailyData = useCallback(async (year: number, month: number) => {
    setLoadingDaily(true);
    try {
      const res = await api.get('/dashboard/report-cashflow-daily', {
        params: { year, month }
      });
      setDailyData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDaily(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    fetchDetailedData(selectedYear, selectedMonth);
    fetchDailyData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, fetchDetailedData, fetchDailyData]);

  const currentYearData = report?.years.find(y => y.year === selectedYear);
  const chartData = currentYearData?.monthly_data.map(m => ({
    name: m.month_name.substring(0, 3),
    month: m.month,
    Pemasukan: m.income,
    Pengeluaran: m.expense,
    Saldo: m.running_balance
  })) || [];

  return (
    <div className="p-6 lg:p-8 w-full space-y-8">
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Chart Section - spans 2 cols */}
        <div className="flex flex-col gap-6">

          <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden">
            <div className="p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <Activity className="text-primary" size={24} />
                    Statistik Keuangan Tahunan
                  </h3>
                  <p className="text-xs text-base-content/50 mt-1 font-medium italic">Visualisasi arus kas masuk dan keluar warga</p>
                </div>

                <div className="flex items-center gap-2 bg-base-200 p-1 rounded-xl">
                  <select
                    className="select select-sm select-ghost font-bold focus:bg-transparent"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i).toLocaleString('id-ID', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <div className="join">
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
              </div>

              <div className="h-[300px] w-full">
                {loading ? (
                  <div className="w-full h-full bg-base-200/50 animate-pulse rounded-2xl flex items-center justify-center">
                    <div className="loading loading-spinner loading-lg opacity-20"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      onClick={(data: any) => {
                        if (data && data.activePayload && data.activePayload[0]) {
                          const clickedMonth = data.activePayload[0].payload.month;
                          setSelectedMonth(clickedMonth);
                          setIsDetailModalOpen(true);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
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

          <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden">
            {/* Daily Stats Chart */}
            <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h3 className="text-xl font-black flex items-center gap-2">
                      <Activity className="text-secondary" size={24} />
                      Statistik Harian - {new Date(2000, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' })} {selectedYear}
                    </h3>
                    <p className="text-xs text-base-content/50 mt-1 font-medium italic">Rincian arus kas masuk dan keluar setiap tanggal</p>
                  </div>
                </div>

                <div className="h-[250px] w-full">
                  {loadingDaily ? (
                    <div className="w-full h-full bg-base-200/50 animate-pulse rounded-2xl flex items-center justify-center">
                      <div className="loading loading-spinner loading-lg opacity-20"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-base-300)" />
                        <XAxis
                          dataKey="day"
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
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                          formatter={(value: any) => [formatRupiah(value), '']}
                          labelFormatter={(label) => `Tanggal ${label} ${new Date(2000, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' })}`}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }} />
                        <Bar
                          dataKey="income"
                          name="Pemasukan"
                          fill="var(--color-primary)"
                          radius={[4, 4, 0, 0]}
                          barSize={8}
                        />
                        <Bar
                          dataKey="expense"
                          name="Pengeluaran"
                          fill="#f43f5e"
                          radius={[4, 4, 0, 0]}
                          barSize={8}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Info Cards & Monthly Analysis */}
          <div className="flex flex-col gap-6">
            {/* Monthly Analysis Chart */}
            <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2rem] p-6 flex-1">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
                  <PieChartIcon size={14} />
                  Analisis {new Date(2000, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' })}
                </h4>
                <button
                  onClick={() => setIsDetailModalOpen(true)}
                  className="btn btn-ghost btn-xs btn-square text-primary"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div className="h-[200px] w-full relative">
                {loadingDetailed ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="loading loading-spinner loading-md opacity-20"></span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Pemasukan', value: detailedData?.total_income || 0 },
                          { name: 'Pengeluaran', value: detailedData?.total_expense || 0 }
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="var(--color-primary)" />
                        <Cell fill="#f43f5e" />
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatRupiah(value)}
                        contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {!loadingDetailed && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-black uppercase text-base-content/30">Netto</p>
                    <p className={`text-sm font-black ${(detailedData?.total_income - detailedData?.total_expense) >= 0 ? 'text-success' : 'text-error'}`}>
                      {formatShortRupiah(detailedData?.total_income - detailedData?.total_expense || 0)}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase">Pemasukan</span>
                  <span className="text-sm font-bold">{formatShortRupiah(detailedData?.total_income || 0)}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-black text-error uppercase">Pengeluaran</span>
                  <span className="text-sm font-bold">{formatShortRupiah(detailedData?.total_expense || 0)}</span>
                </div>
              </div>
            </div>

            {/* All-time Analysis Chart (New) */}
            <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
                  <Shield size={14} />
                  Analisis Keseluruhan
                </h4>
              </div>

              <div className="h-[180px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pemasukan', value: report?.years.reduce((acc, y) => acc + y.monthly_data.reduce((ya, m) => ya + m.income, 0), 0) || 0 },
                        { name: 'Pengeluaran', value: report?.years.reduce((acc, y) => acc + y.monthly_data.reduce((ya, m) => ya + m.expense, 0), 0) || 0 }
                      ]}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#6366f1" />
                      <Cell fill="#f43f5e" />
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatRupiah(value)}
                      contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[9px] font-black uppercase text-base-content/30 leading-none">Total Saldo</p>
                  <p className={`text-xs font-black ${report?.total_balance >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatShortRupiah(report?.total_balance || 0)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-indigo-500 uppercase">Total Masuk</span>
                  <span className="text-xs font-bold">{formatShortRupiah(report?.years.reduce((acc, y) => acc + y.monthly_data.reduce((ya, m) => ya + m.income, 0), 0) || 0)}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-black text-error uppercase">Total Keluar</span>
                  <span className="text-xs font-bold">{formatShortRupiah(report?.years.reduce((acc, y) => acc + y.monthly_data.reduce((ya, m) => ya + m.expense, 0), 0) || 0)}</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2rem] p-6">
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

                {report && (report.total_balance < 0 ? (
                  <div className="bg-error/10 border border-error/20 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-error text-error-content flex items-center justify-center shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-error uppercase tracking-widest">Peringatan Saldo</p>
                      <p className="text-xs font-bold text-error/80">Saldo kas RT sedang kritis! Segera tinjau pengeluaran.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success text-success-content flex items-center justify-center shrink-0">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-success uppercase tracking-widest">Status Saldo Aman</p>
                      <p className="text-xs font-bold text-success/80">Kondisi keuangan RT saat ini dalam keadaan sehat.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="btn btn-primary btn-lg rounded-[1.5rem] shadow-lg shadow-primary/20 h-20 group"
            >
              Lihat Rincian Keuangan
              <ChevronRight className="ml-auto group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <DetailedReportModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          year={selectedYear}
          month={selectedMonth}
        />
      </div>
    </div>
  );
}
