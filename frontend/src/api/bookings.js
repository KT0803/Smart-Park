import api from './axiosInstance';

// Domain-specific bookings service
export const bookingsAPI = {
  create:         (data) => api.post('/bookings', data),
  getMy:          (params) => api.get('/bookings/my', { params }),
  cancel:         (id)   => api.put(`/bookings/${id}/cancel`),
  complete:       (id)   => api.put(`/bookings/${id}/complete`),
  getLotBookings: (lotId) => api.get(`/bookings/lot/${lotId}`),
  clearHistory:   ()     => api.delete('/bookings/clear-history'),
};
