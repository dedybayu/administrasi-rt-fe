import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost/api/refresh-token', {
            refresh_token: refreshToken,
          });
          
          const { access_token, refresh_token: new_refresh_token, user } = response.data;
          // Update cookies with new tokens
          Cookies.set('token', access_token, { expires: 1/96 }); // 15 mins
          if (new_refresh_token) {
            Cookies.set('refresh_token', new_refresh_token, { expires: 7 });
          }
          // Also update user info if returned
          if (user) {
            Cookies.set('user_is_rt', String(user.is_rt ?? false), { expires: 7 });
            Cookies.set('user_name', user.username ?? '', { expires: 7 });
          }
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
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
