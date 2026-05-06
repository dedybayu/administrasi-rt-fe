import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Shield, Calendar, TrendingUp, TrendingDown, AlertCircle, ChevronRight, PieChart as PieChartIcon } from 'lucide-react';
import { formatRupiah, formatShortRupiah } from '../../../utils/formatters';

interface AnalysisCardsProps {
  selectedYear: number;
  selectedMonth: number;
  loadingDetailed: boolean;
  detailedData: any;
  report: any;
  currentYearData: any;
  onDetailOpen: () => void;
}

export const AnalysisCards: React.FC<AnalysisCardsProps> = ({
  selectedYear,
  selectedMonth,
  loadingDetailed,
  detailedData,
  report,
  currentYearData,
  onDetailOpen
}) => {
  const monthName = new Date(2000, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });

  return (
    <div className="flex flex-col gap-6">
      {/* Monthly Analysis Chart */}
      <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2rem] p-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-base-content/30 flex items-center gap-2">
            <PieChartIcon size={14} />
            Analisis {monthName}
          </h4>
          <button
            onClick={onDetailOpen}
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
                  formatter={(value: any) => formatRupiah(value as number)}
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

      {/* All-time Analysis Chart */}
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
                  { name: 'Pemasukan', value: report?.years.reduce((acc: any, y: any) => acc + y.monthly_data.reduce((ya: any, m: any) => ya + m.income, 0), 0) || 0 },
                  { name: 'Pengeluaran', value: report?.years.reduce((acc: any, y: any) => acc + y.monthly_data.reduce((ya: any, m: any) => ya + m.expense, 0), 0) || 0 }
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
                formatter={(value: any) => formatRupiah(value as number)}
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
            <span className="text-xs font-bold">{formatShortRupiah(report?.years.reduce((acc: any, y: any) => acc + y.monthly_data.reduce((ya: any, m: any) => ya + m.income, 0), 0) || 0)}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-black text-error uppercase">Total Keluar</span>
            <span className="text-xs font-bold">{formatShortRupiah(report?.years.reduce((acc: any, y: any) => acc + y.monthly_data.reduce((ya: any, m: any) => ya + m.expense, 0), 0) || 0)}</span>
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
                  {formatRupiah(currentYearData?.monthly_data.reduce((acc: any, curr: any) => acc + curr.income, 0) || 0)}
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
                  {formatRupiah(currentYearData?.monthly_data.reduce((acc: any, curr: any) => acc + curr.expense, 0) || 0)}
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
        onClick={onDetailOpen}
        className="btn btn-primary btn-lg rounded-[1.5rem] shadow-lg shadow-primary/20 h-20 group"
      >
        Lihat Rincian Keuangan
        <ChevronRight className="ml-auto group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
