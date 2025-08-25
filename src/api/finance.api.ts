// Finance API - Skeleton
import { apiClient } from './client';

export const financeAPI = {
  getDailyMetrics: () => apiClient.get('/finance/daily'),
  getMonthlyMetrics: () => apiClient.get('/finance/monthly'),
  getRevenueAnalytics: () => apiClient.get('/finance/revenue'),
  getProfitAnalytics: () => apiClient.get('/finance/profit')
};
