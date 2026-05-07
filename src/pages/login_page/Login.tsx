import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, Building2, ArrowRight } from 'lucide-react';
import Cookies from 'js-cookie';
import api from '../../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/login', { username, password });
      const { access_token, refresh_token, user } = response.data;

      Cookies.set('token', access_token, { expires: 1 / 96 });
      Cookies.set('refresh_token', refresh_token, { expires: 7 });
      Cookies.set('user_is_rt', String(user?.is_rt ?? false), { expires: 7 });
      Cookies.set('user_name', user?.username ?? username, { expires: 7 });

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.error ||
        err.response?.data?.message ||
        'Username atau password salah. Silakan coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-md relative">
        {/* Decorative background blobs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

        {/* Logo/Brand Section */}
        <div className="text-center mb-10 flex flex-col items-center relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/40 group hover:rotate-6 transition-transform duration-500">
            <Building2 size={40} className="text-primary-content" />
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            E-RT Digital
          </h1>
          <p className="text-base-content/50 font-bold mt-2 uppercase tracking-widest text-[10px]">
            Sistem Administrasi Lingkungan
          </p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100 shadow-2xl rounded-[2.5rem] border border-base-300 relative z-10 overflow-hidden">
          {/* Top accent line */}
          <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary" />
          
          <div className="card-body p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Selamat Datang</h2>
              <p className="text-base-content/50 font-medium text-sm">Akses portal administrasi RT wilayah Anda.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div role="alert" className="alert alert-error mb-8 rounded-2xl border-none text-white shadow-lg shadow-error/20 font-bold py-4">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-black text-xs uppercase tracking-widest text-base-content/40">Username</span>
                </label>
                <label className="input input-bordered h-14 rounded-2xl flex items-center gap-4 w-full border-base-300 focus-within:border-primary transition-all">
                  <User size={20} className="text-base-content/30" />
                  <input
                    type="text"
                    placeholder="Contoh: ketuart"
                    className="grow font-bold text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <div className="flex justify-between items-center mb-1">
                  <label className="label py-1">
                    <span className="label-text font-black text-xs uppercase tracking-widest text-base-content/40">Password</span>
                  </label>
                </div>
                <label className="input input-bordered h-14 rounded-2xl flex items-center gap-4 w-full border-base-300 focus-within:border-primary transition-all">
                  <Lock size={20} className="text-base-content/30" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="grow font-bold tracking-widest"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary h-14 rounded-2xl w-full mt-6 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/30"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    Masuk Ke Portal
                    <ArrowRight size={20} className="ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="divider text-[10px] font-black uppercase tracking-[0.2em] text-base-content/20 my-10">Pusat Bantuan</div>

            <p className="text-center text-sm font-medium text-base-content/60">
              Belum terdaftar?{' '}
              <a href="#" className="text-primary font-black hover:underline">Hubungi Ketua RT</a>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-col items-center gap-4 mt-16">

          <p className="text-base-content/20 text-[10px] font-bold uppercase tracking-widest">
            © 2026 E-RT Digital Ecosystem
          </p>
        </div>
      </div>
    </main>
  );
}
