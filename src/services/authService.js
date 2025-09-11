// Auth Service - Tích hợp với Backend Auth API
import { api } from '../lib/api';

export const authService = {
  // SECTION: Login - Đăng nhập
  async login(credentials) {
    try {
      console.log('🔄 Logging in user...');
      
      const response = await api.post('/api/auth/login', credentials);
      console.log('✅ Login successful:', response);
      
      // Lưu token vào localStorage
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      
      return {
        success: true,
        data: response,
        message: 'Đăng nhập thành công'
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error(`Đăng nhập thất bại: ${error.message}`);
    }
  },

  // SECTION: Register - Đăng ký
  async register(userData) {
    try {
      console.log('🔄 Registering user...');
      
      const response = await api.post('/api/auth/register', userData);
      console.log('✅ Registration successful:', response);
      
      return {
        success: true,
        data: response,
        message: 'Đăng ký thành công'
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw new Error(`Đăng ký thất bại: ${error.message}`);
    }
  },

  // SECTION: Refresh Token - Làm mới token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      console.log('🔄 Refreshing token...');
      
      const response = await api.post('/api/auth/refresh-token', { token: refreshToken });
      console.log('✅ Token refreshed:', response);
      
      // Cập nhật token mới
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      // Xóa token cũ nếu refresh thất bại
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error(`Làm mới token thất bại: ${error.message}`);
    }
  },

  // SECTION: Forgot Password - Quên mật khẩu
  async forgotPassword(email) {
    try {
      console.log('🔄 Sending forgot password request...');
      
      const response = await api.post('/api/auth/forgot-password', { email });
      console.log('✅ Forgot password request sent:', response);
      
      return {
        success: true,
        data: response,
        message: 'Email khôi phục mật khẩu đã được gửi'
      };
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      throw new Error(`Gửi email khôi phục thất bại: ${error.message}`);
    }
  },

  // SECTION: Verify Code - Xác minh mã
  async verifyCode(userId, code) {
    try {
      console.log('🔄 Verifying code...');
      
      const response = await api.post('/api/auth/verify-code', { userId, code });
      console.log('✅ Code verified:', response);
      
      return {
        success: true,
        data: response,
        message: 'Mã xác minh hợp lệ'
      };
    } catch (error) {
      console.error('❌ Code verification error:', error);
      throw new Error(`Xác minh mã thất bại: ${error.message}`);
    }
  },

  // SECTION: Reset Password - Đặt lại mật khẩu
  async resetPassword(resetData) {
    try {
      console.log('🔄 Resetting password...');
      
      const response = await api.post('/api/auth/reset-password', resetData);
      console.log('✅ Password reset successful:', response);
      
      return {
        success: true,
        data: response,
        message: 'Mật khẩu đã được đặt lại thành công'
      };
    } catch (error) {
      console.error('❌ Password reset error:', error);
      throw new Error(`Đặt lại mật khẩu thất bại: ${error.message}`);
    }
  },

  // SECTION: Logout - Đăng xuất
  async logout() {
    try {
      console.log('🔄 Logging out user...');
      
      // Xóa token khỏi localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw new Error(`Đăng xuất thất bại: ${error.message}`);
    }
  },

  // SECTION: Get Current User - Lấy thông tin user hiện tại
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }
      
      console.log('🔄 Getting current user...');
      
      // Sử dụng token để lấy thông tin user
      const response = await api.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ Current user data:', response);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Get current user error:', error);
      throw new Error(`Không thể lấy thông tin user: ${error.message}`);
    }
  }
};