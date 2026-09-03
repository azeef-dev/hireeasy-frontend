import api from './client';

export const getProvidersForReview = (status = 'pending') =>
  api.get('/admin/providers', { params: { status } }).then((res) => res.data);

export const verifyProvider = (id, approve) =>
  api.patch(`/admin/providers/${id}/verify`, { approve }).then((res) => res.data);

export const getAllBookings = (status) =>
  api.get('/admin/bookings', { params: status ? { status } : {} }).then((res) => res.data);

export const getAllUsers = () => api.get('/admin/users').then((res) => res.data);

export const createAdmin = (payload) => api.post('/admin/create-admin', payload).then((res) => res.data);
