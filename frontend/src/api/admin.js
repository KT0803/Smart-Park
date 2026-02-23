import api from './axiosInstance';

// Driver and admin API services
export const driversAPI = {
  getAll: () => api.get('/drivers'),
  getMyAssignments: () => api.get('/drivers/assignments'),
  assign: (bookingId, driverId) => api.put(`/drivers/assign/${bookingId}`, { driverId }),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  approveDriver: (id, isApproved) => api.put(`/admin/drivers/${id}/approve`, { isApproved }),
  getAnalytics: () => api.get('/admin/analytics'),
};
