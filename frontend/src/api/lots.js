import api from './axiosInstance';

// Domain-specific lots service (split from monolithic api.js)
// Parking lots API service
export const lotsAPI = {
  getAll: (params) => api.get('/lots', { params: { limit: 100, ...params } }),
  getById: (id) => api.get(`/lots/${id}`),
  create: (data) => api.post('/lots', data),
  update: (id, data) => api.put(`/lots/${id}`, data),
  remove: (id) => api.delete(`/lots/${id}`),
};
