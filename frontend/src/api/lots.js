import api from './axiosInstance';

// Parking lots API service
export const lotsAPI = {
  getAll: (params) => api.get('/lots', { params }),
  getById: (id) => api.get(`/lots/${id}`),
  create: (data) => api.post('/lots', data),
  update: (id, data) => api.put(`/lots/${id}`, data),
  remove: (id) => api.delete(`/lots/${id}`),
};
