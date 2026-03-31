import api from './axiosInstance';

export const adminAPI = {
  getAnalytics:    ()     => api.get('/admin/analytics'),
  getStateRevenue: ()     => api.get('/admin/state-revenue'),
  getUsers:        ()     => api.get('/admin/users'),
  deleteUser:      (id)   => api.delete(`/admin/users/${id}`),
  createLot:       (data) => api.post('/admin/lots', data),
};
