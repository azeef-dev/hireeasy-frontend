import api from './client';

export const createBooking = (payload) => api.post('/bookings', payload).then((res) => res.data);

export const getMyBookings = () => api.get('/bookings/my').then((res) => res.data);

export const getProviderBookings = () => api.get('/bookings/provider').then((res) => res.data);

export const getBookingById = (id) => api.get(`/bookings/${id}`).then((res) => res.data);

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status }).then((res) => res.data);
