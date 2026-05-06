import { Phone, User, IdCard, RefreshCw, Eye, Pencil, Trash2 } from 'lucide-react';
import type{ Occupant } from '../hooks/useOccupants';

interface OccupantCardProps {
  occupant: Occupant;
  onShowDetail: (id: number) => void;
  onEdit: (o: Occupant) => void;
  onDelete: (id: number) => void;
  loadingDetailId: number | null;
}

const avatarColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-info'];
const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];
const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const statusBadge = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('tetap') || s.includes('permanent')) return 'badge-primary';
  if (s.includes('kontrak') || s.includes('sewa') || s.includes('rent')) return 'badge-warning';
  if (s.includes('sementar') || s.includes('temp')) return 'badge-info';
  return 'badge-ghost';
};

export function OccupantCard({ 
  occupant, 
  onShowDetail, 
  onEdit, 
  onDelete, 
  loadingDetailId 
}: OccupantCardProps) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-5">
        {/* Header */}
        <div 
          className="flex items-start gap-3 mb-3 cursor-pointer group/header"
          onClick={() => onShowDetail(occupant.occupant_id)}
        >
          <div className={`w-14 h-14 rounded-2xl ${getAvatarColor(occupant.occupant_id)} text-white text-lg font-bold flex items-center justify-center shrink-0 shadow-sm border border-white/10 group-hover/header:scale-105 transition-transform`}>
            {getInitials(occupant.occupant_name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold truncate text-base group-hover/header:text-primary transition-colors" title={occupant.occupant_name}>
              {occupant.occupant_name}
            </p>
            <span className={`badge badge-sm mt-1 font-semibold ${statusBadge(occupant.occupant_status)}`}>
              {occupant.occupant_status}
            </span>
          </div>
        </div>

        <div className="divider my-0 opacity-40" />

        {/* Info */}
        <div className="flex flex-col gap-2.5 mt-3">
          <div className="flex items-center gap-2.5 text-sm text-base-content/70">
            <Phone size={14} className="text-primary" />
            <span>{occupant.occupant_phone_number}</span>
          </div>
          {occupant.users && occupant.users.length > 0 && (
            <div className="flex items-center gap-2.5 text-sm text-base-content/70">
              <User size={14} className="text-primary" />
              <span className="font-medium text-primary/80">@{occupant.users[0].username}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm text-base-content/70">
            <User size={14} className="text-primary" />
            <span>{occupant.is_married ? 'Sudah Menikah' : 'Belum Menikah'}</span>
          </div>
          {occupant.occupant_ktp_url && (
            <div className="flex items-center gap-2.5 text-sm">
              <IdCard size={14} className="text-primary" />
              <a href={occupant.occupant_ktp_url} target="_blank" rel="noopener noreferrer" className="link link-primary font-medium">
                Lihat Foto KTP
              </a>
            </div>
          )}
        </div>

        <div className="card-actions justify-between items-center mt-6">
          <span className="text-[10px] text-base-content/30 font-mono tracking-wider">
            ID-{String(occupant.occupant_id).padStart(4, '0')}
          </span>
          <div className="flex gap-1">
            <button 
              onClick={() => onShowDetail(occupant.occupant_id)}
              className="btn btn-ghost btn-square btn-xs text-primary hover:bg-primary/10 transition-colors"
              title="Lihat Detail"
              disabled={loadingDetailId === occupant.occupant_id}
            >
              {loadingDetailId === occupant.occupant_id ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Eye size={14} />
              )}
            </button>
            <button 
              onClick={() => onEdit(occupant)}
              className="btn btn-ghost btn-square btn-xs text-info hover:bg-info/10 transition-colors"
              title="Edit Warga"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={() => onDelete(occupant.occupant_id)}
              className="btn btn-ghost btn-square btn-xs text-error hover:bg-error/10 transition-colors"
              title="Hapus Warga"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
