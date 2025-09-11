// services/paymentService.js
import { api } from '../lib/api';
import { API_URLS, buildUrl } from '../constants/apiUrls';

/**
 * Payment Service - Quản lý thanh toán
 */
export const paymentService = {
  /**
   * Tạo URL thanh toán VNPay
   * GET /api/payment/create_payment_url
   * @param {string} orderId - ID đơn hàng
   * @param {number} amount - Số tiền thanh toán
   * @returns {Promise<Object>}
   */
  async createPaymentUrl(orderId, amount) {
    try {
      console.log('🔄 Creating payment URL for order:', orderId, 'amount:', amount);
      
      const response = await api.get('/api/payment/create_payment_url', {
        params: { orderId, amount }
      });
      
      console.log('✅ Payment URL created:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating payment URL:', error);
      throw new Error('Không thể tạo URL thanh toán: ' + error.message);
    }
  },

  /**
   * Xử lý callback từ VNPay
   * GET /api/payment/vnpay_return
   * @param {Object} queryParams - Query parameters từ VNPay
   * @returns {Promise<Object>}
   */
  async handleVnpayReturn(queryParams) {
    try {
      console.log('🔄 Handling VNPay return:', queryParams);
      
      const response = await api.get('/api/payment/vnpay_return', {
        params: queryParams
      });
      
      console.log('✅ VNPay return handled:', response);
      return response;
    } catch (error) {
      console.error('❌ Error handling VNPay return:', error);
      throw new Error('Không thể xử lý callback từ VNPay: ' + error.message);
    }
  },

  /**
   * Kiểm tra trạng thái thanh toán
   * @param {string} orderId - ID đơn hàng
   * @returns {Promise<Object>}
   */
  async checkPaymentStatus(orderId) {
    try {
      console.log('🔄 Checking payment status for order:', orderId);
      
      const response = await api.get(buildUrl(API_URLS.ORDER.GET_BY_ID, { id: orderId }));
      
      console.log('✅ Payment status checked:', response);
      return response;
    } catch (error) {
      console.error('❌ Error checking payment status:', error);
      throw new Error('Không thể kiểm tra trạng thái thanh toán: ' + error.message);
    }
  },

  /**
   * Xử lý thanh toán thành công
   * @param {Object} paymentData - Dữ liệu thanh toán
   * @returns {Object}
   */
  handlePaymentSuccess(paymentData) {
    console.log('✅ Payment successful:', paymentData);
    return {
      success: true,
      message: 'Thanh toán thành công',
      data: paymentData
    };
  },

  /**
   * Xử lý thanh toán thất bại
   * @param {Object} paymentData - Dữ liệu thanh toán
   * @returns {Object}
   */
  handlePaymentFailure(paymentData) {
    console.log('❌ Payment failed:', paymentData);
    return {
      success: false,
      message: 'Thanh toán thất bại',
      data: paymentData
    };
  },

  /**
   * Lấy thông tin phương thức thanh toán
   * @returns {Array}
   */
  getPaymentMethods() {
    return [
      {
        value: 'CASH',
        label: 'Tiền mặt',
        description: 'Thanh toán khi nhận hàng',
        icon: '💵'
      },
      {
        value: 'TRANSFER',
        label: 'Chuyển khoản',
        description: 'Chuyển khoản ngân hàng',
        icon: '🏦'
      },
      {
        value: 'BANKING',
        label: 'Thẻ ngân hàng',
        description: 'Thanh toán bằng thẻ',
        icon: '💳'
      },
      {
        value: 'VNPAY',
        label: 'VNPay',
        description: 'Thanh toán qua VNPay',
        icon: '📱'
      }
    ];
  },

  /**
   * Validate thông tin thanh toán
   * @param {Object} paymentData - Dữ liệu thanh toán
   * @returns {Object}
   */
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.orderId) {
      errors.push('ID đơn hàng không được để trống');
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Số tiền thanh toán không hợp lệ');
    }

    if (!paymentData.paymentMethod) {
      errors.push('Phương thức thanh toán không được để trống');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format số tiền hiển thị
   * @param {number} amount - Số tiền
   * @returns {string}
   */
  formatAmount(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  /**
   * Lấy màu sắc theo trạng thái thanh toán
   * @param {string} status - Trạng thái
   * @returns {string}
   */
  getPaymentStatusColor(status) {
    const statusColors = {
      'PENDING': 'orange',
      'CONFIRMED': 'blue',
      'REJECTED': 'red',
      'WAITING_PAYMENT': 'yellow',
      'PAID': 'green',
      'FAILED': 'red',
      'DELIVERY_PROCESSING': 'cyan',
      'DELIVERY_SHIPPING': 'purple',
      'DELIVERY_COMPLETED': 'green',
      'DELIVERY_FAILED': 'red'
    };
    return statusColors[status] || 'default';
  },

  /**
   * Lấy text hiển thị theo trạng thái thanh toán
   * @param {string} status - Trạng thái
   * @returns {string}
   */
  getPaymentStatusText(status) {
    const statusTexts = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'REJECTED': 'Đã hủy',
      'WAITING_PAYMENT': 'Chờ thanh toán',
      'PAID': 'Đã thanh toán',
      'FAILED': 'Thanh toán thất bại',
      'DELIVERY_PROCESSING': 'Đang chuẩn bị hàng',
      'DELIVERY_SHIPPING': 'Đang giao hàng',
      'DELIVERY_COMPLETED': 'Giao hàng thành công',
      'DELIVERY_FAILED': 'Giao hàng thất bại'
    };
    return statusTexts[status] || status;
  }
};

export default paymentService;
