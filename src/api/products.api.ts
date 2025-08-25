// Products API - Skeleton
import { apiClient } from './client';

export const productsAPI = {
  getProducts: () => apiClient.get('/products'),
  getProduct: (id: string) => apiClient.get(`/products/${id}`),
  createProduct: (data: any) => apiClient.post('/products', data),
  updateProduct: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
  deleteProduct: (id: string) => apiClient.delete(`/products/${id}`),
  getProductAnalytics: () => apiClient.get('/products/analytics')
};
