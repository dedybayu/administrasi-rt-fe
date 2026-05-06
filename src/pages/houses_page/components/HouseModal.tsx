import React from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { House } from '../types';

interface HouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  currentHouse: House | null;
  formData: {
    house_name: string;
    house_number: string;
  };
  setFormData: (data: any) => void;
}

export const HouseModal: React.FC<HouseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  currentHouse,
  formData,
  setFormData
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-primary text-primary-content flex items-center justify-between">
          <div>
            <h3 className="font-black text-xl">{currentHouse ? 'Edit Rumah' : 'Tambah Rumah Baru'}</h3>
            <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">Formulir Data Rumah</p>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Nama Pemilik / Blok</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Bpk. Slamet / Blok A"
              className="input input-bordered w-full font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
              value={formData.house_name}
              onChange={(e) => setFormData({ ...formData, house_name: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Nomor Rumah</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: 01"
              className="input input-bordered w-full font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
              value={formData.house_number}
              onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
              required
            />
          </div>

          <div className="modal-action mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost font-bold rounded-2xl px-6"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary font-black rounded-2xl px-8 shadow-lg shadow-primary/20"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Simpan Data
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
