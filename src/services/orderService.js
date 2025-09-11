// services/orderService.js
import { api } from '../lib/api';
import { API_URLS, buildUrl } from '../constants/apiUrls';

/**
 * Order Service - Quản lý đơn hàng
 */
export const orderService = {
  /**
   * Lấy danh sách đơn hàng (Admin)
   * GET /api/order
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>}
   */
  async getOrders(params = {}) {
    try {
      console.log('🔄 Loading orders with params:', params);
      
      const response = await api.get(API_URLS.ORDER.GET_ALL, { params });
      
      console.log('📦 Raw orders response:', response);
      
      // Handle different response structures
      if (response.orders && response.pagination) {
        return {
          success: true,
          data: {
            orders: response.orders,
            pagination: response.pagination
          }
        };
      } else if (Array.isArray(response)) {
        return {
          success: true,
          data: {
            orders: response,
            pagination: {
              page: 1,
              limit: response.length,
              total: response.length,
              totalPages: 1
            }
          }
        };
      } else {
        return {
          success: true,
          data: {
            orders: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0
            }
          }
        };
      }
    } catch (error) {
      console.warn('⚠️ Order API không khả dụng:', error.message);
      
      // Fallback to localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      
      return {
        success: false,
        error: error.message,
        data: {
          orders: orders.slice(0, 10), // Limit to 10 for fallback
          pagination: {
            page: 1,
            limit: 10,
            total: orders.length,
            totalPages: Math.ceil(orders.length / 10)
          }
        }
      };
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
      console.log('🔄 Getting order by ID:', orderId);
      
      const url = buildUrl(API_URLS.ORDER.GET_BY_ID, { id: orderId });
      const response = await api.get(url);
      
      console.log('📦 Order details response:', response);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.warn('⚠️ Order API không khả dụng:', error.message);
      
      // Fallback to localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const order = orders.find(order => order.id === orderId) || null;
      
      return {
        success: false,
        error: error.message,
        data: order
      };
    }
  },

  /**
   * Lấy đơn hàng của người dùng
   * GET /api/order/user/:userId
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUserOrders(userId) {
    try {
      console.log('🔄 Getting orders for user:', userId);
      
      const response = await api.get(buildUrl('/api/order/user/:userId', { userId }));
      
      console.log('📦 User orders response:', response);
      
      return {
        success: true,
        data: Array.isArray(response) ? response : []
      };
    } catch (error) {
      console.warn('⚠️ User orders API không khả dụng:', error.message);
      
      // Fallback to localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const userOrders = orders.filter(order => order.customerInfo?.email === userId);
      
      return {
        success: false,
        error: error.message,
        data: userOrders
      };
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
      console.log('🔄 Creating order:', orderData);
      
      // Transform order data to match backend DTO
      const backendOrderData = {
        userId: orderData.customerInfo?.email || 'anonymous',
        items: orderData.items.map(item => ({
          productId: item.id || item._id,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: orderData.paymentMethod || 'CASH',
        total: orderData.total,
        note: orderData.note || ''
      };
      
      console.log('📦 Sending to backend:', backendOrderData);
      
      const response = await api.post(API_URLS.ORDER.CREATE, backendOrderData);
      
      console.log('✅ Order created successfully:', response);
      
      // Lưu vào localStorage để backup
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.unshift(response.order || response);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      return {
        success: true,
        data: response.order || response,
        paymentUrl: response.paymentUrl
      };
    } catch (error) {
      console.warn('⚠️ Order API không khả dụng, lưu local:', error.message);
      
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
      
      return {
        success: false,
        error: error.message,
        data: localOrder
      };
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng (Admin)
   * PUT /api/order/:id/status
   * @param {string} orderId
   * @param {string} status
   * @returns {Promise<Object>}
   */
  async updateOrderStatus(orderId, status) {
    try {
      console.log('🔄 Updating order status:', orderId, status);
      
      const response = await api.put(buildUrl('/api/order/:id/status', { id: orderId }), { status });
      
      console.log('✅ Order status updated:', response);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.warn('⚠️ Order API không khả dụng:', error.message);
      
      // Fallback to localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        
        return {
          success: false,
          error: error.message,
          data: orders[orderIndex]
        };
      }
      
      return {
        success: false,
        error: 'Không tìm thấy đơn hàng'
      };
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
      console.log('🔄 Deleting order:', orderId);
      
      const url = buildUrl(API_URLS.ORDER.DELETE, { id: orderId });
      const response = await api.delete(url);
      
      console.log('✅ Order deleted:', response);
      
      // Xóa khỏi localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const filteredOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(filteredOrders));
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.warn('⚠️ Order API không khả dụng:', error.message);
      
      // Fallback: xóa local
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      const filteredOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(filteredOrders));
      
      return {
        success: false,
        error: error.message,
        data: { message: 'Đơn hàng đã được xóa khỏi local storage' }
      };
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
