import React, { useCallback, useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  Wallet,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronRight,
  Info,
  CreditCard,
  ArrowRight,
  History,
  ChevronLeft
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { PayDuesModal } from './components/PayDuesModal';

interface Payment {
  payment_id: number;
  dues_type: {
    dues_type_id: number;
    dues_type_name: string;
    dues_type_amount: string;
  };
  house_occupant: {
    house_occupant_id: number;
    house: {
      house_number: string;
      house_address: string;
    };
  };
  payment_amount: string;
  payment_date: string | null;
  payment_period_month: number;
  payment_period_year: number;
  payment_status: 'success' | 'pending' | 'rejected' | null;
  payment_proof: string | null;
  payment_proof_url?: string | null;
}

interface DuesData {
  tagihan: Payment[];
  pending: Payment[];
  success: Payment[];
  rejected: Payment[];
}

export default function MyDues() {
  const [data, setData] = useState<DuesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'tagihan' | 'pending' | 'history'>('all');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const fetchDues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/warga/my-dues');
      setData(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data iuran.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePayClick = (p: Payment) => {
    setSelectedPayment(p);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handlePaySubmit = async (formData: FormData) => {
    setSubmitting(true);
    setFormErrors({});
    try {
      await api.post('/warga/pay', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      fetchDues();
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data) {
        setFormErrors(err.response.data.errors || err.response.data);
      } else {
        alert(err.response?.data?.message || 'Gagal mengirim bukti pembayaran.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDues();
  }, [fetchDues]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const getActiveList = () => {
    if (!data) return [];
    let list: { p: Payment, status: string }[] = [];
    
    const tagihan = data.tagihan.map(p => ({ p, status: 'tagihan' }));
    const rejected = data.rejected.map(p => ({ p, status: 'rejected' }));
    const pending = data.pending.map(p => ({ p, status: 'pending' }));
    const success = data.success.map(p => ({ p, status: 'success' }));

    switch (activeTab) {
      case 'tagihan':
        list = [...rejected, ...tagihan];
        break;
      case 'pending':
        list = pending;
        break;
      case 'history':
        list = success;
        break;
      case 'all':
      default:
        list = [...rejected, ...tagihan, ...pending, ...success].sort((a, b) => 
          b.p.payment_period_year - a.p.payment_period_year || 
          b.p.payment_period_month - a.p.payment_period_month
        );
    }
    return list;
  };

  const activeList = getActiveList();
  const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE);
  const paginatedList = activeList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'tagihan': return { icon: <CheckCircle2 size={48} />, text: 'Tidak ada tagihan aktif', color: 'text-success' };
      case 'pending': return { icon: <Clock size={48} />, text: 'Tidak ada iuran dalam proses', color: 'text-warning' };
      case 'history': return { icon: <History size={48} />, text: 'Belum ada riwayat iuran', color: 'text-primary' };
      default: return { icon: <AlertCircle size={48} />, text: 'Tidak ada data ditemukan', color: 'text-base-content' };
    }
  };

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const PaymentCard = ({ p, status }: { p: Payment, status: string }) => {
    const statusConfig = {
      tagihan: {
        bg: 'bg-error/5 border-error/10',
        iconBg: 'bg-error/10 text-error',
        icon: <AlertCircle size={20} />,
        label: 'Tertagih',
        color: 'text-error'
      },
      pending: {
        bg: 'bg-warning/5 border-warning/10',
        iconBg: 'bg-warning/10 text-warning',
        icon: <Clock size={20} />,
        label: 'Menunggu Konfirmasi',
        color: 'text-warning'
      },
      success: {
        bg: 'bg-success/5 border-success/10',
        iconBg: 'bg-success/10 text-success',
        icon: <CheckCircle2 size={20} />,
        label: 'Lunas',
        color: 'text-success'
      },
      rejected: {
        bg: 'bg-error/5 border-error/10',
        iconBg: 'bg-error/10 text-error',
        icon: <XCircle size={20} />,
        label: 'Ditolak',
        color: 'text-error'
      }
    }[status] || {
      bg: 'bg-base-200 border-base-300',
      iconBg: 'bg-base-300 text-base-content/50',
      icon: <Info size={20} />,
      label: 'Unknown',
      color: 'text-base-content/50'
    };

    return (
      <div className={`card ${statusConfig.bg} border rounded-[2rem] p-5 transition-all hover:shadow-md group relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${statusConfig.iconBg} flex items-center justify-center shrink-0`}>
              {statusConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                {p.payment_status === 'rejected' && (
                  <span className="badge badge-error badge-xs font-black p-2">DITOLAK</span>
                )}
              </div>
              <h4 className="font-black text-base-content leading-tight">
                {p.dues_type.dues_type_name}
              </h4>
              <p className="text-[11px] font-bold text-base-content/40 uppercase mt-1">
                Periode: {months[p.payment_period_month - 1]} {p.payment_period_year} • Blok {p.house_occupant.house.house_number}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
            <div>
              <p className="text-[10px] font-black text-base-content/30 uppercase tracking-tighter">Jumlah</p>
              <p className="text-lg font-black text-base-content leading-none mt-1">
                {formatRupiah(parseFloat(p.payment_amount))}
              </p>
            </div>
            {status === 'tagihan' || status === 'rejected' ? (
              <button 
                onClick={() => handlePayClick(p)}
                className="btn btn-primary btn-sm rounded-xl font-bold gap-2 group-hover:px-6 transition-all"
              >
                Bayar <ArrowRight size={14} />
              </button>
            ) : (
              <button className="btn btn-ghost btn-sm btn-square rounded-xl text-base-content/20 hover:text-primary">
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
        {/* Background visual element */}
        <div className={`absolute -right-8 -bottom-8 opacity-5 scale-150 rotate-12 group-hover:scale-[1.7] transition-transform duration-500`}>
           <Wallet size={120} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 w-full max-w-full mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-base-content">Iuran Saya</h1>
          <p className="text-base-content/50 text-sm mt-1 font-medium">
            Kelola dan pantau riwayat iuran Anda
          </p>
        </div>
        <button
          onClick={fetchDues}
          className="btn btn-ghost btn-sm gap-2 normal-case font-bold bg-base-200 border-none rounded-xl"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-base-200/50 p-1 rounded-2xl border border-base-300 w-full overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'Semua', icon: <CreditCard size={14} /> },
          { id: 'tagihan', label: 'Tagihan', icon: <AlertCircle size={14} />, count: data?.tagihan.length || data?.rejected.length ? (data?.tagihan.length || 0) + (data?.rejected.length || 0) : 0 },
          { id: 'pending', label: 'Proses', icon: <Clock size={14} />, count: data?.pending.length },
          { id: 'history', label: 'Riwayat', icon: <CheckCircle2 size={14} />, count: data?.success.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[100px] py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-base-100 text-primary shadow-sm border border-base-300' : 'text-base-content/50 hover:bg-base-100/50'}`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`badge badge-sm font-black border-none ${activeTab === tab.id ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/50'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-error shadow-lg rounded-2xl text-white font-bold">
          <AlertCircle size={24} />
          <span>{error}</span>
          <button onClick={fetchDues} className="btn btn-sm btn-ghost">Coba Lagi</button>
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-base-200 animate-pulse rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <>
            {paginatedList.length === 0 ? (
              <div className="text-center py-20 bg-base-200/30 rounded-[2.5rem] border-2 border-dashed border-base-300">
                <div className={`${getEmptyMessage().color} opacity-20 mb-4 flex justify-center`}>
                  {getEmptyMessage().icon}
                </div>
                <p className="font-black text-base-content/40 uppercase tracking-widest text-sm">{getEmptyMessage().text}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedList.map(({ p, status }) => (
                  <PaymentCard key={p.payment_id} p={p} status={status} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button 
                  className="btn btn-sm btn-outline btn-square rounded-xl" 
                  onClick={() => setPage((p) => Math.max(1, p - 1))} 
                  disabled={page === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="join">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`join-item btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'} font-bold`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  className="btn btn-sm btn-outline btn-square rounded-xl" 
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Card */}
      {!loading && !error && (
        <div className="bg-info/10 border border-info/20 rounded-3xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-info text-info-content flex items-center justify-center shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h5 className="font-black text-info text-sm uppercase tracking-widest">Informasi Pembayaran</h5>
            <p className="text-xs text-info/70 font-bold mt-1 leading-relaxed">
              Semua pembayaran iuran dilakukan secara mandiri oleh warga. Setelah melakukan pembayaran, silakan upload bukti pembayaran agar dapat diverifikasi oleh Ketua RT. Status iuran akan berubah menjadi 'Lunas' setelah disetujui.
            </p>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      <PayDuesModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPayment(null); }}
        onSubmit={handlePaySubmit}
        submitting={submitting}
        payment={selectedPayment}
        errors={formErrors}
      />
    </div>
  );
}
