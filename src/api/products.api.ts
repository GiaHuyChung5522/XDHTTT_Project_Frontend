// Products API - Real implementation
import { apiClient } from './client';

export const productsAPI = {
  // Get all products
  getProducts: (params?: { page?: number; limit?: number; brand?: string; category?: string }) => 
    apiClient.get('/product', { params }),
  
  // Get product by ID
  getProduct: (id: string) => 
    apiClient.get(`/product/${id}`),
  
  // Create new product
  createProduct: (data: any) => 
    apiClient.post('/product', data),
  
  // Update product
  updateProduct: (id: string, data: any) => 
    apiClient.patch(`/product/${id}`, data),
  
  // Delete product
  deleteProduct: (id: string) => 
    apiClient.delete(`/product/${id}`),
  
  // Get filtered products
  getFilteredProducts: (params: { page?: number; limit?: number; brand?: string; category?: string }) => 
    apiClient.get('/product/filter', { params }),
  
  // Get product categories
  getCategories: () => 
    apiClient.get('/product/categories'),
  
  // Get product brands
  getBrands: () => 
    apiClient.get('/product/brands'),
  
  // Get products with cursor pagination
  getProductsCursor: (cursor?: string, limit?: number) => 
    apiClient.get('/product/cursor', { params: { cursor, limit } }),
  
  // Get product analytics (if available)
  getProductAnalytics: () => 
    apiClient.get('/product/analytics')
};
