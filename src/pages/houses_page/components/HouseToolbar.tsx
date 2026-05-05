import React from 'react';
import { Search, UserPlus } from 'lucide-react';

interface HouseToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  onAddHouse: () => void;
}

export const HouseToolbar: React.FC<HouseToolbarProps> = ({ search, setSearch, onAddHouse }) => {
  return (
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
              onClick={onAddHouse}
              className="btn btn-primary btn-sm gap-2 flex-1 md:flex-none font-bold px-6"
            >
              <UserPlus size={18} />
              Tambah Rumah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
