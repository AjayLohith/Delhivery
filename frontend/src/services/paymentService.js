import api from './api';

const BASE = '/api/payment';

export const paymentService = {
  getByUser: (userId) => api.get(`${BASE}/user/${userId}`).then((r) => r.data),
  getByOrder: (orderId) => api.get(`${BASE}/order/${orderId}`).then((r) => r.data),
  verify: (razorpayOrderId, razorpayPaymentId) =>
    api
      .post(`${BASE}/verify`, null, { params: { razorpayOrderId, razorpayPaymentId } })
      .then((r) => r.data),
  getTracking: (orderId) => api.get(`${BASE}/track/${orderId}`).then((r) => r.data),
};
