import { useCallback, useEffect, useState } from 'react';
import api from '../../utils/api';
import { User, Phone, IdCard, Heart, HeartOff, RefreshCw, Search, ChevronLeft, ChevronRight, Users, AlertCircle, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { OccupantModal } from './components/OccupantModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { OccupantDetailModal } from './components/OccupantDetailModal';

interface Occupant {
  occupant_id: number;
  occupant_name: string;
  occupant_status: string;
  occupant_phone_number: string;
  is_married: boolean;
  occupant_ktp_photo: string | null;
  occupant_ktp_url: string | null;
  occupant_gender: 'L' | 'P' | null;
}

const ITEMS_PER_PAGE = 9;

const avatarColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-info'];
const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];
const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const statusBadge = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('tetap') || s.includes('permanent')) return 'badge-primary';
  if (s.includes('kontrak') || s.includes('sewa') || s.includes('rent')) return 'badge-warning';
  if (s.includes('sementar') || s.includes('temp')) return 'badge-info';
  return 'badge-ghost';
};

export default function Occupants() {
  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterMarried, setFilterMarried] = useState<'all' | 'married' | 'single'>('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingOccupant, setEditingOccupant] = useState<Occupant | null>(null);
  const [deletingOccupantId, setDeletingOccupantId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOccupantDetail, setSelectedOccupantDetail] = useState<Occupant | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);

  const fetchOccupants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/occupants');
      setOccupants(res.data.data ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data warga.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setFormErrors({});
    try {
      if (editingOccupant) {
        await api.post(`/occupants/${editingOccupant.occupant_id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/occupants', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      setEditingOccupant(null);
      setFormErrors({});
      fetchOccupants();
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data) {
        setFormErrors(err.response.data.errors || err.response.data);
      } else {
        setError(err.response?.data?.message || 'Gagal menyimpan data warga.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingOccupantId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingOccupantId) return;
    setSubmitting(true);
    try {
      await api.delete(`/occupants/${deletingOccupantId}`);
      setIsDeleteModalOpen(false);
      setDeletingOccupantId(null);
      fetchOccupants();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus data warga.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (o: Occupant) => {
    setEditingOccupant(o);
    setIsModalOpen(true);
  };

  const handleShowDetail = async (id: number) => {
    setLoadingDetailId(id);
    try {
      const res = await api.get(`/occupants/${id}`);
      setSelectedOccupantDetail(res.data.data);
      setIsDetailModalOpen(true);
    } catch (err: any) {
      setError('Gagal memuat detail warga.');
    } finally {
      setLoadingDetailId(null);
    }
  };

  useEffect(() => { fetchOccupants(); }, [fetchOccupants]);
  useEffect(() => { setPage(1); }, [search, filterMarried, filterStatus]);

  const uniqueStatuses = Array.from(new Set(occupants.map((o) => o.occupant_status)));

  const filtered = occupants.filter((o) => {
    const matchSearch =
      o.occupant_name.toLowerCase().includes(search.toLowerCase()) ||
      o.occupant_phone_number.includes(search);
    const matchMarried = filterMarried === 'all' ? true : filterMarried === 'married' ? o.is_married : !o.is_married;
    const matchStatus = filterStatus === 'all' || o.occupant_status === filterStatus;
    return matchSearch && matchMarried && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-6 lg:p-8 max-w-xxl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Warga</h1>
          <p className="text-base-content/50 text-sm mt-1">
            {loading ? 'Memuat data...' : `${filtered.length} dari ${occupants.length} warga`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchOccupants}
            className="btn btn-ghost btn-sm gap-2 font-bold"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => { setEditingOccupant(null); setFormErrors({}); setIsModalOpen(true); }}
            className="btn btn-primary btn-sm gap-2 font-black shadow-lg shadow-primary/20"
            disabled={loading}
          >
            <Plus size={18} />
            Tambah Warga
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-6">
        <div className="card-body p-4 flex flex-col lg:flex-row gap-3">
          <label className="input input-bordered flex items-center gap-2 flex-1">
            <Search size={16} className="text-base-content/40" />
            <input
              id="search-occupant"
              type="text"
              placeholder="Cari nama atau nomor HP..."
              className="grow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            className="select select-bordered"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="join border border-base-300">
            {(['all', 'married', 'single'] as const).map((v) => (
              <button
                key={v}
                className={`join-item btn btn-sm ${filterMarried === v ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilterMarried(v)}
              >
                {v === 'all' ? 'Semua' : v === 'married' ? 'Menikah' : 'Lajang'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div role="alert" className="alert alert-error mb-6">
          <AlertCircle size={18} />
          <span className="flex-1">{error}</span>
          <button onClick={fetchOccupants} className="btn btn-sm btn-ghost">Coba Lagi</button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-14 h-14 rounded-2xl shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="skeleton h-4 w-32" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                </div>
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center">
            <Users size={40} className="text-base-content/20" />
          </div>
          <div>
            <p className="font-bold text-base-content/70 text-xl">Tidak ada warga ditemukan</p>
            <p className="text-sm text-base-content/40 mt-1">Coba ubah kata kunci atau filter pencarian.</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setFilterStatus('all'); setFilterMarried('all'); }}>
            Reset Filter
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && paginated.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((o) => (
            <div key={o.occupant_id} className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
              <div className="card-body p-5">
                {/* Header */}
                <div 
                  className="flex items-start gap-3 mb-3 cursor-pointer group/header"
                  onClick={() => handleShowDetail(o.occupant_id)}
                >
                  <div className={`w-14 h-14 rounded-2xl ${getAvatarColor(o.occupant_id)} text-white text-lg font-bold flex items-center justify-center shrink-0 shadow-sm border border-white/10 group-hover/header:scale-105 transition-transform`}>
                    {getInitials(o.occupant_name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate text-base group-hover/header:text-primary transition-colors" title={o.occupant_name}>{o.occupant_name}</p>
                    <span className={`badge badge-sm mt-1 font-semibold ${statusBadge(o.occupant_status)}`}>{o.occupant_status}</span>
                  </div>
                  <div className="shrink-0">
                    {o.is_married ? (
                      <Heart size={18} className="text-rose-500 fill-rose-500" />
                    ) : (
                      <HeartOff size={18} className="text-base-content/20" />
                    )}
                  </div>
                </div>

                <div className="divider my-0 opacity-40" />

                {/* Info */}
                <div className="flex flex-col gap-2.5 mt-3">
                  <div className="flex items-center gap-2.5 text-sm text-base-content/70">
                    <Phone size={14} className="text-primary" />
                    <span>{o.occupant_phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-base-content/70">
                    <User size={14} className="text-primary" />
                    <span>{o.is_married ? 'Sudah Menikah' : 'Belum Menikah'}</span>
                  </div>
                  {o.occupant_ktp_url && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <IdCard size={14} className="text-primary" />
                      <a href={o.occupant_ktp_url} target="_blank" rel="noopener noreferrer" className="link link-primary font-medium">
                        Lihat Foto KTP
                      </a>
                    </div>
                  )}
                </div>

                <div className="card-actions justify-between items-center mt-6">
                  <span className="text-[10px] text-base-content/30 font-mono tracking-wider">ID-{String(o.occupant_id).padStart(4, '0')}</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleShowDetail(o.occupant_id)}
                      className="btn btn-ghost btn-square btn-xs text-primary hover:bg-primary/10 transition-colors"
                      title="Lihat Detail"
                      disabled={loadingDetailId === o.occupant_id}
                    >
                      {loadingDetailId === o.occupant_id ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                    <button 
                      onClick={() => { handleEdit(o); setFormErrors({}); }}
                      className="btn btn-ghost btn-square btn-xs text-info hover:bg-info/10 transition-colors"
                      title="Edit Warga"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(o.occupant_id)}
                      className="btn btn-ghost btn-square btn-xs text-error hover:bg-error/10 transition-colors"
                      title="Hapus Warga"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <OccupantModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        editingOccupant={editingOccupant}
        errors={formErrors}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        submitting={submitting}
        title="Hapus Data Warga"
        message={`Apakah Anda yakin ingin menghapus data warga "${occupants.find(o => o.occupant_id === deletingOccupantId)?.occupant_name}"? Data yang sudah dihapus tidak dapat dikembalikan.`}
      />

      <OccupantDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        occupant={selectedOccupantDetail}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          <button className="btn btn-sm btn-outline btn-square" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={18} />
          </button>
          <div className="join">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`join-item btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setPage(i + 1)}
              >{i + 1}</button>
            ))}
          </div>
          <button className="btn btn-sm btn-outline btn-square" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
