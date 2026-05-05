import React from 'react';
import { 
  X, 
  Home, 
  Users, 
  Loader2, 
  UserCheck, 
  History, 
  Phone, 
  Pencil, 
  Trash2, 
  Calendar,
  UserPlus
} from 'lucide-react';
import type { House, Occupant, HouseOccupant } from '../types';

interface HouseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHouse: House | null;
  detailLoading: boolean;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  editingHouseOccupantId: number | null;
  setEditingHouseOccupantId: (id: number | null) => void;
  addOccupantData: {
    occupant_id: string;
    start_in_date: string;
    end_in_date: string;
    is_current: boolean;
    is_head_family: boolean;
  };
  setAddOccupantData: (data: any) => void;
  allOccupants: Occupant[];
  submitting: boolean;
  onAddOccupant: (e: React.FormEvent) => void;
  onEditOccupant: (ho: HouseOccupant) => void;
  onDeleteOccupant: (id: number) => void;
}

export const HouseDetailModal: React.FC<HouseDetailModalProps> = ({
  isOpen,
  onClose,
  currentHouse,
  detailLoading,
  showAddForm,
  setShowAddForm,
  editingHouseOccupantId,
  setEditingHouseOccupantId,
  addOccupantData,
  setAddOccupantData,
  allOccupants,
  submitting,
  onAddOccupant,
  onEditOccupant,
  onDeleteOccupant
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-primary text-primary-content">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Home size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight">{currentHouse?.house_name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Detail Rumah</p>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm">
              <X size={20} />
            </button>
          </div>
          <div className="flex gap-2">
            <div className="badge badge-outline border-white/30 text-white font-bold">
              No. {currentHouse?.house_number}
            </div>
            <div className="badge badge-outline border-white/30 text-white font-bold">
              {currentHouse?.house_occupants?.length || 0} Penghuni
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-base-content/50">
              <Users size={18} />
              <h4 className="font-black text-sm uppercase tracking-widest">Daftar Penghuni</h4>
            </div>
            <button 
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (showAddForm) {
                  setEditingHouseOccupantId(null);
                  setAddOccupantData({
                    occupant_id: '',
                    start_in_date: new Date().toISOString().split('T')[0],
                    end_in_date: '',
                    is_current: true,
                    is_head_family: false
                  });
                }
              }}
              className={`btn btn-xs gap-1 font-bold rounded-lg ${showAddForm ? 'btn-ghost text-error' : 'btn-primary'}`}
            >
              {showAddForm ? <X size={14} /> : <UserPlus size={14} />}
              {showAddForm ? 'Batal' : 'Tambah'}
            </button>
          </div>

          {showAddForm && (
            <form 
              onSubmit={onAddOccupant}
              className={`mb-6 p-4 rounded-2xl border space-y-4 animate-in slide-in-from-top-2 duration-200 ${editingHouseOccupantId ? 'bg-info/5 border-info/20' : 'bg-secondary/5 border-secondary/20'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${editingHouseOccupantId ? 'bg-info/20 text-info' : 'bg-secondary/20 text-secondary'}`}>
                  {editingHouseOccupantId ? <Pencil size={12} /> : <UserPlus size={12} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  {editingHouseOccupantId ? 'Edit Data Penghuni' : 'Tambah Penghuni Baru'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control col-span-2 sm:col-span-1">
                  <label className="label py-1">
                    <span className="label-text font-black text-[10px] uppercase tracking-wider opacity-50">Pilih Penghuni</span>
                  </label>
                  <select 
                    className="select select-bordered select-sm w-full font-bold bg-base-100 border-base-300"
                    value={addOccupantData.occupant_id || ''}
                    onChange={(e) => setAddOccupantData({ ...addOccupantData, occupant_id: e.target.value })}
                    required
                  >
                    <option value="">-- Nama --</option>
                    {allOccupants && allOccupants.length > 0 ? (
                      allOccupants.map((o) => (
                        <option key={o.occupant_id} value={String(o.occupant_id)}>{o.occupant_name}</option>
                      ))
                    ) : (
                      <option disabled>Memuat data penghuni...</option>
                    )}
                  </select>
                </div>
                <div className="form-control col-span-2 sm:col-span-1">
                  <label className="label py-1">
                    <span className="label-text font-black text-[10px] uppercase tracking-wider opacity-50">Tgl Mulai</span>
                  </label>
                  <input 
                    type="date" 
                    className="input input-bordered input-sm w-full font-bold bg-base-100 border-base-300"
                    value={addOccupantData.start_in_date}
                    onChange={(e) => setAddOccupantData({ ...addOccupantData, start_in_date: e.target.value })}
                    required
                  />
                </div>
                {!addOccupantData.is_current && (
                  <div className="form-control col-span-2 sm:col-span-2 animate-in slide-in-from-left-2 duration-200">
                    <label className="label py-1">
                      <span className="label-text font-black text-[10px] uppercase tracking-wider text-error font-bold">Tanggal Berakhir (Wajib jika tidak aktif)</span>
                    </label>
                    <input 
                      type="date" 
                      className="input input-bordered input-sm w-full font-bold bg-base-100 border-error/30"
                      value={addOccupantData.end_in_date}
                      onChange={(e) => setAddOccupantData({ ...addOccupantData, end_in_date: e.target.value })}
                      required={!addOccupantData.is_current}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="label cursor-pointer justify-start gap-2 py-0">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-secondary checkbox-sm rounded-md"
                    checked={addOccupantData.is_current}
                    onChange={(e) => setAddOccupantData({ ...addOccupantData, is_current: e.target.checked })}
                  />
                  <span className="label-text font-bold text-[10px] uppercase tracking-wider opacity-50">Penghuni Aktif</span>
                </label>
                <label className="label cursor-pointer justify-start gap-2 py-0">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary checkbox-sm rounded-md"
                    checked={addOccupantData.is_head_family}
                    onChange={(e) => setAddOccupantData({ ...addOccupantData, is_head_family: e.target.checked })}
                    disabled={
                      editingHouseOccupantId !== null && 
                      addOccupantData.is_head_family && 
                      (currentHouse?.house_occupants?.filter(ho => ho.is_current).length || 0) <= 1
                    }
                  />
                  <span className="label-text font-bold text-[10px] uppercase tracking-wider opacity-50">
                    Kepala Keluarga {editingHouseOccupantId !== null && addOccupantData.is_head_family && (currentHouse?.house_occupants?.filter(ho => ho.is_current).length || 0) <= 1 && "(Wajib)"}
                  </span>
                </label>
                <button 
                  type="submit" 
                  className={`btn btn-sm font-black px-6 shadow-lg ${editingHouseOccupantId ? 'btn-info shadow-info/20' : 'btn-secondary shadow-secondary/20'}`}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : (editingHouseOccupantId ? "Update" : "Simpan")}
                </button>
              </div>
            </form>
          )}

          {detailLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={32} className="animate-spin text-primary" />
              <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Memuat Data...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {currentHouse?.house_occupants && currentHouse.house_occupants.length > 0 ? (
                currentHouse.house_occupants.map((ho) => (
                  <div key={ho.house_occupant_id} className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between group hover:bg-base-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ho.is_current ? 'bg-success/10 text-success' : 'bg-base-content/10 text-base-content/50'}`}>
                        {ho.is_current ? <UserCheck size={20} /> : <History size={20} />}
                      </div>
                      <div>
                        <p className="font-black text-base-content leading-tight">{ho.occupant.occupant_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`badge badge-xs font-bold uppercase ${ho.is_current ? 'badge-success' : 'badge-ghost opacity-50'}`}>
                            {ho.is_current ? 'Aktif' : 'Riwayat'}
                          </span>
                          {!!ho.is_head_family && (
                            <span className="badge badge-xs badge-primary font-bold uppercase">Kepala Keluarga</span>
                          )}
                          <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">{ho.occupant.occupant_status}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 opacity-50">
                          <Calendar size={10} />
                          <span className="text-[9px] font-bold uppercase tracking-tight">
                            {ho.start_in_date ? new Date(ho.start_in_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} — {ho.is_current ? 'Sekarang' : (ho.end_in_date ? new Date(ho.end_in_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {ho.occupant.occupant_phone_number && (
                        <a 
                          href={`tel:${ho.occupant.occupant_phone_number}`}
                          className="btn btn-circle btn-ghost btn-sm text-primary"
                          title="Hubungi"
                        >
                          <Phone size={16} />
                        </a>
                      )}
                      <button 
                        onClick={() => onEditOccupant(ho)}
                        className="btn btn-circle btn-ghost btn-sm text-info opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteOccupant(ho.house_occupant_id)}
                        className="btn btn-circle btn-ghost btn-sm text-error opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-base-200/30 rounded-3xl border border-dashed border-base-300">
                  <Users size={32} className="text-base-content/10 mb-2" />
                  <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">Belum Ada Penghuni</p>
                </div>
              )}
            </div>
          )}

          <div className="modal-action mt-8">
            <button 
              onClick={onClose} 
              className="btn btn-primary w-full font-black rounded-2xl shadow-lg shadow-primary/20"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
