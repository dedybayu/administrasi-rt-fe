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
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Building2 size={32} className="text-primary-content" />
          </div>
          <h1 className="text-3xl font-bold text-primary">
            E-RT Digital
          </h1>
          <p className="text-base-content/60 font-medium mt-1">
            Administrasi Lingkungan Modern
          </p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-8">
            <h2 className="card-title text-2xl font-bold mb-1">Selamat Datang</h2>
            <p className="text-base-content/50 text-sm mb-6">Silakan masuk untuk melanjutkan</p>

            {/* Error Alert */}
            {error && (
              <div role="alert" className="alert alert-error mb-6 py-3">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Username</span>
                </label>
                <label className="input input-bordered flex items-center gap-3 w-full">
                  <User size={18} className="text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Masukkan username"
                    className="grow"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                  <a href="#" className="label-text-alt link link-primary">Lupa Password?</a>
                </label>
                <label className="input input-bordered flex items-center gap-3 w-full">
                  <Lock size={18} className="text-base-content/40" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="grow"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-4"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    Masuk Sekarang
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="divider text-xs text-base-content/30 mt-8">BANTUAN</div>

            <p className="text-center text-sm text-base-content/50">
              Belum punya akun?{' '}
              <a href="#" className="link link-primary font-semibold">Hubungi Ketua RT</a>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-base-content/30 text-xs mt-8">
          © 2026 E-RT Digital Ecosystem
        </p>
      </div>
    </main>
  );
}
