import { Search } from 'lucide-react';

interface OccupantFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  uniqueStatuses: string[];
  filterMarried: 'all' | 'married' | 'single';
  onMarriedChange: (value: 'all' | 'married' | 'single') => void;
}

export function OccupantFilters({
  search,
  onSearchChange,
  filterStatus,
  onStatusChange,
  uniqueStatuses,
  filterMarried,
  onMarriedChange
}: OccupantFiltersProps) {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <select
          className="select select-bordered"
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">Semua Status</option>
          {uniqueStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="join border border-base-300">
          {(['all', 'married', 'single'] as const).map((v) => (
            <button
              key={v}
              className={`join-item btn btn-sm ${filterMarried === v ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onMarriedChange(v)}
            >
              {v === 'all' ? 'Semua' : v === 'married' ? 'Menikah' : 'Lajang'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
