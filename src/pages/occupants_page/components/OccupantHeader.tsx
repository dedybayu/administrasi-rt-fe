import { RefreshCw, Plus } from 'lucide-react';

interface OccupantHeaderProps {
  loading: boolean;
  filteredCount: number;
  totalCount: number;
  onRefresh: () => void;
  onAdd: () => void;
}

export function OccupantHeader({
  loading,
  filteredCount,
  totalCount,
  onRefresh,
  onAdd
}: OccupantHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Warga</h1>
        <p className="text-base-content/50 text-sm mt-1">
          {loading ? 'Memuat data...' : `${filteredCount} dari ${totalCount} warga`}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          className="btn btn-ghost btn-sm gap-2 font-bold"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
        <button
          onClick={onAdd}
          className="btn btn-primary btn-sm gap-2 font-black shadow-lg shadow-primary/20"
          disabled={loading}
        >
          <Plus size={18} />
          Tambah Warga
        </button>
      </div>
    </div>
  );
}
