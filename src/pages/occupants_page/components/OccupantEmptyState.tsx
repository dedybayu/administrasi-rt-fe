import { Users } from 'lucide-react';

interface OccupantEmptyStateProps {
  onReset: () => void;
}

export function OccupantEmptyState({ onReset }: OccupantEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center">
        <Users size={40} className="text-base-content/20" />
      </div>
      <div>
        <p className="font-bold text-base-content/70 text-xl">Tidak ada warga ditemukan</p>
        <p className="text-sm text-base-content/40 mt-1">Coba ubah kata kunci atau filter pencarian.</p>
      </div>
      <button className="btn btn-outline btn-sm" onClick={onReset}>
        Reset Filter
      </button>
    </div>
  );
}
