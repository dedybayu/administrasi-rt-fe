import { useState, useCallback, useEffect, useMemo } from 'react';
import api from '../../../utils/api';

export interface Occupant {
  occupant_id: number;
  occupant_name: string;
  occupant_status: string;
  occupant_phone_number: string;
  is_married: boolean;
  occupant_ktp_photo: string | null;
  occupant_ktp_url: string | null;
  occupant_gender: 'L' | 'P' | null;
  users?: { username: string }[];
}

const ITEMS_PER_PAGE = 9;

export function useOccupants() {
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

  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(occupants.map((o) => o.occupant_status))),
    [occupants]
  );

  const filtered = useMemo(() => 
    occupants.filter((o) => {
      const matchSearch =
        o.occupant_name.toLowerCase().includes(search.toLowerCase()) ||
        o.occupant_phone_number.includes(search);
      const matchMarried = filterMarried === 'all' ? true : filterMarried === 'married' ? o.is_married : !o.is_married;
      const matchStatus = filterStatus === 'all' || o.occupant_status === filterStatus;
      return matchSearch && matchMarried && matchStatus;
    }),
    [occupants, search, filterMarried, filterStatus]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return {
    occupants,
    filtered,
    paginated,
    loading,
    error,
    search,
    setSearch,
    filterMarried,
    setFilterMarried,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    editingOccupant,
    setEditingOccupant,
    deletingOccupantId,
    submitting,
    formErrors,
    setFormErrors,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedOccupantDetail,
    loadingDetailId,
    fetchOccupants,
    handleSubmit,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleShowDetail,
    uniqueStatuses
  };
}
