import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, History, CreditCard, Clock, AlertCircle, ChevronRight, CheckCircle2, Wallet } from 'lucide-react';
import api from '../../../utils/api';
import { formatRupiah } from '../../../utils/formatters';
import { PayDuesModal } from '../../occupant_payments_page/components/PayDuesModal';

interface House {
  house_id: number;
  house_number: string;
  house_address: string;
}

interface HouseOccupant {
  house_occupant_id: number;
  house: House;
  start_in_date: string;
  end_in_date: string | null;
  is_current: boolean;
  is_head_family: boolean;
}

interface Payment {
  payment_id: number;
  dues_type: {
    dues_type_id: number;
    dues_type_name: string;
    dues_type_amount: number;
  };
  house_occupant: {
    house: House;
    house_occupant_id: number;
  };
  payment_amount: number;
  payment_date: string | null;
  payment_period_month: number;
  payment_period_year: number;
  payment_status: string;
}

interface WargaDashboardData {
  occupant: {
    occupant_name: string;
  };
  current_houses: HouseOccupant[];
  house_history: HouseOccupant[];
  unpaid_payments: Payment[];
  payment_history: Payment[];
}

export const WargaDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<WargaDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/warga/dashboard');
      setData(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data dashboard warga');
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
      fetchDashboardData();
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
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg rounded-2xl text-white">
        <AlertCircle size={24} />
        <span>{error}</span>
        <button onClick={fetchDashboardData} className="btn btn-sm btn-ghost">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting Section */}
      <div className="mb-2">
        <h3 className="text-2xl font-black text-base-content/80">
          Halo, <span className="text-primary">{data?.occupant.occupant_name}</span> 👋
        </h3>
        <p className="text-xs font-medium text-base-content/40 uppercase tracking-widest mt-1">
          Berikut adalah ringkasan hunian dan iuran Anda
        </p>
      </div>

      {/* Summary Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-primary text-primary-content p-6 rounded-[2rem] shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 opacity-80 mb-2">
              <Home size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Rumah Aktif</span>
            </div>
            <h2 className="text-3xl font-black">{data?.current_houses.length || 0} Unit</h2>
            <p className="text-xs mt-2 opacity-70">Terdaftar sebagai penghuni aktif</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
        </div>

        <div className="card bg-secondary text-secondary-content p-6 rounded-[2rem] shadow-xl shadow-secondary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 opacity-80 mb-2">
              <CreditCard size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Tagihan Pending</span>
            </div>
            <h2 className="text-3xl font-black">{data?.unpaid_payments.length || 0} Iuran</h2>
            <p className="text-xs mt-2 opacity-70">Segera lakukan pembayaran</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
        </div>

        <div className="card bg-accent text-accent-content p-6 rounded-[2rem] shadow-xl shadow-accent/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 opacity-80 mb-2">
              <CheckCircle2 size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Total Terbayar</span>
            </div>
            <h2 className="text-3xl font-black">{data?.payment_history.length || 0} Transaksi</h2>
            <p className="text-xs mt-2 opacity-70">Riwayat pembayaran Anda</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
        {/* Left Column: House & Payments */}
        <div className="space-y-8">
          {/* Tagihan / Pending Payments */}
          <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-black flex items-center gap-2 mb-6">
                <Wallet className="text-error" size={24} />
                Tagihan Belum Dibayar
              </h3>
              
              {data?.unpaid_payments.length === 0 ? (
                <div className="text-center py-12 bg-base-200/50 rounded-3xl">
                  <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="font-bold text-base-content/50">Semua iuran sudah terbayar!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.unpaid_payments.slice(0, 5).map((p) => (
                    <div key={p.payment_id} className="flex items-center justify-between p-5 bg-base-200/50 rounded-3xl border border-base-300 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="font-black text-sm">{p.dues_type.dues_type_name}</p>
                          <p className="text-[10px] font-bold text-base-content/40 uppercase">
                            {new Date(p.payment_period_year, p.payment_period_month - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })} • Rumah {p.house_occupant.house.house_number}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-error">{formatRupiah(p.payment_amount)}</p>
                        <button 
                          onClick={() => handlePayClick(p)}
                          className="btn btn-primary btn-xs rounded-lg mt-1 font-bold"
                        >
                          Bayar Sekarang
                        </button>
                      </div>
                    </div>
                  ))}
                  {(data?.unpaid_payments?.length ?? 0) > 5 && (
                    <button 
                      onClick={() => navigate('/my-dues')}
                      className="btn btn-ghost btn-block btn-sm rounded-xl mt-4 font-bold text-primary gap-2"
                    >
                      Lihat Semua <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Current Houses */}
          <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-black flex items-center gap-2 mb-6">
                <Home className="text-primary" size={24} />
                Rumah Saat Ini
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.current_houses.map((h) => (
                  <div key={h.house_occupant_id} className="p-6 bg-gradient-to-br from-base-200 to-base-300 rounded-[2rem] border border-base-300 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="badge badge-primary font-bold">Aktif</span>
                        {h.is_head_family && <span className="badge badge-accent font-bold">Kepala Keluarga</span>}
                      </div>
                      <h4 className="text-2xl font-black mb-1">Blok {h.house.house_number}</h4>
                      <p className="text-xs text-base-content/50 font-medium mb-4">{h.house.house_address}</p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-base-content/40 uppercase">
                        <Clock size={12} />
                        Mulai: {new Date(h.start_in_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <Home size={120} className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="space-y-8">
          {/* Recent Payments */}
          <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-black flex items-center gap-2 mb-6">
                <History className="text-secondary" size={20} />
                Riwayat Pembayaran
              </h3>
              
              <div className="space-y-4">
                {data?.payment_history.length === 0 ? (
                  <p className="text-center py-8 text-xs font-bold text-base-content/30 italic">Belum ada riwayat</p>
                ) : (
                  data?.payment_history.slice(0, 5).map((p) => (
                    <div key={p.payment_id} className="flex items-center justify-between gap-3 p-3 hover:bg-base-200 rounded-2xl transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                        <CheckCircle2 size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs truncate">{p.dues_type.dues_type_name}</p>
                        <p className="text-[10px] text-base-content/40 font-bold uppercase">
                          {p.payment_date ? new Date(p.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xs text-success">{formatRupiah(p.payment_amount)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {data?.payment_history && data.payment_history.length > 5 && (
                <button 
                  onClick={() => navigate('/my-dues')}
                  className="btn btn-ghost btn-block btn-sm rounded-xl mt-4 font-bold text-primary gap-2"
                >
                  Lihat Semua <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* House History */}
          <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-black flex items-center gap-2 mb-6">
                <Clock className="text-accent" size={20} />
                Riwayat Hunian
              </h3>
              
              <div className="space-y-4">
                {data?.house_history.length === 0 ? (
                  <p className="text-center py-8 text-xs font-bold text-base-content/30 italic">Tidak ada riwayat hunian</p>
                ) : (
                  data?.house_history.map((h) => (
                    <div key={h.house_occupant_id} className="p-4 bg-base-200/50 rounded-2xl border border-base-300">
                      <p className="font-black text-sm">Blok {h.house.house_number}</p>
                      <p className="text-[10px] font-bold text-base-content/40 mt-1 uppercase">
                        {new Date(h.start_in_date).getFullYear()} — {h.end_in_date ? new Date(h.end_in_date).getFullYear() : 'Sekarang'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Modal */}
      <PayDuesModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPayment(null); }}
        onSubmit={handlePaySubmit}
        submitting={submitting}
        payment={selectedPayment as any}
        errors={formErrors}
      />
    </div>
  );
};
