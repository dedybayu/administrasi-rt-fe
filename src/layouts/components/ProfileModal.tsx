import React, { useState, useEffect } from 'react';
import { X, User, Lock, Save, Loader2, AlertCircle, ShieldCheck, UserCircle } from 'lucide-react';
import api from '../../utils/api';
import Cookies from 'js-cookie';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRt: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, isRt }) => {
  const [formData, setFormData] = useState({
    username: Cookies.get('user_name') || '',
    password: '',
    password_confirmation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: Cookies.get('user_name') || '',
        password: '',
        password_confirmation: '',
      });
      setErrors({});
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess(false);

    try {
      await api.post('/update-profile', formData);
      setSuccess(true);
      if (isRt) {
        Cookies.set('user_name', formData.username);
      }
      // Reset password fields
      setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: [err.response?.data?.message || 'Gagal memperbarui profil'] });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-[2.5rem] animate-in fade-in zoom-in duration-200">
        <div className={`p-6 ${isRt ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <UserCircle size={28} />
              </div>
              <div>
                <h3 className="font-black text-xl">Pengaturan Profil</h3>
                <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">
                  {isRt ? 'Update Akun Ketua RT' : 'Update Kata Sandi Warga'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {success && (
            <div className="alert alert-success bg-success/10 border-success/20 text-success rounded-2xl py-3 font-bold text-sm">
              <ShieldCheck size={20} />
              Profil berhasil diperbarui!
            </div>
          )}

          {errors.general && (
            <div className="alert alert-error bg-error/10 border-error/20 text-error rounded-2xl py-3 font-bold text-sm">
              <AlertCircle size={20} />
              {errors.general[0]}
            </div>
          )}

          <div className="space-y-4">
            {isRt && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Username</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all ${errors.username ? 'input-error' : ''}`}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Username baru"
                    required={isRt}
                  />
                </div>
                {errors.username && (
                  <p className="text-error text-[10px] font-bold mt-1 ml-1 uppercase tracking-tighter">{errors.username[0]}</p>
                )}
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Password Baru</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                <input
                  type="password"
                  className={`input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Kosongkan jika tidak ingin ubah"
                />
              </div>
              {errors.password && (
                <p className="text-error text-[10px] font-bold mt-1 ml-1 uppercase tracking-tighter">{errors.password[0]}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Konfirmasi Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                <input
                  type="password"
                  className="input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn flex-1 rounded-2xl font-bold bg-base-200 border-none"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`btn flex-[2] rounded-2xl font-black shadow-lg gap-2 ${isRt ? 'btn-primary shadow-primary/20' : 'btn-secondary shadow-secondary/20'}`}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
