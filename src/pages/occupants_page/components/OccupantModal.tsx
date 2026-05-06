import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2, User, Phone, Heart, IdCard, Upload, Clock, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';


interface Occupant {
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

interface OccupantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  submitting: boolean;
  editingOccupant: Occupant | null;
  errors: Record<string, string[]>;
}

export const OccupantModal: React.FC<OccupantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  editingOccupant,
  errors
}) => {
  const [formData, setFormData] = useState({
    occupant_name: '',
    occupant_status: 'Tetap',
    occupant_phone_number: '',
    is_married: false,
    occupant_gender: null as 'L' | 'P' | null,
    username: '',
    password: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingOccupant) {
      setFormData({
        occupant_name: editingOccupant.occupant_name,
        occupant_status: editingOccupant.occupant_status,
        occupant_phone_number: editingOccupant.occupant_phone_number,
        is_married: editingOccupant.is_married,
        occupant_gender: editingOccupant.occupant_gender,
        username: editingOccupant.users?.[0]?.username || '',
        password: '',
      });
      
      if (editingOccupant.occupant_ktp_photo) {
        setImageLoading(true);
        api.get(`/ktp-photo/${editingOccupant.occupant_ktp_photo}`, { responseType: 'blob' })
          .then(res => {
            const url = URL.createObjectURL(res.data);
            setPreviewUrl(url);
          })
          .catch(() => setPreviewUrl(null))
          .finally(() => setImageLoading(false));
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({
        occupant_name: '',
        occupant_status: 'Tetap',
        occupant_phone_number: '',
        is_married: false,
        occupant_gender: null,
        username: '',
        password: '',
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);

    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [editingOccupant, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('occupant_name', formData.occupant_name);
    data.append('occupant_status', formData.occupant_status);
    data.append('occupant_phone_number', formData.occupant_phone_number);
    data.append('is_married', formData.is_married ? '1' : '0');
    if (formData.occupant_gender) {
      data.append('occupant_gender', formData.occupant_gender);
    }
    
    data.append('username', formData.username);
    if (formData.password) {
      data.append('password', formData.password);
    }
    
    if (selectedFile) {
      data.append('occupant_ktp_photo', selectedFile);
    }
    
    if (editingOccupant) {
      data.append('_method', 'PUT');
    }
    
    onSubmit(data);
  };

  const ErrorMessage = ({ name }: { name: string }) => {
    const error = errors[name];
    if (!error) return null;
    return (
      <div className="text-error text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
        <AlertCircle size={10} />
        {error[0]}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 bg-primary text-primary-content flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-black text-xl">{editingOccupant ? 'Edit Data Warga' : 'Tambah Warga Baru'}</h3>
            <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">Formulir Identitas Warga</p>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm text-primary-content">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Nama Lengkap</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Contoh: Budi Santoso" 
                    className="input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                    value={formData.occupant_name}
                    onChange={(e) => setFormData({ ...formData, occupant_name: e.target.value })}
                    required
                  />
                </div>
                <ErrorMessage name="occupant_name" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Nomor Telepon / WhatsApp</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Contoh: 08123456789" 
                    className="input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                    value={formData.occupant_phone_number}
                    onChange={(e) => setFormData({ ...formData, occupant_phone_number: e.target.value })}
                    required
                  />
                </div>
                <ErrorMessage name="occupant_phone_number" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Status Hunian</span>
                </label>
                <select 
                  className="select select-bordered w-full font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                  value={formData.occupant_status}
                  onChange={(e) => setFormData({ ...formData, occupant_status: e.target.value })}
                  required
                >
                  <option value="Tetap">Tetap</option>
                  <option value="Kontrak">Kontrak</option>
                  <option value="Sewa">Sewa</option>
                  <option value="Sementara">Sementara</option>
                </select>
                <ErrorMessage name="occupant_status" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Jenis Kelamin</span>
                </label>
                <div className="flex gap-4">
                  <label className="label cursor-pointer flex items-center gap-2 bg-base-200/50 px-4 py-2 rounded-2xl flex-1 hover:bg-base-200 transition-colors">
                    <input 
                      type="radio" 
                      name="gender" 
                      className="radio radio-primary" 
                      checked={formData.occupant_gender === 'L'} 
                      onChange={() => setFormData({ ...formData, occupant_gender: 'L' })}
                    />
                    <span className="label-text font-bold">Laki-laki</span>
                  </label>
                  <label className="label cursor-pointer flex items-center gap-2 bg-base-200/50 px-4 py-2 rounded-2xl flex-1 hover:bg-base-200 transition-colors">
                    <input 
                      type="radio" 
                      name="gender" 
                      className="radio radio-primary" 
                      checked={formData.occupant_gender === 'P'} 
                      onChange={() => setFormData({ ...formData, occupant_gender: 'P' })}
                    />
                    <span className="label-text font-bold">Perempuan</span>
                  </label>
                </div>
                <ErrorMessage name="occupant_gender" />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4 p-0 mt-2">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary rounded-xl"
                    checked={formData.is_married}
                    onChange={(e) => setFormData({ ...formData, is_married: e.target.checked })}
                  />
                  <div className="flex items-center gap-2">
                    <span className="label-text font-bold text-sm">Sudah Menikah</span>
                  </div>
                </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Username</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                    <input 
                      type="text" 
                      placeholder="Username warga" 
                      className="input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <ErrorMessage name="username" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">
                      {editingOccupant ? 'Ganti Password' : 'Password'}
                    </span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                    <input 
                      type="password" 
                      placeholder={editingOccupant ? 'Kosongkan jika tidak ganti' : 'Password baru'} 
                      className="input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingOccupant}
                    />
                  </div>
                  <ErrorMessage name="password" />
                </div>
              </div>

              <label className="label">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Foto KTP</span>
              </label>
              <div 
                className={`relative border-2 border-dashed rounded-3xl overflow-hidden transition-all flex flex-col items-center justify-center p-4 min-h-[220px] ${previewUrl ? 'border-primary/30 bg-primary/5' : 'border-base-300 bg-base-200/30 hover:bg-base-200/50 cursor-pointer'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imageLoading ? (
                  <div className="w-full aspect-[3/2] rounded-2xl skeleton bg-base-200 flex items-center justify-center">
                    <Clock className="animate-spin text-base-content/20" size={24} />
                  </div>
                ) : previewUrl ? (
                  <div className="relative w-full h-full min-h-[180px]">
                    <img src={previewUrl} alt="Preview KTP" className="w-full h-full object-cover rounded-2xl shadow-lg" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                      <p className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Upload size={16} /> Ganti Foto
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
                      <IdCard size={32} className="text-base-content/20" />
                    </div>
                    <p className="font-bold text-sm text-base-content/60">Klik untuk upload KTP</p>
                    <p className="text-[10px] text-base-content/40 mt-1 uppercase font-black tracking-widest">JPG, PNG max 2MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <ErrorMessage name="occupant_ktp_photo" />
            </div>
          </div>

          </div>
          <div className="modal-action p-6 mt-0 border-t border-base-200 shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-ghost font-bold rounded-2xl px-8"
              disabled={submitting}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary font-black rounded-2xl px-10 shadow-lg shadow-primary/20 gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  {editingOccupant ? 'Simpan Perubahan' : 'Simpan Data'}
                </>
              )}
            </button>
          </div>
</div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
