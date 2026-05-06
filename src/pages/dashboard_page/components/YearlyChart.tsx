import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import { formatRupiah, formatShortRupiah } from '../../../utils/formatters';

interface YearlyChartProps {
  loading: boolean;
  selectedYear: number;
  selectedMonth: number;
  years: { year: number }[];
  chartData: any[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDetailOpen: () => void;
}

export const YearlyChart: React.FC<YearlyChartProps> = ({
  loading,
  selectedYear,
  selectedMonth,
  years,
  chartData,
  onYearChange,
  onMonthChange,
  onDetailOpen
}) => {
  return (
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
              onChange={(e) => onMonthChange(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('id-ID', { month: 'long' })}
                </option>
              ))}
            </select>
            <div className="join">
              {years.map((y) => (
                <button
                  key={y.year}
                  onClick={() => onYearChange(y.year)}
                  className={`join-item btn btn-sm border-none shadow-none font-bold ${selectedYear === y.year ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {y.year}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[450px] w-full">
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
                    onMonthChange(clickedMonth);
                    onDetailOpen();
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
  );
};
