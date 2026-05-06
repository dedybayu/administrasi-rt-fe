import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2, Wallet, Calendar, Building2, Upload, Image as ImageIcon, AlertCircle, Receipt, Search, ChevronDown, Clock } from 'lucide-react';
import api from '../../../utils/api';

interface DuesType {
  dues_type_id: number;
  dues_type_name: string;
  dues_type_amount: string;
}

interface HouseOccupant {
  house_occupant_id: number;
  house_id: number;
  occupant_id: number;
  house: {
    house_name: string;
    house_number: string;
  };
  occupant: {
    occupant_name: string;
  };
  is_head_family: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData | FormData[]) => void;
  submitting: boolean;
  errors: Record<string, string[]>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  errors
}) => {
  const [formData, setFormData] = useState({
    dues_type_id: '',
    house_occupant_id: '',
    payer_occupant_id: '',
    payment_amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_period_month: (new Date().getMonth() + 1).toString(),
    payment_period_year: new Date().getFullYear().toString(),
    payment_status: 'success' as string | null,
    payment_duration: '1',
  });

  const [operationType, setOperationType] = useState<'pay' | 'bill'>('pay');

  const [duesTypes, setDuesTypes] = useState<DuesType[]>([]);
  const [houseOccupants, setHouseOccupants] = useState<HouseOccupant[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Fetch dependencies
      api.get('/dues-types').then(res => setDuesTypes(res.data.data ?? res.data));
      api.get('/house-occupants').then(res => setHouseOccupants(res.data.data ?? res.data));

      setOperationType('pay');
      setFormData({
        dues_type_id: '',
        house_occupant_id: '',
        payer_occupant_id: '',
        payment_amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_period_month: (new Date().getMonth() + 1).toString(),
        payment_period_year: new Date().getFullYear().toString(),
        payment_status: 'success',
        payment_duration: '1',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setSearchTerm('');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAndSortedOccupants = houseOccupants
    .filter(ho => ho.is_head_family)
    .filter(ho => {
      const searchStr = `${ho.house.house_name} ${ho.house.house_number} ${ho.occupant.occupant_name}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = `${a.house.house_name} ${a.house.house_number}`.toLowerCase();
      const nameB = `${b.house.house_name} ${b.house.house_number}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const selectedOccupant = houseOccupants.find(ho => ho.house_occupant_id === parseInt(formData.house_occupant_id));

  const getDurationSummary = () => {
    const duration = parseInt(formData.payment_duration) || 1;
    if (duration <= 1) return null;

    const startMonth = parseInt(formData.payment_period_month);
    const startYear = parseInt(formData.payment_period_year);

    if (!startMonth || !startYear) return null;

    let endMonth = startMonth + duration - 1;
    let endYear = startYear;

    while (endMonth > 12) {
      endMonth -= 12;
      endYear += 1;
    }

    const startLabel = new Date(startYear, startMonth - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    const endLabel = new Date(endYear, endMonth - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    return `${startLabel} s/d ${endLabel}`;
  };

  const handleOperationTypeChange = (type: 'pay' | 'bill') => {
    setOperationType(type);
    setFormData({
      ...formData,
      payment_status: type === 'pay' ? 'success' : '', // Set to empty string for null on backend
    });
    if (type === 'bill') {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleHouseOccupantChange = (id: string) => {
    const selected = houseOccupants.find(ho => ho.house_occupant_id === parseInt(id));
    setFormData({
      ...formData,
      house_occupant_id: id,
      payer_occupant_id: selected ? selected.occupant_id.toString() : '',
    });
  };

  const handleDuesTypeChange = (id: string) => {
    const selected = duesTypes.find(dt => dt.dues_type_id === parseInt(id));
    setFormData({
      ...formData,
      dues_type_id: id,
      payment_amount: selected ? selected.dues_type_amount : '',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = parseInt(formData.payment_duration) || 1;
    const formDataArray: FormData[] = [];

    for (let i = 0; i < duration; i++) {
      const data = new FormData();
      
      // Calculate month and year for this iteration
      let month = parseInt(formData.payment_period_month) + i;
      let year = parseInt(formData.payment_period_year);
      
      while (month > 12) {
        month -= 12;
        year += 1;
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'payment_status' && operationType === 'bill') {
          // Skip status to let it be NULL on backend
        } else if (key === 'payment_date' && operationType === 'bill') {
          // Skip date to let it be NULL on backend
        } else if (key === 'payment_period_month') {
          data.append(key, month.toString());
        } else if (key === 'payment_period_year') {
          data.append(key, year.toString());
        } else if (key === 'payment_duration') {
          // Skip duration field for API
        } else if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });

      if (operationType === 'pay' && selectedFile) {
        data.append('payment_proof', selectedFile);
      }
      
      formDataArray.push(data);
    }

    if (formDataArray.length === 1) {
      onSubmit(formDataArray[0]);
    } else {
      onSubmit(formDataArray);
    }
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
      <div className="modal-box max-w-5xl p-0 overflow-hidden bg-base-100 border border-base-300 shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-primary text-primary-content">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-xl">Kelola Iuran</h3>
              <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">Input Transaksi Kas Masuk</p>
            </div>
            <button onClick={onClose} className="btn btn-circle btn-ghost btn-sm text-primary-content">
              <X size={20} />
            </button>
          </div>

          <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => handleOperationTypeChange('pay')}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${operationType === 'pay' ? 'bg-white text-primary shadow-lg' : 'text-white hover:bg-white/10'}`}
            >
              Catat Pembayaran
            </button>
            <button
              type="button"
              onClick={() => handleOperationTypeChange('bill')}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${operationType === 'bill' ? 'bg-white text-primary shadow-lg' : 'text-white hover:bg-white/10'}`}
            >
              Tagih Iuran
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Warga & Rumah</span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30 z-10" size={18} />
                  <div className={`input input-bordered w-full pl-10 pr-10 flex items-center font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all ${!formData.house_occupant_id ? 'text-base-content/40' : ''}`}>
                    {selectedOccupant 
                      ? `${selectedOccupant.house.house_name} ${selectedOccupant.house.house_number} - ${selectedOccupant.occupant.occupant_name}`
                      : 'Pilih Rumah/Warga'}
                  </div>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-base-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={14} />
                        <input
                          type="text"
                          placeholder="Cari rumah atau nama..."
                          className="input input-sm input-bordered w-full pl-9 bg-base-200/50 border-none focus:bg-base-200"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                      {filteredAndSortedOccupants.length > 0 ? (
                        filteredAndSortedOccupants.map(ho => (
                          <div
                            key={ho.house_occupant_id}
                            className={`p-3 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold flex items-center gap-3 ${formData.house_occupant_id === ho.house_occupant_id.toString() ? 'bg-primary/20 text-primary' : ''}`}
                            onClick={() => {
                              handleHouseOccupantChange(ho.house_occupant_id.toString());
                              setIsDropdownOpen(false);
                              setSearchTerm('');
                            }}
                          >
                            <Building2 size={14} className="opacity-50" />
                            <span>{ho.house.house_name} {ho.house.house_number} - {ho.occupant.occupant_name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Tidak ada hasil</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <ErrorMessage name="house_occupant_id" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Jenis Iuran</span>
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                  <select
                    className="select select-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all text-sm"
                    value={formData.dues_type_id}
                    onChange={(e) => handleDuesTypeChange(e.target.value)}
                    required
                  >
                    <option value="">Pilih Iuran</option>
                    {duesTypes.map(dt => (
                      <option key={dt.dues_type_id} value={dt.dues_type_id}>{dt.dues_type_name}</option>
                    ))}
                  </select>
                </div>
                <ErrorMessage name="dues_type_id" />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Jumlah (IDR)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                  value={formData.payment_amount}
                  onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                  required
                />
                <ErrorMessage name="payment_amount" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Bulan</span>
                </label>
                <select
                  className="select select-bordered w-full font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                  value={formData.payment_period_month}
                  onChange={(e) => setFormData({ ...formData, payment_period_month: e.target.value })}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Tahun</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                  value={formData.payment_period_year}
                  onChange={(e) => setFormData({ ...formData, payment_period_year: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className={`label-text font-black text-xs uppercase tracking-wider ${operationType === 'pay' ? 'text-primary' : 'text-base-content/50'}`}>
                  {operationType === 'pay' ? 'Bayar Sekaligus' : 'Tagih Sekaligus'} (Durasi Bulan)
                </span>
              </label>
              <div className="relative">
                <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 ${operationType === 'pay' ? 'text-primary/30' : 'text-base-content/30'}`} size={18} />
                <input
                  type="number"
                  min="1"
                  max="12"
                  className={`input input-bordered w-full pl-10 font-bold transition-all ${operationType === 'pay' ? 'bg-primary/5 border-primary/20 focus:bg-primary/10 text-primary' : 'bg-base-200/50 border-none focus:bg-base-100'}`}
                  placeholder="Contoh: 3 (untuk 3 bulan sekaligus)"
                  value={formData.payment_duration}
                  onChange={(e) => setFormData({ ...formData, payment_duration: e.target.value })}
                />
              </div>
              {getDurationSummary() && (
                <div className={`mt-2 p-3 rounded-xl border flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${operationType === 'pay' ? 'bg-primary/10 border-primary/20' : 'bg-base-200/50 border-base-300'}`}>
                  <Calendar size={14} className={operationType === 'pay' ? 'text-primary' : 'text-base-content/40'} />
                  <p className={`text-[11px] font-black uppercase tracking-wider ${operationType === 'pay' ? 'text-primary' : 'text-base-content/60'}`}>
                    {getDurationSummary()}
                  </p>
                </div>
              )}
              <p className={`text-[10px] font-bold mt-1.5 uppercase tracking-tight ml-1 ${operationType === 'pay' ? 'text-primary/50' : 'text-base-content/40'}`}>
                {operationType === 'pay' 
                  ? 'Bukti pembayaran akan diduplikasi otomatis untuk setiap bulan.'
                  : 'Tagihan akan dibuat terpisah untuk setiap bulan.'}
              </p>
            </div>

            {operationType === 'pay' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">Tanggal Bayar</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={18} />
                  <input
                    type="date"
                    className="input input-bordered w-full pl-10 font-bold bg-base-200/50 border-none focus:bg-base-100 transition-all"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5 flex flex-col h-full">
            <div className="form-control flex-1 flex flex-col">
              <label className="label">
                <span className="label-text font-black text-xs uppercase tracking-wider text-base-content/50">
                  {operationType === 'pay' ? (
                    <>
                      Bukti Pembayaran <span className="text-error ml-1">* (Wajib)</span>
                    </>
                  ) : 'Catatan Penagihan'}
                </span>
              </label>

              {operationType === 'pay' ? (
                <div
                  className={`flex-1 border-2 border-dashed rounded-3xl overflow-hidden transition-all flex flex-col items-center justify-center p-4 min-h-[200px] ${previewUrl ? 'border-primary/30 bg-primary/5' : 'border-base-300 bg-base-200/30 hover:bg-base-200/50 cursor-pointer'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full min-h-[250px]">
                      <img src={previewUrl} alt="Preview Bukti" className="w-full h-full object-contain rounded-2xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <p className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                          <Upload size={16} /> Ganti Foto
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
                        <ImageIcon size={32} className="text-base-content/20" />
                      </div>
                      <p className="font-bold text-sm text-base-content/60">Klik untuk upload bukti</p>
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
              ) : (
                <div className="flex-1 rounded-3xl bg-base-200/50 border border-base-300 p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                    <AlertCircle size={40} />
                  </div>
                  <div>
                    <h5 className="font-black text-base-content uppercase text-sm tracking-widest">Mode Penagihan</h5>
                    <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter mt-1 max-w-[200px]">
                      Status iuran akan diatur sebagai <b>TERTAGIH</b>. Data ini akan muncul sebagai tagihan yang belum dibayar oleh warga.
                    </p>
                  </div>
                </div>
              )}
              <ErrorMessage name="payment_proof" />
            </div>

            <div className="modal-action mt-auto pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost font-bold rounded-2xl px-6"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary font-black rounded-2xl px-8 shadow-lg shadow-primary/20 gap-2 w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {operationType === 'pay' ? <Save size={18} /> : <Receipt size={18} />}
                    {operationType === 'pay' ? 'Simpan Transaksi' : 'Buat Tagihan'}
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
