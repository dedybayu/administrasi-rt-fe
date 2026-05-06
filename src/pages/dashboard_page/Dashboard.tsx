import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../utils/api';
import { AlertCircle } from 'lucide-react';

import { DetailedReportModal } from './components/DetailedReportModal';
import { WelcomeHeader } from './components/WelcomeHeader';
import { YearlyChart } from './components/YearlyChart';
import { DailyChart } from './components/DailyChart';
import { AnalysisCards } from './components/AnalysisCards';
import { WargaDashboard } from './components/WargaDashboard';

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

export default function Dashboard() {
  const isRt = Cookies.get('user_is_rt') === 'true';
  const userName = Cookies.get('user_name') || 'Pengguna';

  // Admin states
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

  const fetchData = useCallback(async () => {
    if (!isRt) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/report-cashflow');
      const data: ReportResponse = res.data;
      setReport(data);

      if (data.years.length > 0) {
        const latestYear = data.years[data.years.length - 1].year;
        setSelectedYear(latestYear);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat laporan statistik.');
    } finally {
      setLoading(false);
    }
  }, [isRt]);

  const fetchDetailedData = useCallback(async (year: number, month: number) => {
    if (!isRt) return;
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
  }, [isRt]);

  const fetchDailyData = useCallback(async (year: number, month: number) => {
    if (!isRt) return;
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
  }, [isRt]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (isRt) {
      fetchDetailedData(selectedYear, selectedMonth);
      fetchDailyData(selectedYear, selectedMonth);
    }
  }, [selectedYear, selectedMonth, fetchDetailedData, fetchDailyData, isRt]);

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
      <WelcomeHeader 
        userName={userName} 
        isRt={isRt} 
        loading={isRt ? loading : false} 
        totalBalance={report?.total_balance || 0} 
      />

      {isRt ? (
        <>
          {error && (
            <div className="alert alert-error shadow-lg rounded-2xl border-none text-white font-bold py-4">
              <AlertCircle size={24} />
              <span>{error}</span>
              <button onClick={fetchData} className="btn btn-sm btn-ghost hover:bg-white/20">Coba Lagi</button>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 items-start">
            <div className="flex flex-col gap-6">
              <YearlyChart 
                loading={loading}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                years={report?.years || []}
                chartData={chartData}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
                onDetailOpen={() => setIsDetailModalOpen(true)}
              />

              <DailyChart 
                loadingDaily={loadingDaily}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                dailyData={dailyData}
              />
            </div>

            <AnalysisCards 
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              loadingDetailed={loadingDetailed}
              detailedData={detailedData}
              report={report}
              currentYearData={currentYearData}
              onDetailOpen={() => setIsDetailModalOpen(true)}
            />
          </div>

          <DetailedReportModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            year={selectedYear}
            month={selectedMonth}
          />
        </>
      ) : (
        <WargaDashboard />
      )}
    </div>
  );
}
