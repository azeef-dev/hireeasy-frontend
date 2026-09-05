import api from './client';

// Dashboard
export const getDashboardStats = () => api.get('/admin/stats').then((res) => res.data);

// Providers
export const getAdminProviders = (params = {}) =>
  api.get('/admin/providers', { params }).then((res) => res.data);
export const verifyProvider = (id, approve) =>
  api.patch(`/admin/providers/${id}/verify`, { approve }).then((res) => res.data);
export const updateAdminProvider = (id, payload) =>
  api.put(`/admin/providers/${id}`, payload).then((res) => res.data);
export const toggleProviderStatus = (id, isActive) =>
  api.patch(`/admin/providers/${id}/status`, { isActive }).then((res) => res.data);
export const deleteAdminProvider = (id) =>
  api.delete(`/admin/providers/${id}`).then((res) => res.data);

// Customers
export const getAdminCustomers = (params = {}) =>
  api.get('/admin/customers', { params }).then((res) => res.data);
export const updateAdminCustomer = (id, payload) =>
  api.put(`/admin/customers/${id}`, payload).then((res) => res.data);
export const toggleCustomerStatus = (id, isActive) =>
  api.patch(`/admin/customers/${id}/status`, { isActive }).then((res) => res.data);
export const deleteAdminCustomer = (id) =>
  api.delete(`/admin/customers/${id}`).then((res) => res.data);

// Bookings
export const getAdminBookings = (params = {}) =>
  api.get('/admin/bookings', { params }).then((res) => res.data);
export const adminUpdateBookingStatus = (id, status) =>
  api.patch(`/admin/bookings/${id}/status`, { status }).then((res) => res.data);
export const deleteAdminBooking = (id) =>
  api.delete(`/admin/bookings/${id}`).then((res) => res.data);

// Reviews
export const getAdminReviews = (params = {}) =>
  api.get('/admin/reviews', { params }).then((res) => res.data);
export const deleteAdminReview = (id) =>
  api.delete(`/admin/reviews/${id}`).then((res) => res.data);

// Admins (Super Admin only)
export const getAdmins = () => api.get('/admin/admins').then((res) => res.data);
export const createAdmin = (payload) => api.post('/admin/admins', payload).then((res) => res.data);
export const updateAdmin = (id, payload) => api.put(`/admin/admins/${id}`, payload).then((res) => res.data);
export const toggleAdminStatus = (id, isActive) =>
  api.patch(`/admin/admins/${id}/status`, { isActive }).then((res) => res.data);
export const resetAdminPassword = (id, password) =>
  api.patch(`/admin/admins/${id}/password`, { password }).then((res) => res.data);
export const deleteAdmin = (id) => api.delete(`/admin/admins/${id}`).then((res) => res.data);