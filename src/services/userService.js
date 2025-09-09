// services/userService.js
import { api } from '../lib/api';
import { API_URLS, buildUrl } from '../constants/apiUrls';

/**
 * User Service - Quản lý người dùng
 */
export const userService = {
  /**
   * Lấy danh sách tất cả users (Admin only)
   * GET /api/user
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    try {
      const response = await api.get(API_URLS.USER.GET_ALL);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn('User API không khả dụng:', error.message);
      return [];
    }
  },

  /**
   * Lấy thông tin profile user
   * GET /api/user/profile/:id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUserProfile(userId) {
    try {
      const url = buildUrl(API_URLS.USER.GET_PROFILE, { id: userId });
      return await api.get(url);
    } catch (error) {
      console.warn('User API không khả dụng:', error.message);
      return null;
    }
  },

  /**
   * Tạo user mới (Admin only)
   * POST /api/user/create
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    try {
      return await api.post(API_URLS.USER.CREATE, userData);
    } catch (error) {
      console.warn('User API không khả dụng:', error.message);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin user
   * PATCH /api/user/update/:id
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateUser(userId, updateData) {
    try {
      const url = buildUrl(API_URLS.USER.UPDATE, { id: userId });
      return await api.patch(url, updateData);
    } catch (error) {
      console.warn('User API không khả dụng:', error.message);
      throw error;
    }
  },

  /**
   * Xóa user (Admin only)
   * DELETE /api/user/delete/:id
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async deleteUser(userId) {
    try {
      const url = buildUrl(API_URLS.USER.DELETE, { id: userId });
      return await api.delete(url);
    } catch (error) {
      console.warn('User API không khả dụng:', error.message);
      throw error;
    }
  },

  /**
   * Cập nhật profile của user hiện tại
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  async updateCurrentUserProfile(profileData) {
    try {
      // Lấy user ID từ localStorage
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      return await this.updateUser(userId, profileData);
    } catch (error) {
      console.warn('Update profile failed:', error.message);
      throw error;
    }
  }
};
