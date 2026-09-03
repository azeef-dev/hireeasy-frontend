import api from './client';

export const getProviders = (params = {}) => api.get('/providers', { params }).then((res) => res.data);

export const getProviderById = (id) => api.get(`/providers/${id}`).then((res) => res.data);

export const getCategories = () => api.get('/providers/meta/categories').then((res) => res.data);

export const updateProviderProfile = (payload) =>
  api.put('/providers/profile', payload).then((res) => res.data);
