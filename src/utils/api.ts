import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_API_URL as string;

const api = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Jangan redirect jika error 401 terjadi pada request login
    if (error.response?.status === 401 && originalRequest.url === '/login') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(apiUrl + '/refresh-token', {
            refresh_token: refreshToken,
          });
          const { access_token, refresh_token: newRefresh, user } = response.data;
          Cookies.set('token', access_token, { expires: 1 / 96 });
          if (newRefresh) Cookies.set('refresh_token', newRefresh, { expires: 7 });
          if (user) {
            Cookies.set('user_is_rt', String(user.is_rt ?? false), { expires: 7 });
            Cookies.set('user_name', user.username ?? '', { expires: 7 });
          }
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch {
          Cookies.remove('token');
          Cookies.remove('refresh_token');
          Cookies.remove('user_is_rt');
          Cookies.remove('user_name');
          window.location.href = '/login';
        }
      } else {
        Cookies.remove('token');
        Cookies.remove('user_is_rt');
        Cookies.remove('user_name');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
