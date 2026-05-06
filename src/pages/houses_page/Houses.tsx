import { useCallback, useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Home
} from 'lucide-react';

import type { House, Occupant, HouseOccupant } from './types';
import { HouseStats } from './components/HouseStats';
import { HouseToolbar } from './components/HouseToolbar';
import { HouseCard } from './components/HouseCard';
import { HouseModal } from './components/HouseModal';
import { HouseDetailModal } from './components/HouseDetailModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';

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
  const [editingHouseOccupantId, setEditingHouseOccupantId] = useState<number | null>(null);
  const [addOccupantData, setAddOccupantData] = useState({
    occupant_id: '',
    start_in_date: new Date().toISOString().split('T')[0],
    end_in_date: '',
    is_current: true,
    is_head_family: false
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
      const fetchedData = res.data.data ?? res.data;
      if (Array.isArray(fetchedData)) {
        setAllOccupants(fetchedData);
      } else {
        console.error('Occupants API returned non-array data:', fetchedData);
        setAllOccupants([]);
      }
    } catch (err) {
      console.error('Failed to fetch occupants:', err);
      setAllOccupants([]);
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
    setEditingHouseOccupantId(null);
    setAddOccupantData({
      occupant_id: '',
      start_in_date: new Date().toISOString().split('T')[0],
      end_in_date: '',
      is_current: true,
      is_head_family: false
    });
  };

  const handlePrepEditOccupant = (ho: HouseOccupant) => {
    setAddOccupantData({
      occupant_id: String(ho.occupant.occupant_id),
      start_in_date: ho.start_in_date ? ho.start_in_date.split('T')[0] : '',
      end_in_date: ho.end_in_date ? ho.end_in_date.split('T')[0] : '',
      is_current: ho.is_current,
      is_head_family: ho.is_head_family
    });
    setEditingHouseOccupantId(ho.house_occupant_id);
    setShowAddForm(true);
  };

  const handleAddOccupant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHouse || !addOccupantData.occupant_id) return;

    setSubmitting(true);
    try {
      if (editingHouseOccupantId) {
        await api.put(`/house-occupants/${editingHouseOccupantId}`, {
          house_id: currentHouse.house_id,
          ...addOccupantData
        });
      } else {
        await api.post('/house-occupants', {
          house_id: currentHouse.house_id,
          ...addOccupantData
        });
      }
      handleOpenDetail(currentHouse);
      setShowAddForm(false);
      setEditingHouseOccupantId(null);
      setAddOccupantData({
        occupant_id: '',
        start_in_date: new Date().toISOString().split('T')[0],
        end_in_date: '',
        is_current: true,
        is_head_family: false
      });
      fetchHouses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan data penghuni.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOccupant = async (id: number) => {
    if (!window.confirm('Hapus penghuni ini?')) return;
    try {
      await api.delete(`/house-occupants/${id}`);
      if (currentHouse) handleOpenDetail(currentHouse);
      fetchHouses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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
      alert(err.response?.data?.message || 'Gagal menyimpan data rumah.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentHouse) return;
    setSubmitting(true);
    try {
      await api.delete(`/houses/${currentHouse.house_id}`);
      setIsDeleteModalOpen(false);
      setCurrentHouse(null);
      fetchHouses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus rumah.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-xxl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-base-content">Manajemen Data Rumah</h2>
          <p className="text-base-content/50 font-bold uppercase tracking-widest text-[10px] mt-1">Kelola informasi properti dan penghuni RT</p>
        </div>
        <button
          onClick={fetchHouses}
          className="btn btn-circle btn-ghost btn-sm text-primary"
          disabled={loading}
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <HouseStats houses={houses} totalOccupants={totalOccupants} />
      <HouseToolbar search={search} setSearch={setSearch} onAddHouse={() => handleOpenModal()} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-base-100 rounded-3xl border border-base-300 shadow-inner">
          <Loader2 size={48} className="animate-spin text-primary" />
          <p className="font-black text-xs uppercase tracking-[0.2em] text-base-content/30">Menyinkronkan Data Properti...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error shadow-xl rounded-2xl border-none text-white font-bold animate-in slide-in-from-top-4">
          <span>{error}</span>
          <button onClick={fetchHouses} className="btn btn-ghost btn-sm font-black">Coba Lagi</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginated.map((house, index) => (
              <HouseCard
                key={house.house_id}
                house={house}
                index={index}
                page={page}
                itemsPerPage={ITEMS_PER_PAGE}
                onOpenDetail={handleOpenDetail}
                onOpenEdit={handleOpenModal}
                onOpenDelete={(h) => {
                  setCurrentHouse(h);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-base-100 rounded-3xl border border-dashed border-base-300 opacity-50">
              <Home size={64} className="mb-4 text-base-content/10" />
              <p className="font-black text-lg text-base-content/40 uppercase tracking-widest">Tidak ada data rumah ditemukan</p>
              <p className="text-sm font-bold text-base-content/30 mt-1">Coba gunakan kata kunci pencarian yang berbeda</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-12 pb-8">
              <div className="join bg-base-100 shadow-xl shadow-primary/5 border border-base-300 p-1 rounded-2xl">
                <button
                  className="join-item btn btn-ghost btn-sm rounded-xl font-bold"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="join-item btn btn-ghost btn-sm no-animation pointer-events-none font-black px-6">
                  Halaman {page} <span className="opacity-30 mx-2">/</span> {totalPages}
                </div>
                <button
                  className="join-item btn btn-ghost btn-sm rounded-xl font-bold"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <HouseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        currentHouse={currentHouse}
        formData={formData}
        setFormData={setFormData}
      />

      <HouseDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        currentHouse={currentHouse}
        detailLoading={detailLoading}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        editingHouseOccupantId={editingHouseOccupantId}
        setEditingHouseOccupantId={setEditingHouseOccupantId}
        addOccupantData={addOccupantData}
        setAddOccupantData={setAddOccupantData}
        allOccupants={allOccupants}
        submitting={submitting}
        onAddOccupant={handleAddOccupant}
        onEditOccupant={handlePrepEditOccupant}
        onDeleteOccupant={handleDeleteOccupant}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCurrentHouse(null);
        }}
        onConfirm={handleDelete}
        submitting={submitting}
        title="Hapus Data Rumah"
        message={`Apakah Anda yakin ingin menghapus data rumah "${currentHouse?.house_name}"? Semua riwayat penghuni yang terkait juga akan terhapus secara permanen.`}
      />
    </div>
  );
}
