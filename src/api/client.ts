// API Client - Real implementation with axios
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Base configuration
const baseURL = 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm auth token
apiClient.interceptors.request.use(
  (config) => {
    try {
      // Lấy token từ localStorage
      const authRaw = localStorage.getItem('auth');
      if (authRaw) {
        const { token, accessToken } = JSON.parse(authRaw);
        const bearer = token || accessToken;
        if (bearer) {
          config.headers.Authorization = `Bearer ${bearer}`;
        }
      }
    } catch (error) {
      console.warn('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Xử lý lỗi 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Thử refresh token
        const { refreshToken } = await import('../services/authService');
        await refreshToken();
        
        // Retry request với token mới
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };
