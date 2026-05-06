import { AlertCircle } from 'lucide-react';
import { useOccupants } from './hooks/useOccupants';
import { OccupantModal } from './components/OccupantModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { OccupantDetailModal } from './components/OccupantDetailModal';
import { OccupantHeader } from './components/OccupantHeader';
import { OccupantFilters } from './components/OccupantFilters';
import { OccupantCard } from './components/OccupantCard';
import { OccupantEmptyState } from './components/OccupantEmptyState';
import { OccupantPagination } from './components/OccupantPagination';
import { OccupantSkeleton } from './components/OccupantSkeleton';

export default function Occupants() {
  const {
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
  } = useOccupants();

  return (
    <div className="p-6 lg:p-8 max-w-xxl mx-auto">
      {/* Header */}
      <OccupantHeader 
        loading={loading}
        filteredCount={filtered.length}
        totalCount={occupants.length}
        onRefresh={fetchOccupants}
        onAdd={() => {
          setEditingOccupant(null);
          setFormErrors({});
          setIsModalOpen(true);
        }}
      />

      {/* Filters */}
      <OccupantFilters 
        search={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        uniqueStatuses={uniqueStatuses}
        filterMarried={filterMarried}
        onMarriedChange={setFilterMarried}
      />

      {/* Error */}
      {error && !loading && (
        <div role="alert" className="alert alert-error mb-6">
          <AlertCircle size={18} />
          <span className="flex-1">{error}</span>
          <button onClick={fetchOccupants} className="btn btn-sm btn-ghost">Coba Lagi</button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <OccupantSkeleton />
      ) : filtered.length === 0 ? (
        <OccupantEmptyState 
          onReset={() => {
            setSearch('');
            setFilterStatus('all');
            setFilterMarried('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((o) => (
            <OccupantCard 
              key={o.occupant_id}
              occupant={o}
              onShowDetail={handleShowDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loadingDetailId={loadingDetailId}
            />
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
      <OccupantPagination 
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
