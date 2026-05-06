import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, Loader2, Download, Printer, PieChart, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DetailedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
}

interface DetailedData {
  year: number;
  month: number;
  total_income: number;
  total_expense: number;
  income_details: any[];
  expense_details: any[];
}

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const getMonthName = (month: number) => {
  return new Date(2000, month - 1).toLocaleString('id-ID', { month: 'long' });
};

export const DetailedReportModal: React.FC<DetailedReportModalProps> = ({
  isOpen,
  onClose,
  year,
  month,
}) => {
  const [data, setData] = useState<DetailedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await api.get('/dashboard/report-cashflow-detailed', {
            params: { year, month }
          });
          setData(res.data.data);
        } catch (err: any) {
          setError('Gagal memuat rincian laporan.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, year, month]);

  const exportToPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const monthName = getMonthName(month);
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('LAPORAN KEUANGAN RT', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`${monthName.toUpperCase()} ${year}`, 105, 30, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 20, 42);

    // Summary Box
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 50, 170, 30, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Pemasukan:`, 30, 60);
    doc.setTextColor(34, 197, 94); // success color
    doc.text(`${formatRupiah(data.total_income)}`, 180, 60, { align: 'right' });
    
    doc.setTextColor(0);
    doc.text(`Total Pengeluaran:`, 30, 68);
    doc.setTextColor(239, 68, 68); // error color
    doc.text(`${formatRupiah(data.total_expense)}`, 180, 68, { align: 'right' });
    
    doc.setTextColor(0);
    doc.text(`Saldo Akhir Bulan:`, 30, 76);
    doc.setFont('helvetica', 'bold');
    doc.text(`${formatRupiah(data.total_income - data.total_expense)}`, 180, 76, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    // Income Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RINCIAN PEMASUKAN', 20, 95);
    autoTable(doc, {
      startY: 100,
      head: [['No', 'Warga / Pembayar', 'Jenis Iuran', 'Jumlah']],
      body: data.income_details.map((item, idx) => [
        idx + 1,
        item.payer_occupant?.occupant_name || '-',
        item.dues_type?.dues_type_name || '-',
        formatRupiah(item.payment_amount)
      ]),
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 }
    });

    // Expense Table
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RINCIAN PENGELUARAN', 20, finalY + 15);
    autoTable(doc, {
      startY: finalY + 20,
      head: [['No', 'Keterangan Pengeluaran', 'Tanggal', 'Jumlah']],
      body: data.expense_details.map((item, idx) => [
        idx + 1,
        item.expense_description,
        new Date(item.expense_date).toLocaleDateString('id-ID'),
        formatRupiah(item.expense_amount)
      ]),
      headStyles: { fillColor: [239, 68, 68] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 }
    });

    // Signature Area
    const lastY = (doc as any).lastAutoTable.finalY || finalY + 40;
    if (lastY > 230) doc.addPage();
    
    const sigY = lastY > 230 ? 40 : lastY + 30;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text('Mengetahui,', 150, sigY);
    doc.text('Ketua RT', 150, sigY + 5);
    doc.text('___________________', 150, sigY + 25);

    doc.save(`Laporan_Keuangan_RT_${monthName}_${year}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-[2.5rem] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-primary to-indigo-600 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="opacity-70" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Laporan Bulanan Detail</span>
              </div>
              <h3 className="text-3xl font-black">{getMonthName(month)} {year}</h3>
            </div>
            <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm text-white/50 hover:text-white hover:bg-white/10">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={48} className="animate-spin text-primary" />
              <p className="font-black text-xs uppercase tracking-widest text-base-content/30">Menganalisis Data Keuangan...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error rounded-3xl text-white font-bold">
              <AlertCircle size={24} />
              <span>{error}</span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-success/5 border border-success/10 rounded-3xl p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-success uppercase tracking-widest mb-1">Total Pemasukan</p>
                    <h4 className="text-2xl font-black text-success">{formatRupiah(data?.total_income || 0)}</h4>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-success text-success-content flex items-center justify-center shadow-lg shadow-success/20">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div className="bg-error/5 border border-error/10 rounded-3xl p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-error uppercase tracking-widest mb-1">Total Pengeluaran</p>
                    <h4 className="text-2xl font-black text-error">{formatRupiah(data?.total_expense || 0)}</h4>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-error text-error-content flex items-center justify-center shadow-lg shadow-error/20">
                    <TrendingDown size={24} />
                  </div>
                </div>
              </div>

              {/* Details Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income Details */}
                <div className="space-y-4">
                  <h5 className="text-sm font-black uppercase tracking-widest text-base-content/40 px-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    Rincian Pemasukan
                  </h5>
                  <div className="overflow-hidden rounded-3xl border border-base-200 shadow-sm">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr className="bg-base-200/50">
                          <th className="text-[10px] font-black uppercase text-base-content/50">Warga / Jenis</th>
                          <th className="text-[10px] font-black uppercase text-base-content/50 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold text-sm">
                        {data?.income_details.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="text-center py-8 text-base-content/30 italic">Tidak ada pemasukan tercatat</td>
                          </tr>
                        ) : (
                          data?.income_details.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <p className="text-base-content">{item.payer_occupant?.occupant_name}</p>
                                <p className="text-[10px] opacity-50 uppercase">{item.dues_type?.dues_type_name}</p>
                              </td>
                              <td className="text-right text-success">{formatRupiah(item.payment_amount)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Expense Details */}
                <div className="space-y-4">
                  <h5 className="text-sm font-black uppercase tracking-widest text-base-content/40 px-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    Rincian Pengeluaran
                  </h5>
                  <div className="overflow-hidden rounded-3xl border border-base-200 shadow-sm">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr className="bg-base-200/50">
                          <th className="text-[10px] font-black uppercase text-base-content/50">Keterangan</th>
                          <th className="text-[10px] font-black uppercase text-base-content/50 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold text-sm">
                        {data?.expense_details.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="text-center py-8 text-base-content/30 italic">Tidak ada pengeluaran tercatat</td>
                          </tr>
                        ) : (
                          data?.expense_details.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <p className="text-base-content">{item.expense_description}</p>
                                <p className="text-[10px] opacity-50 uppercase">{new Date(item.expense_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                              </td>
                              <td className="text-right text-error">{formatRupiah(item.expense_amount)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-base-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
             <button 
               onClick={exportToPDF}
               disabled={loading || !!error || !data}
               className="btn btn-outline btn-sm rounded-xl gap-2 font-black border-base-300"
             >
               <Download size={16} /> Export PDF
             </button>
             <button 
               onClick={() => window.print()}
               disabled={loading || !!error || !data}
               className="btn btn-outline btn-sm rounded-xl gap-2 font-black border-base-300"
             >
               <Printer size={16} /> Cetak
             </button>
          </div>
          <button onClick={onClose} className="btn btn-primary px-12 rounded-2xl font-black shadow-lg shadow-primary/20">
            Tutup Laporan
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
