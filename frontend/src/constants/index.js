// API base URL — all requests go through the API Gateway
export const API_BASE_URL = 'http://localhost:8080';

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  COD_PENDING: 'COD_PENDING',
  COD_DELIVERED: 'COD_DELIVERED',
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

// Storage keys for localStorage
export const STORAGE_KEYS = {
  USER_ID: 'userId',
  USER_EMAIL: 'userEmail',
};

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  KEY_ID: 'rzp_test_T2Npf8ixdFEHQd', // Test key - will work with test cards
  CURRENCY: 'INR',
};
