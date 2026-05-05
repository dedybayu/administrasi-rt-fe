import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import api from '../utils/api';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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
      setError(
        err.response?.data?.error ||
          'Login gagal. Periksa kembali username dan password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body gap-6">

          {/* Header */}
          <div className="flex flex-col items-center gap-3 pb-2">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <LogIn size={32} className="text-primary-content" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Selamat Datang</h1>
              <p className="text-base-content/60 text-sm mt-1">
                Masuk ke Sistem Administrasi RT
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Username */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Username</span>
              </div>
              <label className="input input-bordered flex items-center gap-2 w-full">
                <User size={16} className="text-base-content/50" />
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  className="grow"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
            </label>

            {/* Password */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Password</span>
              </div>
              <label className="input input-bordered flex items-center gap-2 w-full">
                <Lock size={16} className="text-base-content/50" />
                <input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="grow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </label>

            {/* Error Alert */}
            {error && (
              <div role="alert" className="alert alert-error">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
