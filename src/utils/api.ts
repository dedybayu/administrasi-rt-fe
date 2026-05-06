import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_API_URL as string;

const api = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Fungsi untuk menghapus cookies dan redirect ke login
const logout = () => {
  Cookies.remove('token');
  Cookies.remove('refresh_token');
  Cookies.remove('user_is_rt');
  Cookies.remove('user_name');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Queue untuk menampung request yang gagal saat sedang refreshing
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Menempelkan Bearer Token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Menangani Token Expired (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Cek apakah request ke auth endpoint agar tidak loop
    const isAuthRequest = originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh-token');

    if (error.response?.status === 401 && !isAuthRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang refresh, masukkan request ini ke queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refresh_token');
      
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        // Panggil API Refresh Token dengan Bearer Refresh Token
        const response = await axios.post(`${apiUrl}/refresh-token`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });

        const { access_token, refresh_token: newRefresh, user } = response.data;
        
        // Simpan data baru ke cookies
        Cookies.set('token', access_token, { expires: 7 });
        if (newRefresh) Cookies.set('refresh_token', newRefresh, { expires: 7 });
        if (user) {
          Cookies.set('user_is_rt', String(user.is_rt ?? false), { expires: 7 });
          Cookies.set('user_name', user.username ?? '', { expires: 7 });
        }

        isRefreshing = false;
        processQueue(null, access_token);

        // Ulangi request original dengan token baru
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
