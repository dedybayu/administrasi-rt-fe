import React from 'react';
import { Wallet } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';

interface WelcomeHeaderProps {
  userName: string;
  isRt: boolean;
  loading: boolean;
  totalBalance: number;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, isRt, loading, totalBalance }) => {
  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl ${isRt ? 'bg-gradient-to-br from-indigo-600 via-primary to-violet-700' : 'bg-gradient-to-br from-emerald-500 via-secondary to-teal-600'}`}>
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
              Sistem Administrasi RT
            </span>
          </div>
          <p className="text-xl font-medium opacity-80 mb-2">Selamat datang kembali 👋</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">{userName}</h1>
          <p className="text-white/60 font-medium">{isRt ? 'Anda memiliki akses penuh sebagai Ketua RT' : 'Anda terdaftar sebagai warga tetap'}</p>
        </div>

        {/* Quick Balance Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-inner flex flex-col gap-1 min-w-[240px]">
          <div className="flex items-center gap-2 text-white/60 mb-1">
            <Wallet size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Kas RT</span>
          </div>
          <h2 className="text-3xl font-black leading-none">
            {loading ? (
              <div className="h-8 w-40 bg-white/20 animate-pulse rounded-lg" />
            ) : (
              formatRupiah(totalBalance)
            )}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="badge badge-success badge-sm text-[10px] font-bold text-white py-2">AKTIF</span>
            <span className="text-[10px] text-white/50 font-bold uppercase italic">Update Real-time</span>
          </div>
        </div>
      </div>

      {/* Abstract shapes for design */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
    </div>
  );
};
