import api from './api';

const BASE = '/api/products';

export const productService = {
  getAll: () => api.get(BASE).then((r) => r.data),
  getById: (id) => api.get(`${BASE}/${id}`).then((r) => r.data),
  getInStock: () => api.get(`${BASE}/in-stock`).then((r) => r.data),
  getByCategory: (category) => api.get(`${BASE}/category/${encodeURIComponent(category)}`).then((r) => r.data),
  search: (name) => api.get(`${BASE}/search`, { params: { name } }).then((r) => r.data),
  create: (data) => api.post(BASE, data).then((r) => r.data),
  update: (id, data) => api.put(`${BASE}/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`${BASE}/${id}`).then((r) => r.data),
  reduceStock: (id, quantity) =>
    api.put(`${BASE}/${id}/reduce-stock`, null, { params: { quantity } }).then((r) => r.data),
};
