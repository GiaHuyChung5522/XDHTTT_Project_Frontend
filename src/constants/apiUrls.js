// API URLs cho Frontend
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

  // Product APIs
  PRODUCT: {
    GET_ALL: '/api/product',
    GET_BY_ID: '/api/product/:id',
    CREATE: '/api/product',
    UPDATE: '/api/product/:id',
    DELETE: '/api/product/:id',
    FILTER: '/api/product/filter',
    CATEGORIES: '/api/product/categories',
    BRANDS: '/api/product/brands',
    CURSOR: '/api/product/cursor',
  },

  // User APIs
  USER: {
    GET_ALL: '/api/user',
    GET_PROFILE: '/api/user/profile/:id',
    CREATE: '/api/user/create',
    UPDATE: '/api/user/update/:id',
    DELETE: '/api/user/delete/:id',
  },

  // Dashboard APIs (Admin only)
  DASHBOARD: {
    REVENUE: '/api/dashboard/revenue',
    PENDING_ORDERS: '/api/dashboard/pending-orders',
    TOTAL_ORDERS: '/api/dashboard/total-orders',
    TOTAL_USERS: '/api/dashboard/total-users',
    TOTAL_PRODUCTS: '/api/dashboard/total-products',
  },

  // Order APIs
  ORDER: {
    GET_ALL: '/api/order',
    GET_BY_ID: '/api/order/:id',
    CREATE: '/api/order',
    UPDATE: '/api/order/:id',
    DELETE: '/api/order/:id',
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
