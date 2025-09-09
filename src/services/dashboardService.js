// services/dashboardService.js
import { api } from '../lib/api';
import { API_URLS } from '../constants/apiUrls';

/**
 * Dashboard Service - Gọi các API dashboard cho admin
 */
export const dashboardService = {
  /**
   * Lấy tổng doanh thu trong tháng
   * GET /api/dashboard/revenue
   * @returns {Promise<{total: number}>}
   */
  async getTotalRevenue() {
    try {
      const response = await api.get(API_URLS.DASHBOARD.REVENUE);
      return response;
    } catch (error) {
      console.warn('Dashboard API không khả dụng:', error.message);
      // Fallback data
      return { total: 0 };
    }
  },

  /**
   * Lấy danh sách đơn hàng chờ xử lý
   * GET /api/dashboard/pending-orders
   * @returns {Promise<Array>}
   */
  async getPendingOrders() {
    try {
      const response = await api.get(API_URLS.DASHBOARD.PENDING_ORDERS);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn('Dashboard API không khả dụng:', error.message);
      // Fallback data
      return [];
    }
  },

  /**
   * Lấy tổng số đơn hàng
   * GET /api/dashboard/total-orders
   * @returns {Promise<{total: number}>}
   */
  async getTotalOrders() {
    try {
      const response = await api.get(API_URLS.DASHBOARD.TOTAL_ORDERS);
      return response;
    } catch (error) {
      console.warn('Dashboard API không khả dụng:', error.message);
      // Fallback data
      return { total: 0 };
    }
  },

  /**
   * Lấy tổng số người dùng
   * GET /api/dashboard/total-users
   * @returns {Promise<{total: number}>}
   */
  async getTotalUsers() {
    try {
      const response = await api.get(API_URLS.DASHBOARD.TOTAL_USERS);
      return response;
    } catch (error) {
      console.warn('Dashboard API không khả dụng:', error.message);
      // Fallback data
      return { total: 0 };
    }
  },

  /**
   * Lấy tổng số sản phẩm
   * GET /api/dashboard/total-products
   * @returns {Promise<{total: number}>}
   */
  async getTotalProducts() {
    try {
      const response = await api.get(API_URLS.DASHBOARD.TOTAL_PRODUCTS);
      return response;
    } catch (error) {
      console.warn('Dashboard API không khả dụng:', error.message);
      // Fallback data
      return { total: 0 };
    }
  },

  /**
   * Lấy tất cả dữ liệu dashboard
   * @returns {Promise<Object>}
   */
  async getAllDashboardData() {
    try {
      const [revenue, pendingOrders, totalOrders, totalUsers, totalProducts] = await Promise.all([
        this.getTotalRevenue(),
        this.getPendingOrders(),
        this.getTotalOrders(),
        this.getTotalUsers(),
        this.getTotalProducts(),
      ]);

      return {
        revenue: revenue.total,
        pendingOrders: pendingOrders.length,
        totalOrders: totalOrders.total,
        totalUsers: totalUsers.total,
        totalProducts: totalProducts.total,
      };
    } catch (error) {
      console.warn('Dashboard API không khả dụng:', error.message);
      // Fallback data
      return {
        revenue: 0,
        pendingOrders: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
      };
    }
  },
};
