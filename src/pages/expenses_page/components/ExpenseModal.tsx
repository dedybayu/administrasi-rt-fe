import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, FileText, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface Expense {
  expense_id: number;
  expense_description: string;
  expense_amount: string;
  expense_date: string;
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  submitting: boolean;
  editingExpense: Expense | null;
  errors: Record<string, string[]>;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  editingExpense,
  errors
}) => {
  const [formData, setFormData] = useState({
    expense_description: '',
    expense_amount: '',
    expense_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        expense_description: editingExpense.expense_description,
        expense_amount: editingExpense.expense_amount,
        expense_date: editingExpense.expense_date.split('T')[0].split(' ')[0],
      });
    } else {
      setFormData({
        expense_description: '',
        expense_amount: '',
        expense_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingExpense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const ErrorMessage = ({ name }: { name: string }) => {
    const error = errors[name];
    if (!error) return null;
    return (
      <div className="text-error text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
        <AlertCircle size={10} />
        {error[0]}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-primary text-primary-content flex items-center justify-between">
          <div>
            <h3 className="font-black text-xl">{editingExpense ? 'Edit Pengeluaran' : 'Catat Pengeluaran'}</h3>
            <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">Formulir Kas Keluar</p>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm text-primary-content">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Keterangan Pengeluaran</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-base-content/30" size={18} />
              <textarea 
                placeholder="Contoh: Pembayaran Listrik Pos Ronda" 
                className="textarea textarea-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all min-h-[100px]"
                value={formData.expense_description}
                onChange={(e) => setFormData({ ...formData, expense_description: e.target.value })}
                required
              />
            </div>
            <ErrorMessage name="expense_description" />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Jumlah (IDR)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
              <input 
                type="number" 
                placeholder="0" 
                className="input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                value={formData.expense_amount}
                onChange={(e) => setFormData({ ...formData, expense_amount: e.target.value })}
                required
              />
            </div>
            <ErrorMessage name="expense_amount" />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Tanggal</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
              <input 
                type="date" 
                className="input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                required
              />
            </div>
            <ErrorMessage name="expense_date" />
          </div>

          <div className="modal-action mt-8 pt-4">
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
              className="btn btn-primary font-black rounded-2xl px-8 shadow-lg shadow-primary/20 gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  {editingExpense ? 'Simpan' : 'Catat'}
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
