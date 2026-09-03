import api from './client';

export const createReview = (payload) => api.post('/reviews', payload).then((res) => res.data);

export const getProviderReviews = (providerId) =>
  api.get(`/reviews/provider/${providerId}`).then((res) => res.data);
