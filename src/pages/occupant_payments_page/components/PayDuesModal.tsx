import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, ImageIcon, AlertCircle, Loader2, Save, Calendar } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';

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
  payment_period_month: number;
  payment_period_year: number;
}

interface PayDuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  submitting: boolean;
  payment: Payment | null;
  errors: Record<string, string[]>;
}

export const PayDuesModal: React.FC<PayDuesModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  payment,
  errors
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !payment) return;

    const formData = new FormData();
    formData.append('dues_type_id', payment.dues_type.dues_type_id.toString());
    formData.append('house_occupant_id', payment.house_occupant.house_occupant_id.toString());
    formData.append('payment_period_month', payment.payment_period_month.toString());
    formData.append('payment_period_year', payment.payment_period_year.toString());
    formData.append('payment_proof', selectedFile);

    onSubmit(formData);
  };

  if (!isOpen || !payment) return null;

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-primary text-primary-content">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-xl">Bayar Iuran</h3>
              <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">Upload Bukti Pembayaran</p>
            </div>
            <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm text-primary-content">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          {/* General Errors */}
          {hasErrors && !errors.payment_proof && (
             <div className="alert alert-error bg-error/10 border-error/20 text-error rounded-2xl py-3 text-xs font-bold uppercase tracking-wider">
               <AlertCircle size={16} />
               {Object.values(errors).flat()[0]}
             </div>
          )}

          {/* Bill Info */}
          <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Jenis Iuran</span>
              <span className="text-sm font-black text-base-content">{payment.dues_type.dues_type_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Periode</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-base-content">
                <Calendar size={14} className="text-primary" />
                {months[payment.payment_period_month - 1]} {payment.payment_period_year}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40">Total Bayar</span>
              <span className="text-lg font-black text-primary">{formatRupiah(parseFloat(payment.dues_type.dues_type_amount))}</span>
            </div>
          </div>

          {/* Upload Area */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Bukti Pembayaran (Wajib)</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-3xl overflow-hidden transition-all flex flex-col items-center justify-center p-4 min-h-[200px] ${errors.payment_proof ? 'border-error/50 bg-error/5' : previewUrl ? 'border-primary/30 bg-primary/5' : 'border-base-300 bg-base-200/30 hover:bg-base-200/50 cursor-pointer'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full h-[200px]">
                  <img src={previewUrl} alt="Preview Bukti" className="w-full h-full object-contain rounded-2xl" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <p className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <Upload size={16} /> Ganti Foto
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${errors.payment_proof ? 'bg-error/20 text-error' : 'bg-base-200 text-base-content/20'}`}>
                    <ImageIcon size={24} />
                  </div>
                  <p className={`font-bold text-sm text-center px-4 ${errors.payment_proof ? 'text-error' : 'text-base-content/60'}`}>Klik untuk upload foto bukti transfer</p>
                  <p className="text-[10px] text-base-content/40 mt-1 uppercase font-black tracking-widest">JPG, PNG max 2MB</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            {errors.payment_proof && (
              <label className="label">
                <span className="label-text-alt text-error font-bold uppercase tracking-widest text-[9px]">{errors.payment_proof[0]}</span>
              </label>
            )}
          </div>

          {!hasErrors && (
            <div className="alert alert-info bg-info/10 border-info/20 text-info rounded-2xl p-4">
              <AlertCircle size={18} />
              <span className="text-[10px] font-bold uppercase leading-tight">Pastikan nominal transfer sesuai dengan total bayar di atas.</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn flex-1 rounded-2xl font-bold bg-base-200 border-none"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-[2] rounded-2xl font-black shadow-lg shadow-primary/20 gap-2"
              disabled={submitting || (!selectedFile && !previewUrl)}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Konfirmasi Pembayaran
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
