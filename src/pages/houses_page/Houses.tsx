import { useCallback, useEffect, useState } from 'react';
import api from '../../utils/api';
import { 
  Home, 
  Search, 
  RefreshCw, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Hash,
  Activity,
  UserPlus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Eye,
  Phone,
  UserCheck,
  History
} from 'lucide-react';

interface Occupant {
  occupant_id: number;
  occupant_name: string;
  occupant_status: string;
  occupant_phone_number?: string;
}

interface HouseOccupant {
  house_occupant_id: number;
  is_current: boolean;
  start_in_date?: string;
  end_in_date?: string;
  occupant: Occupant;
}

interface House {
  house_id: number;
  house_name: string;
  house_number: string;
  house_occupants_count?: number;
  house_occupants?: HouseOccupant[];
  created_at: string;
  updated_at: string;
}

const ITEMS_PER_PAGE = 16;

export default function Houses() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [allOccupants, setAllOccupants] = useState<Occupant[]>([]);
  const [currentHouse, setCurrentHouse] = useState<House | null>(null);
  const [addOccupantData, setAddOccupantData] = useState({
    occupant_id: '',
    start_in_date: new Date().toISOString().split('T')[0],
    is_current: true
  });
  const [formData, setFormData] = useState({
    house_name: '',
    house_number: ''
  });

  const fetchHouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/houses');
      setHouses(res.data.data ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data rumah.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllOccupants = useCallback(async () => {
    try {
      const res = await api.get('/occupants');
      setAllOccupants(res.data.data ?? res.data);
    } catch (err) {
      console.error('Failed to fetch occupants:', err);
    }
  }, []);

  useEffect(() => {
    fetchHouses();
    fetchAllOccupants();
  }, [fetchHouses, fetchAllOccupants]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = houses.filter((h) => {
    const matchSearch =
      h.house_name.toLowerCase().includes(search.toLowerCase()) ||
      h.house_number.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalOccupants = houses.reduce((acc, curr) => acc + (curr.house_occupants_count || 0), 0);

  // Handlers
  const handleOpenModal = (house: House | null = null) => {
    setCurrentHouse(house);
    if (house) {
      setFormData({
        house_name: house.house_name,
        house_number: house.house_number
      });
    } else {
      setFormData({ house_name: '', house_number: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentHouse(null);
    setFormData({ house_name: '', house_number: '' });
  };

  const handleOpenDetail = async (house: House) => {
    setDetailLoading(true);
    setCurrentHouse(house);
    setIsDetailModalOpen(true);
    try {
      const res = await api.get(`/houses/${house.house_id}`);
      setCurrentHouse(res.data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setCurrentHouse(null);
    setShowAddForm(false);
  };

  const handleAddOccupant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHouse || !addOccupantData.occupant_id) return;
    
    setSubmitting(true);
    try {
      await api.post('/house-occupants', {
        house_id: currentHouse.house_id,
        ...addOccupantData
      });
      // Refresh detail
      handleOpenDetail(currentHouse);
      setShowAddForm(false);
      setAddOccupantData({
        occupant_id: '',
        start_in_date: new Date().toISOString().split('T')[0],
        is_current: true
      });
      fetchHouses(); // Refresh stats
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan penghuni.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOccupant = async (houseOccupantId: number) => {
    if (!currentHouse || !confirm('Hapus penghuni ini dari rumah?')) return;
    
    try {
      await api.delete(`/house-occupants/${houseOccupantId}`);
      handleOpenDetail(currentHouse);
      fetchHouses(); // Refresh stats
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus penghuni.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentHouse) {
        await api.put(`/houses/${currentHouse.house_id}`, formData);
      } else {
        await api.post('/houses', formData);
      }
      handleCloseModal();
      fetchHouses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (house: House) => {
    setCurrentHouse(house);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentHouse(null);
  };

  const handleDelete = async () => {
    if (!currentHouse) return;
    setSubmitting(true);
    try {
      await api.delete(`/houses/${currentHouse.house_id}`);
      closeDeleteModal();
      fetchHouses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus data.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-xxl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-base-content">Daftar Rumah</h1>
            <p className="text-base-content/50 text-sm mt-1 font-medium">
              Kelola data properti dan hunian dalam wilayah RT
            </p>
          </div>
          <button
            onClick={fetchHouses}
            className="btn btn-ghost btn-sm gap-2 normal-case font-bold"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Muat Ulang
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card bg-primary text-primary-content shadow-lg shadow-primary/20 border-none">
            <div className="card-body p-5 flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Home size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Total Rumah</p>
                <p className="text-2xl font-black">{houses.length}</p>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-5 flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">Total Penghuni</p>
                <p className="text-2xl font-black text-secondary">{totalOccupants}</p>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-5 flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">Rata-rata Hunian</p>
                <p className="text-2xl font-black text-accent">
                  {houses.length > 0 ? (totalOccupants / houses.length).toFixed(1) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-6 overflow-hidden">
        <div className="card-body p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama pemilik atau nomor rumah..."
                className="input input-bordered w-full pl-12 bg-base-200/50 border-none focus:bg-base-100 transition-all font-medium text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => handleOpenModal()}
                className="btn btn-primary btn-sm gap-2 flex-1 md:flex-none font-bold px-6"
              >
                <UserPlus size={18} />
                Tambah Rumah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div role="alert" className="alert alert-error mb-6 shadow-sm border-none">
          <AlertCircle size={20} />
          <div className="flex-1">
            <h3 className="font-bold">Terjadi Kesalahan</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
          <button onClick={fetchHouses} className="btn btn-sm btn-ghost font-bold">Coba Lagi</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-5 gap-4">
                <div className="flex justify-between items-start">
                  <div className="skeleton w-12 h-12 rounded-2xl" />
                  <div className="skeleton w-16 h-6 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
                <div className="pt-4 border-t border-base-200 flex justify-between">
                  <div className="skeleton h-4 w-20" />
                  <div className="skeleton h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center bg-base-100 rounded-3xl border border-dashed border-base-300">
          <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center">
            <Home size={48} className="text-base-content/20" />
          </div>
          <div className="max-w-xs">
            <p className="font-black text-xl text-base-content/70">Data Tidak Ditemukan</p>
            <p className="text-sm text-base-content/40 mt-2 font-medium">
              Kami tidak menemukan rumah dengan kata kunci "{search}". Coba gunakan kata kunci lain.
            </p>
          </div>
          <button 
            className="btn btn-outline btn-sm font-bold px-8" 
            onClick={() => setSearch('')}
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && paginated.length > 0 && (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginated.map((h, index) => (
            <div 
              key={h.house_id} 
              className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="card-body p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-colors shadow-inner">
                    <Home size={24} />
                  </div>
                  <div className="badge badge-lg bg-base-200 border-none font-black text-base-content/70">
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">
                    {h.house_name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-base-content/50">
                    <span className="text-xs font-bold uppercase tracking-tight">No. Rumah: {h.house_number}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-base-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-base-content/60">
                    <Users size={16} className="text-secondary" />
                    <span className="text-sm font-bold">{h.house_occupants_count || 0} Penghuni</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenDetail(h)}
                      className="btn btn-ghost btn-square btn-xs text-primary hover:bg-primary/10 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Detail Rumah"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={() => handleOpenModal(h)}
                      className="btn btn-ghost btn-square btn-xs text-info hover:bg-info/10 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(h)}
                      className="btn btn-ghost btn-square btn-xs text-error hover:bg-error/10 sm:opacity-0 group-hover:opacity-100 transition-opacity"
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-base-300">
          <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">
            Halaman {page} dari {totalPages} — {filtered.length} rumah
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-primary text-primary-content flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl">{currentHouse ? 'Edit Rumah' : 'Tambah Rumah Baru'}</h3>
                <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">Formulir Data Rumah</p>
              </div>
              <button onClick={handleCloseModal} className="btn btn-circle btn-ghost btn-sm">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                  onClick={handleCloseModal} 
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
          <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm p-6 bg-base-100 border border-base-300 shadow-2xl rounded-3xl text-center">
            <div className="w-20 h-20 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
              <Trash2 size={40} />
            </div>
            <h3 className="font-black text-xl text-base-content">Hapus Data Rumah?</h3>
            <p className="py-4 text-sm text-base-content/50 font-medium">
              Anda akan menghapus data <span className="font-bold text-base-content">{currentHouse?.house_name} #{currentHouse?.house_number}</span>. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 mt-4">
              <button 
                onClick={closeDeleteModal} 
                className="btn btn-ghost flex-1 font-bold rounded-2xl"
                disabled={submitting}
              >
                Batal
              </button>
              <button 
                onClick={handleDelete} 
                className="btn btn-error flex-1 font-black rounded-2xl text-white shadow-lg shadow-error/20"
                disabled={submitting}
              >
                {submitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Ya, Hapus"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={closeDeleteModal}></div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-primary text-primary-content">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Home size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl leading-tight">{currentHouse?.house_name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70">Detail Rumah</p>
                  </div>
                </div>
                <button onClick={handleCloseDetail} className="btn btn-circle btn-ghost btn-sm">
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-2">
                <div className="badge badge-outline border-white/30 text-white font-bold">
                  No. {currentHouse?.house_number}
                </div>
                <div className="badge badge-outline border-white/30 text-white font-bold">
                  {currentHouse?.house_occupants?.length || 0} Penghuni
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-base-content/50">
                  <Users size={18} />
                  <h4 className="font-black text-sm uppercase tracking-widest">Daftar Penghuni</h4>
                </div>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`btn btn-xs gap-1 font-bold rounded-lg ${showAddForm ? 'btn-ghost text-error' : 'btn-primary'}`}
                >
                  {showAddForm ? <X size={14} /> : <UserPlus size={14} />}
                  {showAddForm ? 'Batal' : 'Tambah'}
                </button>
              </div>

              {showAddForm && (
                <form 
                  onSubmit={handleAddOccupant}
                  className="mb-6 p-4 rounded-2xl bg-secondary/5 border border-secondary/20 space-y-4 animate-in slide-in-from-top-2 duration-200"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control col-span-2 sm:col-span-1">
                      <label className="label py-1">
                        <span className="label-text font-black text-[10px] uppercase tracking-wider opacity-50">Pilih Penghuni</span>
                      </label>
                      <select 
                        className="select select-bordered select-sm w-full font-bold bg-base-100 border-base-300"
                        value={addOccupantData.occupant_id}
                        onChange={(e) => setAddOccupantData({ ...addOccupantData, occupant_id: e.target.value })}
                        required
                      >
                        <option value="">-- Nama --</option>
                        {allOccupants.map((o) => (
                          <option key={o.occupant_id} value={o.occupant_id}>{o.occupant_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control col-span-2 sm:col-span-1">
                      <label className="label py-1">
                        <span className="label-text font-black text-[10px] uppercase tracking-wider opacity-50">Tgl Mulai</span>
                      </label>
                      <input 
                        type="date" 
                        className="input input-bordered input-sm w-full font-bold bg-base-100 border-base-300"
                        value={addOccupantData.start_in_date}
                        onChange={(e) => setAddOccupantData({ ...addOccupantData, start_in_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="label cursor-pointer justify-start gap-2 py-0">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-secondary checkbox-sm rounded-md"
                        checked={addOccupantData.is_current}
                        onChange={(e) => setAddOccupantData({ ...addOccupantData, is_current: e.target.checked })}
                      />
                      <span className="label-text font-bold text-[10px] uppercase tracking-wider opacity-50">Penghuni Aktif</span>
                    </label>
                    <button 
                      type="submit" 
                      className="btn btn-secondary btn-sm font-black px-6 shadow-lg shadow-secondary/20"
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 size={14} className="animate-spin" /> : "Simpan"}
                    </button>
                  </div>
                </form>
              )}

              {detailLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Memuat Data...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {currentHouse?.house_occupants && currentHouse.house_occupants.length > 0 ? (
                    currentHouse.house_occupants.map((ho) => (
                      <div key={ho.house_occupant_id} className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between group hover:bg-base-200 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ho.is_current ? 'bg-success/10 text-success' : 'bg-base-content/10 text-base-content/50'}`}>
                            {ho.is_current ? <UserCheck size={20} /> : <History size={20} />}
                          </div>
                          <div>
                            <p className="font-black text-base-content leading-tight">{ho.occupant.occupant_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`badge badge-xs font-bold uppercase ${ho.is_current ? 'badge-success' : 'badge-ghost opacity-50'}`}>
                                {ho.is_current ? 'Aktif' : 'Riwayat'}
                              </span>
                              <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">{ho.occupant.occupant_status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {ho.occupant.occupant_phone_number && (
                            <a 
                              href={`tel:${ho.occupant.occupant_phone_number}`}
                              className="btn btn-circle btn-ghost btn-sm text-primary"
                            >
                              <Phone size={16} />
                            </a>
                          )}
                          <button 
                            onClick={() => handleDeleteOccupant(ho.house_occupant_id)}
                            className="btn btn-circle btn-ghost btn-sm text-error opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-base-200/30 rounded-3xl border border-dashed border-base-300">
                      <Users size={32} className="text-base-content/10 mb-2" />
                      <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">Belum Ada Penghuni</p>
                    </div>
                  )}
                </div>
              )}

              <div className="modal-action mt-8">
                <button 
                  onClick={handleCloseDetail} 
                  className="btn btn-primary w-full font-black rounded-2xl shadow-lg shadow-primary/20"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={handleCloseDetail}></div>
        </div>
      )}
    </div>
  );
}
