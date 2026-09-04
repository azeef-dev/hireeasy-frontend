import api from './client';

export const registerUser = (payload) => api.post('/auth/register', payload).then((res) => res.data);

export const loginUser = (payload) => api.post('/auth/login', payload).then((res) => res.data);

export const getMe = () => api.get('/auth/me').then((res) => res.data);

export const forgotPassword = (email) =>
    api.post('/auth/forgot-password', { email }).then((res) => res.data);

export const resetPassword = (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }).then((res) => res.data);