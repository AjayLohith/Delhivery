// API base URL — all requests go through the API Gateway
export const API_BASE_URL = 'http://localhost:8080';

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

// Product categories (fallback list)
export const DEFAULT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys',
  'Beauty',
  'Automotive',
];

// localStorage keys
export const STORAGE_KEYS = {
  USER_ID: 'ecom_user_id',
  USER_EMAIL: 'ecom_user_email',
};
