// Orders API - Skeleton
import { apiClient } from './client';

export const ordersAPI = {
  getOrders: () => apiClient.get('/orders'),
  getOrder: (id: string) => apiClient.get(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => apiClient.put(`/orders/${id}/status`, { status }),
  getOrderAnalytics: () => apiClient.get('/orders/analytics')
};
