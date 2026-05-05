import React, { useState, useEffect } from 'react';
import { X, Calendar, Receipt, User, Building2, Wallet, CheckCircle2, XCircle, Clock, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import api from '../../../utils/api';

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
  payment_status: 'pending' | 'success' | 'rejected' | string | null;
  payment_proof: string | null;
}

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ isOpen, onClose, payment }) => {
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (payment?.payment_proof && isOpen) {
      setImageLoading(true);
      api.get(`/payment-proof/${payment.payment_proof}`, { responseType: 'blob' })
        .then(res => {
          const url = URL.createObjectURL(res.data);
          setProofUrl(url);
        })
        .catch(() => setProofUrl(null))
        .finally(() => setImageLoading(false));
    } else {
      setProofUrl(null);
    }

    return () => {
      if (proofUrl) URL.revokeObjectURL(proofUrl);
    };
  }, [payment, isOpen]);

  if (!isOpen || !payment) return null;

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const getStatusInfo = (status: string | null) => {
    const s = status?.toLowerCase();
    if (s === 'success' || s === 'paid') return { color: 'text-success', bg: 'bg-success/10', icon: <CheckCircle2 size={16} />, label: 'Berhasil' };
    if (s === 'rejected' || s === 'failed') return { color: 'text-error', bg: 'bg-error/10', icon: <XCircle size={16} />, label: 'Ditolak' };
    return { color: 'text-warning', bg: 'bg-warning/10', icon: <Clock size={16} />, label: 'Menunggu' };
  };

  const status = getStatusInfo(payment.payment_status);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-base-200 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-content shadow-lg shadow-primary/20">
              <Receipt size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl">Detail Pembayaran</h3>
              <p className="text-xs opacity-50 font-bold uppercase tracking-widest mt-1">Invoice #{payment.payment_id}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-4 px-1">Informasi Transaksi</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-base-200/50 border border-base-300/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">Jenis Iuran</p>
                    <p className="font-black text-base-content">{payment.dues_type.dues_type_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-2xl bg-base-200/50 border border-base-300/50">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">Periode</p>
                    <p className="font-black text-base-content">{months[payment.payment_period_month - 1]} {payment.payment_period_year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-2xl bg-base-200/50 border border-base-300/50">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">Rumah</p>
                    <p className="font-black text-base-content">{payment.house_occupant.house.house_name} {payment.house_occupant.house.house_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-2xl bg-base-200/50 border border-base-300/50">
                  <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">Pembayar</p>
                    <p className="font-black text-base-content">{payment.payer_occupant.occupant_name}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="p-5 rounded-3xl bg-base-200 border-2 border-base-300 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-base-content/40">Status</span>
                <div className={`badge badge-md font-black gap-1.5 py-3 ${status.bg} ${status.color} border-none`}>
                  {status.icon}
                  <span className="uppercase text-[10px] tracking-wider">{status.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-base-content/40">Total Bayar</span>
                <p className="text-2xl font-black text-primary">{formatCurrency(payment.payment_amount)}</p>
              </div>
            </section>
          </div>

          <div className="flex flex-col h-full">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-4 px-1">Bukti Pembayaran</h4>
            <div className="flex-1 min-h-[300px] rounded-3xl bg-base-200 border-2 border-dashed border-base-300 flex flex-col items-center justify-center p-4 overflow-hidden relative group">
              {imageLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Memuat Gambar...</p>
                </div>
              ) : proofUrl ? (
                <>
                  <img src={proofUrl} alt="Bukti Pembayaran" className="w-full h-full object-contain rounded-2xl transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm rounded-xl font-bold gap-2">
                      <ExternalLink size={14} />
                      Buka Penuh
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-base-content/20">
                  <ImageIcon size={64} strokeWidth={1} />
                  <p className="text-sm font-bold uppercase tracking-widest text-center">Tidak Ada Bukti<br/>Pembayaran</p>
                </div>
              )}
            </div>
            {payment.payment_date && (
              <p className="text-[10px] text-center mt-4 font-bold text-base-content/30 uppercase tracking-widest">
                Dibayar pada {new Date(payment.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-base-300 flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost font-bold px-8 rounded-2xl">Tutup</button>
          {payment.payment_status === 'pending' && (
            <div className="flex gap-2">
              <button className="btn btn-error btn-sm rounded-xl font-bold">Tolak</button>
              <button className="btn btn-success btn-sm rounded-xl font-bold">Setujui</button>
            </div>
          )}
        </div>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
