import { useCallback, useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  Wallet,
  Search,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  User,
  Eye,
  Plus
} from 'lucide-react';
import { PaymentModal } from './components/PaymentModal';
import { PaymentDetailModal } from './components/PaymentDetailModal';

interface Payment {
  payment_id: number;
  dues_type: {
    dues_type_id: number;
    dues_type_name: string;
    dues_type_amount: string;
  };
  payer_occupant: {
    occupant_id: number;
    occupant_name: string;
  };
  house_occupant: {
    house: {
      house_id: number;
      house_name: string;
      house_number: string;
    };
    occupant: {
      occupant_id: number;
      occupant_name: string;
    };
  };
  payment_amount: string;
  payment_date: string;
  payment_period_month: number;
  payment_period_year: number;
  payment_status: 'success' | 'pending' | 'failed' | 'rejected' | string | null;
  payment_proof: string | null;
  payment_proof_url?: string | null;
  occupant_name: string;
  house_name: string;
  dues_type_name: string;
}

const ITEMS_PER_PAGE = 10;

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/payments');
      setPayments(res.data.data ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data iuran.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (formData: FormData | FormData[]) => {
    setSubmitting(true);
    setFormErrors({});
    try {
      if (Array.isArray(formData)) {
        // Sequential requests for multi-month payment
        for (const data of formData) {
          await api.post('/payments', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        await api.post('/payments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchPayments();
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data) {
        setFormErrors(err.response.data.errors || err.response.data);
      } else {
        setError(err.response?.data?.message || 'Gagal menyimpan iuran.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowDetail = async (p: Payment) => {
    try {
      const res = await api.get(`/payments/${p.payment_id}`);
      setSelectedPayment(res.data.data);
      setIsDetailModalOpen(true);
    } catch (err: any) {
      setError('Gagal memuat detail pembayaran.');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.occupant_name.toLowerCase().includes(search.toLowerCase()) ||
      p.house_name.toLowerCase().includes(search.toLowerCase()) ||
      p.dues_type_name.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' ||
      ((p.payment_status && p.payment_status !== '') ? p.payment_status.toLowerCase() === statusFilter.toLowerCase() : statusFilter === 'unpaid');

    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const stats = {
    total: payments.filter(p => p.payment_status === 'success').reduce((acc, curr) => acc + parseFloat(curr.payment_amount), 0),
    pending: payments.filter(p => p.payment_status === 'pending' || p.payment_status === null).length,
    failed: payments.filter(p => p.payment_status === 'failed' || p.payment_status === 'rejected').length,
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return 'badge-ghost opacity-60';
    const s = status.toLowerCase();
    if (s === 'success' || s === 'paid') return 'badge-success text-success-content';
    if (s === 'pending') return 'badge-warning text-warning-content';
    if (s === 'failed' || s === 'rejected') return 'badge-error text-error-content';
    return 'badge-ghost';
  };

  const getStatusIcon = (status: string | null) => {
    if (!status) return <Clock size={14} className="opacity-50" />;
    const s = status.toLowerCase();
    if (s === 'success' || s === 'paid') return <CheckCircle2 size={14} />;
    if (s === 'pending') return <Clock size={14} />;
    if (s === 'failed' || s === 'rejected') return <XCircle size={14} />;
    return null;
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  return (
    <div className="p-6 lg:p-8 max-w-xxl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-base-content">Iuran & Kas</h1>
            <p className="text-base-content/50 text-sm mt-1 font-medium">
              Monitor penerimaan iuran warga dan pengelolaan kas RT
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchPayments}
              className="btn btn-ghost btn-sm gap-2 normal-case font-bold"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => { setFormErrors({}); setIsModalOpen(true); }}
              className="btn btn-primary btn-sm gap-2 normal-case font-bold"
            >
              <Plus size={16} />
              Catat Iuran Baru
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card bg-success/10 border border-success/20 text-success shadow-sm">
            <div className="card-body p-5 flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-success text-success-content flex items-center justify-center shadow-lg shadow-success/20">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Total Pemasukan</p>
                <p className="text-2xl font-black">{formatCurrency(stats.total)}</p>
              </div>
            </div>
          </div>
          <div className="card bg-warning/10 border border-warning/20 text-warning shadow-sm">
            <div className="card-body p-5 flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-warning text-warning-content flex items-center justify-center shadow-lg shadow-warning/20">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Menunggu Konfirmasi</p>
                <p className="text-2xl font-black">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="card bg-error/10 border border-error/20 text-error shadow-sm">
            <div className="card-body p-5 flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-error text-error-content flex items-center justify-center shadow-lg shadow-error/20">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Pembayaran Gagal</p>
                <p className="text-2xl font-black">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-6">
        <div className="card-body p-4 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
            <input
              type="text"
              placeholder="Cari nama pembayar atau rumah..."
              className="input input-bordered w-full pl-12 bg-base-200/50 border-none focus:bg-base-100 transition-all font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="join border border-base-300 w-full lg:w-auto">
              <select
                className="select select-bordered select-sm join-item bg-base-100 font-bold text-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="success">Berhasil</option>
                <option value="pending">Tertunda</option>
                <option value="unpaid">Tertagih</option>
                <option value="failed">Gagal</option>
              </select>
              <button className="btn btn-sm join-item bg-base-200 border-base-300">
                <Filter size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div role="alert" className="alert alert-error mb-6 shadow-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchPayments} className="btn btn-sm btn-ghost font-bold">Ulangi</button>
        </div>
      )}

      {/* Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50 text-base-content/50 uppercase text-[10px] font-black tracking-widest">
                <th className="py-4">Info Pembayaran</th>
                <th className="py-4">Rumah & Warga</th>
                <th className="py-4">Periode</th>
                <th className="py-4">Jumlah</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="skeleton w-10 h-10 rounded-xl" />
                        <div className="space-y-2">
                          <div className="skeleton h-4 w-32" />
                          <div className="skeleton h-3 w-20" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
                        <Wallet size={32} className="text-base-content/20" />
                      </div>
                      <div>
                        <p className="font-bold text-base-content/60">Tidak ada data pembayaran</p>
                        <p className="text-xs text-base-content/40">Coba gunakan filter atau kata kunci lain</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-inner">
                          {p.dues_type_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-base-content">{p.dues_type_name}</p>
                          <div className="flex items-center gap-1 text-[10px] text-base-content/40 font-bold uppercase tracking-tight">
                            <Calendar size={10} />
                            {p.payment_date ? new Date(p.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Belum Bayar'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-base-content font-bold">
                          <Building2 size={14} className="text-secondary" />
                          <span>{p.house_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-base-content/50 font-medium">
                          <User size={12} />
                          <span>{p.occupant_name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-outline border-base-300 font-bold text-[10px] uppercase px-3 py-2.5">
                        {months[p.payment_period_month - 1]} {p.payment_period_year}
                      </div>
                    </td>
                    <td>
                      <p className="font-black text-base-content">{formatCurrency(p.payment_amount)}</p>
                    </td>
                    <td>
                      <div className={`badge badge-sm font-black gap-1.5 py-3 ${getStatusBadge(p.payment_status)}`}>
                        {getStatusIcon(p.payment_status)}
                        <span className="uppercase text-[9px] tracking-wider">{p.payment_status || 'Tertagih'}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleShowDetail(p)}
                          className="btn btn-ghost btn-square btn-xs hover:bg-primary/20 hover:text-primary transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">
            Halaman {page} dari {totalPages} — {filtered.length} transaksi
          </p>
          <div className="join shadow-sm border border-base-300">
            <button
              className="join-item btn btn-xs px-4 bg-base-100 hover:bg-base-200 border-none font-bold"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={14} />
            </button>
            <div className="join-item flex items-center px-4 bg-base-200 text-[10px] font-black border-x border-base-300">
              {page} / {totalPages}
            </div>
            <button
              className="join-item btn btn-xs px-4 bg-base-100 hover:bg-base-200 border-none font-bold"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
      {/* Modals */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        errors={formErrors}
      />

      <PaymentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
}
