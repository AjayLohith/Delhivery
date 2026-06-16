import api from './api';

const BASE = '/api/cart';

export const cartService = {
  getCart: (userId) => api.get(`${BASE}/${userId}`).then((r) => r.data),
  addToCart: (userId, item) => api.post(`${BASE}/${userId}/add`, item).then((r) => r.data),
  removeItem: (userId, productId) =>
    api.delete(`${BASE}/${userId}/remove/${productId}`).then((r) => r.data),
  clearCart: (userId) => api.delete(`${BASE}/${userId}/clear`).then((r) => r.data),
  checkout: (userId, checkoutRequest) =>
    api.post(`${BASE}/${userId}/checkout`, checkoutRequest).then((r) => r.data),
};
