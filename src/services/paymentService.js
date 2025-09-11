// Payment Service - Tích hợp với Backend Payment API
import { api } from '../lib/api';
import { formatCurrency } from '../utils/number';

export const paymentService = {
  // SECTION: Format Amount - Format số tiền
  formatAmount(amount) {
    if (!amount || isNaN(amount)) {
      return '0 ₫';
    }
    
    return formatCurrency(amount);
  },

  // SECTION: Create Payment URL - Tạo URL thanh toán VNPay
  async createPaymentUrl(orderId, amount) {
    try {
      console.log('🔄 Creating payment URL...', { orderId, amount });
      
      const response = await api.get('/api/payment/create_payment_url', {
        params: { orderId, amount }
      });
      
      console.log('✅ Payment URL created:', response);
      
      return {
        success: true,
        data: response,
        paymentUrl: response.url
      };
    } catch (error) {
      console.error('❌ Create payment URL error:', error);
      throw new Error(`Không thể tạo URL thanh toán: ${error.message}`);
    }
  },

  // SECTION: Handle VNPay Return - Xử lý callback từ VNPay
  async handleVnpayReturn(queryParams) {
    try {
      console.log('🔄 Handling VNPay return...', queryParams);
      
      const response = await api.get('/api/payment/vnpay_return', {
        params: queryParams
      });
      
      console.log('✅ VNPay return handled:', response);
      
      return {
        success: true,
        data: response,
        message: response.message
      };
    } catch (error) {
      console.error('❌ VNPay return error:', error);
      throw new Error(`Xử lý callback VNPay thất bại: ${error.message}`);
    }
  },

  // SECTION: Process Payment - Xử lý thanh toán
  async processPayment(orderId, amount) {
    try {
      console.log('🔄 Processing payment...', { orderId, amount });
      
      // Tạo URL thanh toán
      const paymentResult = await this.createPaymentUrl(orderId, amount);
      
      if (paymentResult.success && paymentResult.paymentUrl) {
        // Redirect đến trang thanh toán VNPay
        window.location.href = paymentResult.paymentUrl;
        
        return {
          success: true,
          message: 'Đang chuyển hướng đến trang thanh toán...',
          paymentUrl: paymentResult.paymentUrl
        };
      } else {
        throw new Error('Không thể tạo URL thanh toán');
      }
    } catch (error) {
      console.error('❌ Process payment error:', error);
      throw new Error(`Xử lý thanh toán thất bại: ${error.message}`);
    }
  },

  // SECTION: Verify Payment - Xác minh thanh toán
  async verifyPayment(queryParams) {
    try {
      console.log('🔄 Verifying payment...', queryParams);
      
      const result = await this.handleVnpayReturn(queryParams);
      
      if (result.success) {
        const isSuccess = result.message.includes('thành công');
        
        return {
          success: true,
          isPaymentSuccess: isSuccess,
          message: result.message,
          data: result.data
        };
      } else {
        return {
          success: false,
          isPaymentSuccess: false,
          message: 'Thanh toán thất bại'
        };
      }
    } catch (error) {
      console.error('❌ Verify payment error:', error);
      return {
        success: false,
        isPaymentSuccess: false,
        message: `Xác minh thanh toán thất bại: ${error.message}`
      };
    }
  },

  // SECTION: Get Payment Status - Lấy trạng thái thanh toán
  async getPaymentStatus(orderId) {
    try {
      console.log('🔄 Getting payment status...', orderId);
      
      // Có thể implement API để check status từ backend
      // Hiện tại return mock data
      return {
        success: true,
        data: {
          orderId,
          status: 'pending',
          message: 'Đang xử lý thanh toán'
        }
      };
    } catch (error) {
      console.error('❌ Get payment status error:', error);
      throw new Error(`Không thể lấy trạng thái thanh toán: ${error.message}`);
    }
  }
};