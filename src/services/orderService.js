// services/orderService.js
import { api } from '../lib/api';
import { API_URLS, buildUrl } from '../constants/apiUrls';

/**
 * Order Service - Quản lý đơn hàng
 */
export const orderService = {
  /**
   * Lấy danh sách đơn hàng
   * GET /api/order
   * @returns {Promise<Array>}
   */
  async getOrders() {
    try {
      const response = await api.get(API_URLS.ORDER.GET_ALL);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn('Order API không khả dụng:', error.message);
      // Fallback to localStorage
      const savedOrders = localStorage.getItem('orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    }
  },

  /**
   * Lấy chi tiết đơn hàng
   * GET /api/order/:id
   * @param {string} orderId
   * @returns {Promise<Object>}
   */
  async getOrderById(orderId) {
    try {
      const url = buildUrl(API_URLS.ORDER.GET_BY_ID, { id: orderId });
      return await api.get(url);
    } catch (error) {
      console.warn('Order API không khả dụng:', error.message);
      // Fallback to localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      return orders.find(order => order.id === orderId) || null;
    }
  },

  /**
   * Tạo đơn hàng mới
   * POST /api/order
   * @param {Object} orderData
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    try {
      const response = await api.post(API_URLS.ORDER.CREATE, orderData);
      
      // Lưu vào localStorage để backup
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.unshift(response);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      return response;
    } catch (error) {
      console.warn('Order API không khả dụng, lưu local:', error.message);
      
      // Fallback: tạo order local
      const localOrder = {
        id: 'DH' + Date.now().toString().slice(-7),
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.unshift(localOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      return localOrder;
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng
   * PATCH /api/order/:id
   * @param {string} orderId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateOrder(orderId, updateData) {
    try {
      const url = buildUrl(API_URLS.ORDER.UPDATE, { id: orderId });
      const response = await api.patch(url, updateData);
      
      // Cập nhật localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, ...updateData, updatedAt: new Date().toISOString() }
          : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      return response;
    } catch (error) {
      console.warn('Order API không khả dụng, cập nhật local:', error.message);
      
      // Fallback: cập nhật local
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, ...updateData, updatedAt: new Date().toISOString() }
          : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      return updatedOrders.find(order => order.id === orderId);
    }
  },

  /**
   * Xóa đơn hàng
   * DELETE /api/order/:id
   * @param {string} orderId
   * @returns {Promise<Object>}
   */
  async deleteOrder(orderId) {
    try {
      const url = buildUrl(API_URLS.ORDER.DELETE, { id: orderId });
      const response = await api.delete(url);
      
      // Xóa khỏi localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const filteredOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(filteredOrders));
      
      return response;
    } catch (error) {
      console.warn('Order API không khả dụng, xóa local:', error.message);
      
      // Fallback: xóa local
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const filteredOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(filteredOrders));
      
      return { success: true };
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng (convenience method)
   * @param {string} orderId
   * @param {string} status
   * @returns {Promise<Object>}
   */
  async updateOrderStatus(orderId, status) {
    return this.updateOrder(orderId, { status });
  }
};
