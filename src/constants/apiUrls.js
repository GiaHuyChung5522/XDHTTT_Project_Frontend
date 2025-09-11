// API URLs cho Frontend - Cập nhật theo Backend
export const API_URLS = {
  // Auth APIs
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_CODE: '/api/auth/verify-code',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  // Product APIs (Admin & Public)
  PRODUCT: {
    // Public APIs
    GET_ALL: '/api/public/product',
    GET_BY_ID: '/api/public/product/:id',
    FILTER: '/api/public/product/filter',
    CURSOR: '/api/public/product/cursor',
    
    // Admin APIs (require auth)
    CREATE: '/api/product',
    UPDATE: '/api/product/:id',
    DELETE: '/api/product/:id',
    UPDATE_STOCK: '/api/product/:id/stock',
    GET_CATEGORIES: '/api/product/categories',
    GET_BRANDS: '/api/product/brands',
    TEST: '/api/product/test',
  },

  // Category APIs
  CATEGORY: {
    GET_ALL: '/api/category',
    GET_BY_ID: '/api/category/:id',
    CREATE: '/api/category',
    UPDATE: '/api/category/:id',
    DELETE: '/api/category/:id',
  },

  // User APIs (Admin)
  USER: {
    GET_ALL: '/api/user',
    GET_BY_ID: '/api/user/:id',
    CREATE: '/api/user',
    UPDATE: '/api/user/:id',
    DELETE: '/api/user/:id',
    GET_PROFILE: '/api/user/profile',
  },

  // Order APIs
  ORDER: {
    GET_ALL: '/api/order',
    GET_BY_ID: '/api/order/:id',
    CREATE: '/api/order',
    UPDATE: '/api/order/:id',
    DELETE: '/api/order/:id',
    UPDATE_STATUS: '/api/order/:id/status',
  },

  // Dashboard APIs (Admin only)
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    REVENUE: '/api/dashboard/revenue',
    PENDING_ORDERS: '/api/dashboard/pending-orders',
    TOTAL_ORDERS: '/api/dashboard/total-orders',
    TOTAL_USERS: '/api/dashboard/total-users',
    TOTAL_PRODUCTS: '/api/dashboard/total-products',
  },

  // Payment APIs
  PAYMENT: {
    CREATE_PAYMENT_URL: '/api/payment/create_payment_url',
    VNPAY_RETURN: '/api/payment/vnpay_return',
  },
};

// Helper function để thay thế parameters trong URL
export const buildUrl = (url, params = {}) => {
  let builtUrl = url;
  Object.keys(params).forEach(key => {
    builtUrl = builtUrl.replace(`:${key}`, String(params[key]));
  });
  return builtUrl;
};

// Example usage:
// buildUrl(API_URLS.PRODUCT.GET_BY_ID, { id: 123 }) => '/api/product/123'
// buildUrl(API_URLS.USER.GET_PROFILE, { id: 'user123' }) => '/api/user/profile/user123'
