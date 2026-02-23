import api from './axiosInstance';

// Bookings API service
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: (params) => api.get('/bookings/my', { params }),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  complete: (id) => api.put(`/bookings/${id}/complete`),
  getLotBookings: (lotId) => api.get(`/bookings/lot/${lotId}`),
};
