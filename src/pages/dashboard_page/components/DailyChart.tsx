import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import { formatRupiah, formatShortRupiah } from '../../../utils/formatters';

interface DailyChartProps {
  loadingDaily: boolean;
  selectedYear: number;
  selectedMonth: number;
  dailyData: any[];
}

export const DailyChart: React.FC<DailyChartProps> = ({
  loadingDaily,
  selectedYear,
  selectedMonth,
  dailyData
}) => {
  const monthName = new Date(2000, selectedMonth - 1).toLocaleString('id-ID', { month: 'long' });

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2">
              <Activity className="text-secondary" size={24} />
              Statistik Harian - {monthName} {selectedYear}
            </h3>
            <p className="text-xs text-base-content/50 mt-1 font-medium italic">Rincian arus kas masuk dan keluar setiap tanggal</p>
          </div>
        </div>

        <div className="h-[400px] w-full">
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
                  labelFormatter={(label) => `Tanggal ${label} ${monthName}`}
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
  );
};
