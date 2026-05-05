import { useCallback, useEffect, useState } from 'react';
import api from '../../utils/api';
import { 
  TrendingDown, 
  Search, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Calendar,
  FileText,
  DollarSign,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { ExpenseModal } from './components/ExpenseModal';
import { DeleteConfirmationModal } from '../occupants_page/components/DeleteConfirmationModal';

interface Expense {
  expense_id: number;
  expense_description: string;
  expense_amount: string;
  expense_date: string;
}

const ITEMS_PER_PAGE = 10;

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.data ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data pengeluaran.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    setFormErrors({});
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.expense_id}`, data);
      } else {
        await api.post('/expenses', data);
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data) {
        setFormErrors(err.response.data.errors || err.response.data);
      } else {
        setError(err.response?.data?.message || 'Gagal menyimpan data pengeluaran.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingExpenseId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingExpenseId) return;
    setSubmitting(true);
    try {
      await api.delete(`/expenses/${deletingExpenseId}`);
      setIsDeleteModalOpen(false);
      fetchExpenses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus data pengeluaran.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (e: Expense) => {
    setEditingExpense(e);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const filtered = expenses.filter((e) =>
    e.expense_description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalAmount = filtered.reduce((acc, curr) => acc + parseFloat(curr.expense_amount), 0);

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  return (
    <div className="p-6 lg:p-8 max-w-xxl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-base-content">Pengeluaran Kas</h1>
          <p className="text-base-content/50 text-sm mt-1 font-medium">
            Catat dan pantau seluruh pengeluaran dana RT
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchExpenses}
            className="btn btn-ghost btn-sm gap-2 font-bold"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => { setEditingExpense(null); setFormErrors({}); setIsModalOpen(true); }}
            className="btn btn-primary btn-sm gap-2 font-black shadow-lg shadow-primary/20"
            disabled={loading}
          >
            <Plus size={18} />
            Catat Pengeluaran
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-error/10 border border-error/20 text-error shadow-sm col-span-1 md:col-span-1">
          <div className="card-body p-6 flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-error text-error-content flex items-center justify-center shadow-lg shadow-error/20">
              <TrendingDown size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Pengeluaran</p>
              <p className="text-3xl font-black">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 shadow-sm col-span-1 md:col-span-2">
          <div className="card-body p-4 flex flex-row gap-4 items-center h-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
              <input
                type="text"
                placeholder="Cari deskripsi pengeluaran..."
                className="input input-bordered w-full pl-12 bg-base-200/50 border-none focus:bg-base-100 transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div role="alert" className="alert alert-error mb-6 shadow-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchExpenses} className="btn btn-sm btn-ghost font-bold">Ulangi</button>
        </div>
      )}

      {/* Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50 text-base-content/50 uppercase text-[10px] font-black tracking-widest">
                <th className="py-4">Keterangan</th>
                <th className="py-4">Tanggal</th>
                <th className="py-4">Jumlah</th>
                <th className="py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="p-4">
                      <div className="skeleton h-12 w-full rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-base-content/30">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={48} className="opacity-10" />
                      <p className="font-bold">Belum ada data pengeluaran</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((e) => (
                  <tr key={e.expense_id} className="hover:bg-base-200/30 transition-colors">
                    <td className="max-w-md">
                      <p className="font-bold text-base-content line-clamp-2">{e.expense_description}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-base-content/60 font-bold">
                        <Calendar size={14} className="text-primary" />
                        {new Date(e.expense_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      <p className="font-black text-error">{formatCurrency(e.expense_amount)}</p>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center gap-1">
                        <button 
                          onClick={() => handleEdit(e)}
                          className="btn btn-ghost btn-square btn-sm text-info hover:bg-info/10"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(e.expense_id)}
                          className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                        >
                          <Trash2 size={16} />
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
        <div className="flex justify-center items-center gap-3 mt-8">
          <button 
            className="btn btn-sm btn-ghost font-bold" 
            onClick={() => setPage((p) => Math.max(1, p - 1))} 
            disabled={page === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-black px-4 py-2 bg-base-200 rounded-xl">
            {page} / {totalPages}
          </span>
          <button 
            className="btn btn-sm btn-ghost font-bold" 
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modals */}
      <ExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        editingExpense={editingExpense}
        errors={formErrors}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        submitting={submitting}
        title="Hapus Pengeluaran"
        message={`Apakah Anda yakin ingin menghapus catatan pengeluaran "${expenses.find(e => e.expense_id === deletingExpenseId)?.expense_description}"?`}
      />
    </div>
  );
}
