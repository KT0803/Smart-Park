import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('sp_refresh');
        if (!refreshToken) throw new Error('No refresh token');
        const res = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`, { refreshToken });
        const { token, refreshToken: newRefresh } = res.data.data;
        localStorage.setItem('sp_token', token);
        localStorage.setItem('sp_refresh', newRefresh);
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        // Refresh failed – clear session
        localStorage.removeItem('sp_token');
        localStorage.removeItem('sp_refresh');
        localStorage.removeItem('sp_user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Refresh interceptor: on 401, calls /auth/refresh and retries original request
// Axios instance with token injection and refresh interceptor
export default api;
