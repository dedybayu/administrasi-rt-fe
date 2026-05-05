import React from 'react';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  submitting: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  submitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-error text-error-content flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg">{title}</h3>
              <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Konfirmasi Hapus</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm text-error-content">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-base-content/70 font-medium leading-relaxed">
            {message}
          </p>
          <p className="text-xs text-error font-bold mt-4 uppercase tracking-wider">Tindakan ini tidak dapat dibatalkan</p>
        </div>

        <div className="p-6 bg-base-200/50 flex gap-3">
          <button 
            className="btn btn-ghost flex-1 font-bold rounded-2xl" 
            onClick={onClose}
            disabled={submitting}
          >
            Batal
          </button>
          <button 
            className="btn btn-error flex-1 font-black rounded-2xl shadow-lg shadow-error/20 gap-2" 
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Trash2 size={18} />
                Hapus Data
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
