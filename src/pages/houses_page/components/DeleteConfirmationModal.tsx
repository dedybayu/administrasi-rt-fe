import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  title: string;
  message: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  submitting,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-sm bg-base-100 border border-base-300 shadow-2xl rounded-3xl p-6 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="font-black text-xl mb-2">{title}</h3>
        <p className="text-sm text-base-content/60 font-medium mb-8">
          {message}
        </p>
        <div className="flex gap-3">
          <button 
            className="btn btn-ghost flex-1 font-bold rounded-2xl" 
            onClick={onClose}
            disabled={submitting}
          >
            Batal
          </button>
          <button 
            className="btn btn-error flex-1 font-black rounded-2xl shadow-lg shadow-error/20" 
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : "Ya, Hapus"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
