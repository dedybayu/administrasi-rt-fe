import React from 'react';
import { Home, Users, Pencil, Trash2, Eye } from 'lucide-react';
import type { House } from '../types';

interface HouseCardProps {
  house: House;
  index: number;
  page: number;
  itemsPerPage: number;
  onOpenDetail: (house: House) => void;
  onOpenEdit: (house: House) => void;
  onOpenDelete: (house: House) => void;
}

export const HouseCard: React.FC<HouseCardProps> = ({ 
  house, 
  index, 
  page, 
  itemsPerPage, 
  onOpenDetail, 
  onOpenEdit, 
  onOpenDelete 
}) => {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="card-body p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-colors shadow-inner">
            <Home size={24} />
          </div>
          <div className="badge badge-lg bg-base-200 border-none font-black text-base-content/70">
            {(page - 1) * itemsPerPage + index + 1}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">
            {house.house_name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-base-content/50">
            <span className="text-xs font-bold uppercase tracking-tight">No. Rumah: {house.house_number}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-base-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-base-content/60">
            <Users size={16} className="text-secondary" />
            <span className="text-sm font-bold">
              {house.house_occupants_count && house.house_occupants_count > 0 
                ? `${house.house_occupants_count} Penghuni` 
                : 'Tidak Dihuni'}
            </span>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => onOpenDetail(house)}
              className="btn btn-ghost btn-square btn-xs text-primary hover:bg-primary/10 sm:opacity-0 group-hover:opacity-100 transition-opacity"
              title="Detail Rumah"
            >
              <Eye size={14} />
            </button>
            <button 
              onClick={() => onOpenEdit(house)}
              className="btn btn-ghost btn-square btn-xs text-info hover:bg-info/10 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={() => onOpenDelete(house)}
              className="btn btn-ghost btn-square btn-xs text-error hover:bg-error/10 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
