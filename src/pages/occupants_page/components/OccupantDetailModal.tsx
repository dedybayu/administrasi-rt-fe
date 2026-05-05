import React from 'react';
import { 
  X, 
  User, 
  Home, 
  Receipt, 
  MapPin, 
  Calendar, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Phone,
  Heart,
  HeartOff,
  IdCard,
  History
} from 'lucide-react';
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
  house_occupants?: any[];
  payments?: any[];
}

interface OccupantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  occupant: Occupant | null;
}

export const OccupantDetailModal: React.FC<OccupantDetailModalProps> = ({
  isOpen,
  onClose,
  occupant
}) => {
  const [ktpImageUrl, setKtpImageUrl] = React.useState<string | null>(null);
  const [imageLoading, setImageLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && occupant?.occupant_ktp_photo) {
      const fetchImage = async () => {
        setImageLoading(true);
        try {
          const response = await api.get(`/ktp-photo/${occupant.occupant_ktp_photo}`, {
            responseType: 'blob'
          });
          const url = URL.createObjectURL(response.data);
          setKtpImageUrl(url);
        } catch (error) {
          console.error('Error loading KTP image:', error);
          setKtpImageUrl(null);
        } finally {
          setImageLoading(false);
        }
      };
      fetchImage();
    }

    return () => {
      if (ktpImageUrl) {
        URL.revokeObjectURL(ktpImageUrl);
      }
    };
  }, [isOpen, occupant?.occupant_ktp_photo]);

  if (!isOpen || !occupant) return null;

  const currentHouse = occupant.house_occupants?.find(ho => ho.is_current);
  const unpaidPayments = occupant.payments?.filter(p => !p.payment_status) || [];
  const totalUnpaid = unpaidPayments.reduce((acc, curr) => acc + parseFloat(curr.payment_amount), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[month - 1];
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-primary text-primary-content flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl leading-tight">{occupant.occupant_name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Detail Profil Warga</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm text-primary-content">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-base-200/50 p-4 rounded-2xl border border-base-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-1">Status Nikah</p>
              <div className="flex items-center gap-2">
                {occupant.is_married ? <Heart size={16} className="text-rose-500 fill-rose-500" /> : <HeartOff size={16} className="text-base-content/30" />}
                <span className="font-bold text-sm">{occupant.is_married ? 'Sudah Menikah' : 'Lajang'}</span>
              </div>
            </div>
            <div className="card bg-base-200/50 p-4 rounded-2xl border border-base-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-1">Jenis Kelamin</p>
              <div className="flex items-center gap-2">
                <User size={16} className="text-info" />
                <span className="font-bold text-sm">{occupant.occupant_gender === 'L' ? 'Laki-laki' : occupant.occupant_gender === 'P' ? 'Perempuan' : '-'}</span>
              </div>
            </div>
            <div className="card bg-base-200/50 p-4 rounded-2xl border border-base-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-1">Status Hunian</p>
              <div className="flex items-center gap-2 text-primary">
                <Home size={16} />
                <span className="font-bold text-sm">{occupant.occupant_status}</span>
              </div>
            </div>
            <div className="card bg-base-200/50 p-4 rounded-2xl border border-base-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-1">No. WhatsApp</p>
              <div className="flex items-center gap-2 text-success">
                <Phone size={16} />
                <span className="font-bold text-sm">{occupant.occupant_phone_number}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* House Residency */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-base-content/60 px-1">
                <MapPin size={16} className="text-primary" />
                <h4 className="font-black text-xs uppercase tracking-widest">Informasi Hunian</h4>
              </div>
              
              {currentHouse ? (
                <div className="card bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-lg font-black text-primary leading-tight">{currentHouse.house.house_name}</p>
                      <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">No. {currentHouse.house.house_number}</p>
                    </div>
                    <div className="badge badge-primary font-bold text-[10px] uppercase">Ditinggali Sekarang</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-base-content/60 mt-4">
                    <Calendar size={12} />
                    <span>Sejak: {new Date(currentHouse.start_in_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-base-200/30 rounded-2xl border border-dashed border-base-300">
                  <p className="text-xs font-bold text-base-content/30 uppercase tracking-widest">Tidak ada hunian aktif</p>
                </div>
              )}

              {/* History if any */}
              {occupant.house_occupants && occupant.house_occupants.filter(ho => !ho.is_current).length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 px-1">Riwayat Hunian</p>
                  {occupant.house_occupants.filter(ho => !ho.is_current).map((ho, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-base-100 border border-base-300 text-xs">
                      <div className="font-bold">{ho.house.house_name} {ho.house.house_number}</div>
                      <div className="text-[10px] text-base-content/40 font-mono">
                        {new Date(ho.start_in_date).getFullYear()} - {ho.end_in_date ? new Date(ho.end_in_date).getFullYear() : '?'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unpaid Dues */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-base-content/60">
                  <Receipt size={16} className="text-error" />
                  <h4 className="font-black text-xs uppercase tracking-widest">Tagihan Iuran</h4>
                </div>
                {totalUnpaid > 0 && (
                  <div className="badge badge-error badge-sm font-black uppercase text-[9px] px-2">Belum Lunas</div>
                )}
              </div>

              <div className="space-y-3">
                {unpaidPayments.length > 0 ? (
                  <>
                    <div className="bg-error/5 border border-error/20 p-4 rounded-2xl mb-4">
                      <p className="text-[10px] font-bold text-error/60 uppercase tracking-widest mb-1">Total Belum Dibayar</p>
                      <p className="text-2xl font-black text-error leading-tight">{formatCurrency(totalUnpaid)}</p>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {unpaidPayments.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-base-100 border border-base-300">
                          <div>
                            <p className="text-xs font-bold">{p.dues_type.dues_type_name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                              {getMonthName(p.payment_period_month)} {p.payment_period_year}
                            </p>
                          </div>
                          <p className="text-sm font-black">{formatCurrency(parseFloat(p.payment_amount))}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 bg-success/5 border border-success/20 rounded-3xl text-center">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                      <CheckCircle2 size={24} className="text-success" />
                    </div>
                    <p className="text-xs font-black text-success uppercase tracking-widest leading-relaxed">Semua Iuran<br />Sudah Lunas</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KTP Section */}
          {occupant.occupant_ktp_photo && (
            <div className="space-y-3 border-t border-base-300 pt-6">
              <div className="flex items-center gap-2 text-base-content/60 px-1">
                <IdCard size={16} className="text-info" />
                <h4 className="font-black text-xs uppercase tracking-widest">Identitas KTP</h4>
              </div>
              <div className="relative group max-w-md">
                {imageLoading ? (
                  <div className="w-full aspect-[3/2] rounded-2xl skeleton bg-base-200 flex items-center justify-center">
                    <Clock className="animate-spin text-base-content/20" size={24} />
                  </div>
                ) : ktpImageUrl ? (
                  <>
                    <img 
                      src={ktpImageUrl} 
                      alt="KTP" 
                      className="w-full rounded-2xl shadow-md border border-base-300 hover:scale-[1.02] transition-transform duration-300"
                    />
                    <a 
                      href={ktpImageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 btn btn-circle btn-sm bg-black/60 text-white border-none backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <History size={16} />
                    </a>
                  </>
                ) : (
                  <div className="w-full aspect-[3/2] rounded-2xl bg-base-200 flex flex-col items-center justify-center gap-2 text-base-content/30 border border-dashed border-base-300">
                    <AlertCircle size={24} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Gagal memuat gambar</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-base-200/50">
          <button 
            onClick={onClose} 
            className="btn btn-primary w-full font-black rounded-2xl shadow-lg shadow-primary/20"
          >
            Tutup Detail
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};
