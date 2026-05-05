import React from 'react';
import { Home, Users, Activity } from 'lucide-react';
import type { House } from '../types';

interface HouseStatsProps {
  houses: House[];
  totalOccupants: number;
}

export const HouseStats: React.FC<HouseStatsProps> = ({ houses, totalOccupants }) => {
  return (
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
  );
};
