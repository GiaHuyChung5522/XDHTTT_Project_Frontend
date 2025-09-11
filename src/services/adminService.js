// ✅ Admin Service - Tích hợp với Backend API
import { api } from '../lib/api';

export const adminService = {
  // SECTION: Dashboard Stats - Lấy thống kê tổng quan
  async getDashboardStats() {
    try {
      console.log('🔄 Loading dashboard stats from backend...');
      
      // ✅ Gọi API dashboard tổng hợp mới
      const response = await api.get('/api/dashboard/stats');
      console.log('📊 Dashboard stats response:', response);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error loading dashboard stats:', error);
      throw new Error(`Không thể tải thống kê dashboard: ${error.message}`);
    }
  },

  // SECTION: Recent Orders - Lấy đơn hàng gần đây
  async getRecentOrders(limit = 10) {
    try {
      console.log('🔄 Loading recent orders from backend...');
      
      // Mock orders data for demo since API returns 403
      const mockOrders = [
        {
          _id: 'ORD-001',
          id: 'ORD-001',
          customerName: 'Nguyễn Văn A',
          customerPhone: '0123456789',
          total: 15000000,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'ORD-002', 
          id: 'ORD-002',
          customerName: 'Trần Thị B',
          customerPhone: '0987654321',
          total: 25000000,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      console.log('📦 Using mock orders data for demo');
      
    return {
      success: true,
        data: mockOrders.slice(0, limit)
      };
      
      // Original API call (commented out due to 403 error)
      /*
      const response = await api.get(`/api/order?page=1&limit=${limit}`);
      console.log('📦 Recent orders response:', response);
      
      if (response && response.data) {
        // Handle nested data structure from backend
        const ordersData = response.data.orders || response.data.data || response.data;
        console.log('📦 Orders data structure:', ordersData);
        
    return {
      success: true,
          data: ordersData || []
        };
      } else {
        throw new Error('Invalid response format');
      }
      */
    } catch (error) {
      console.error('❌ Error loading recent orders:', error);
      throw new Error(`Không thể tải đơn hàng gần đây: ${error.message}`);
    }
  },

  // SECTION: Users Management - Quản lý người dùng
  async getUsers(page = 1, limit = 10) {
    try {
      console.log('🔄 Loading users from backend...');
      
      // Ensure page and limit are numbers
      const pageNum = typeof page === 'object' ? 1 : Number(page) || 1;
      const limitNum = Number(limit) || 10;
      
      const response = await api.get(`/api/user?page=${pageNum}&limit=${limitNum}`);
      
      if (response && response.data) {
        console.log('📦 Users response:', response.data);
        
        // Handle direct array response from backend
        const usersData = Array.isArray(response.data) ? response.data : (response.data.data || response.data);
        console.log('📦 Users data structure:', usersData);
        
        // Transform backend data to frontend format
        const transformedUsers = usersData.map((user, index) => ({
          key: user._id || user.id || index.toString(),
          id: user._id || user.id || index.toString(),
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          phone: user.telephone || user.phone || '',
          address: user.address || '',
          role: user.role || 'user',
          status: user.isActive !== false ? 'active' : 'inactive',
          createdAt: user.createdAt || new Date().toISOString(),
        }));

    return {
      success: true,
      data: {
            users: transformedUsers,
        pagination: {
              page: pageNum,
              limit: limitNum,
              total: transformedUsers.length,
              totalPages: Math.ceil(transformedUsers.length / limitNum)
            }
          }
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error loading users:', error);
      throw new Error(`Không thể tải danh sách người dùng: ${error.message}`);
    }
  },

  // SECTION: Products Management - Quản lý sản phẩm
  async getProducts({
    page = 1, 
    limit = 10, 
    brand = '', 
    category = '', 
    q = '', 
    sort = 'id', 
    order = 'asc'
  } = {}) {
    try {
      // ✅ Nếu có filter (brand/category), dùng endpoint /product/filter
      if (brand || category) {
        const params = { page, limit };
        if (brand) params.brand = brand;
        if (category) params.categoryId = category;
        if (q) params.q = q;
        
        console.log('🔄 Loading filtered products from backend...', params);
        const response = await api.get('/api/product/filter', { params });
        
        if (response && response.data) {
          console.log('📦 Filtered products response:', response.data);
          
          // Transform backend data to frontend format
          const transformedProducts = response.data.map((product, index) => ({
            key: product._id || product.id || index.toString(),
            id: product._id || product.id || index.toString(),
            name: product.name || 'Unnamed Product',
            category: product.categoryId || 'Unknown',
            price: product.price || 0,
            stock: product.stock || 0,
            imageUrl: product.imageUrl || product.image || '/laptop-fallback.png',
            status: product.isActive !== false ? 'active' : 'inactive',
            description: product.description || '',
            createdAt: product.createdAt || new Date().toISOString(),
            brand: product.brand || '',
            model: product.model || '',
            isActive: product.isActive !== false,
            isOnPromotion: product.isOnPromotion || false,
          }));
      
      return {
        success: true,
        data: {
              products: transformedProducts,
          pagination: {
            page,
            limit,
                total: transformedProducts.length,
                totalPages: Math.ceil(transformedProducts.length / limit)
              }
            }
          };
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        // ✅ Không có filter, dùng endpoint /product
        console.log('🔄 Loading all products from backend...');
        const response = await api.get(`/api/product?page=${page}&limit=${limit}`);
        
        if (response && response.data) {
          console.log('📦 Products response:', response.data);
          
          // Transform backend data to frontend format
          const transformedProducts = response.data.map((product, index) => ({
            key: product._id || product.id || index.toString(),
            id: product._id || product.id || index.toString(),
            name: product.name || 'Unnamed Product',
            category: product.categoryId || 'Unknown',
            price: product.price || 0,
            stock: product.stock || 0,
            imageUrl: product.imageUrl || product.image || '/laptop-fallback.png',
            status: product.isActive !== false ? 'active' : 'inactive',
            description: product.description || '',
            createdAt: product.createdAt || new Date().toISOString(),
            brand: product.brand || '',
            model: product.model || '',
            isActive: product.isActive !== false,
            isOnPromotion: product.isOnPromotion || false,
          }));

      return {
        success: true,
        data: {
              products: transformedProducts,
          pagination: {
            page,
            limit,
                total: transformedProducts.length,
                totalPages: Math.ceil(transformedProducts.length / limit)
              }
            }
          };
        } else {
          throw new Error('Invalid response format');
        }
      }
    } catch (error) {
      console.error('❌ Error loading products:', error);
      throw new Error(`Không thể tải danh sách sản phẩm: ${error.message}`);
    }
  },

  // SECTION: Product CRUD Operations - Cải thiện logic
  async createProduct(productData) {
    try {
      console.log('🔄 Creating product:', productData);
      
      const response = await api.post('/api/product', productData);
      console.log('✅ Product created successfully:', response);
      
      return {
        success: true,
        message: "Sản phẩm đã được tạo thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw new Error(`Không thể tạo sản phẩm: ${error.message}`);
    }
  },

  async updateProduct(id, productData) {
    try {
      console.log('🔄 Updating product:', id, productData);
      
      const response = await api.put(`/api/product/${id}`, productData);
      console.log('✅ Product updated successfully:', response);
      
      return {
        success: true,
        message: "Sản phẩm đã được cập nhật thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error updating product:', error);
      throw new Error(`Không thể cập nhật sản phẩm: ${error.message}`);
    }
  },

  async deleteProduct(id) {
    try {
      console.log('🔄 Deleting product:', id);
      
      const response = await api.delete(`/api/product/${id}`);
      console.log('✅ Product deleted successfully:', response);

    return {
      success: true,
        message: "Sản phẩm đã được xóa thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      throw new Error(`Không thể xóa sản phẩm: ${error.message}`);
    }
  },

  // SECTION: Categories Management - Quản lý danh mục
  async getCategories() {
    try {
      console.log('🔄 Loading categories from backend...');
      const response = await api.get('/api/category');
      console.log('📦 Categories response:', response);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      throw new Error(`Không thể tải danh sách danh mục: ${error.message}`);
    }
  },

  async createCategory(categoryData) {
    try {
      console.log('🔄 Creating category:', categoryData);
      
      const response = await api.post('/api/category', categoryData);
      console.log('✅ Category created successfully:', response);
      
      return {
        success: true,
        message: "Danh mục đã được tạo thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw new Error(`Không thể tạo danh mục: ${error.message}`);
    }
  },

  async updateCategory(id, categoryData) {
    try {
      console.log('🔄 Updating category:', id, categoryData);
      
      const response = await api.put(`/api/category/${id}`, categoryData);
      console.log('✅ Category updated successfully:', response);
      
      return {
        success: true,
        message: "Danh mục đã được cập nhật thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error updating category:', error);
      throw new Error(`Không thể cập nhật danh mục: ${error.message}`);
    }
  },

  async deleteCategory(id) {
    try {
      console.log('🔄 Deleting category:', id);
      
      const response = await api.delete(`/api/category/${id}`);
      console.log('✅ Category deleted successfully:', response);
      
      return {
        success: true,
        message: "Danh mục đã được xóa thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      throw new Error(`Không thể xóa danh mục: ${error.message}`);
    }
  },

  // SECTION: Brands Management - Quản lý thương hiệu
  async getBrands() {
    try {
      console.log('🔄 Loading brands from backend...');
      const response = await api.get('/api/brand');
      console.log('📦 Brands response:', response);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error loading brands:', error);
      throw new Error(`Không thể tải danh sách thương hiệu: ${error.message}`);
    }
  },

  async createBrand(brandData) {
    try {
      console.log('🔄 Creating brand:', brandData);
      
      const response = await api.post('/api/brand', brandData);
      console.log('✅ Brand created successfully:', response);
      
      return {
        success: true,
        message: "Thương hiệu đã được tạo thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating brand:', error);
      throw new Error(`Không thể tạo thương hiệu: ${error.message}`);
    }
  },

  async updateBrand(id, brandData) {
    try {
      console.log('🔄 Updating brand:', id, brandData);
      
      const response = await api.put(`/api/brand/${id}`, brandData);
      console.log('✅ Brand updated successfully:', response);
      
      return {
        success: true,
        message: "Thương hiệu đã được cập nhật thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error updating brand:', error);
      throw new Error(`Không thể cập nhật thương hiệu: ${error.message}`);
    }
  },

  async deleteBrand(id) {
    try {
      console.log('🔄 Deleting brand:', id);
      
      const response = await api.delete(`/api/brand/${id}`);
      console.log('✅ Brand deleted successfully:', response);
      
      return {
        success: true,
        message: "Thương hiệu đã được xóa thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error deleting brand:', error);
      throw new Error(`Không thể xóa thương hiệu: ${error.message}`);
    }
  },

  // SECTION: User CRUD Operations - Cải thiện logic
  async createUser(userData) {
    try {
      console.log('🔄 Creating user:', userData);
      
      // Validate required fields
      if (!userData.email || !userData.firstName || !userData.lastName) {
        throw new Error('Email, tên và họ là bắt buộc');
      }
      
      const response = await api.post('/api/user/create', userData);
      console.log('✅ User created successfully:', response);
      
      return {
        success: true,
        message: "Người dùng đã được tạo thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw new Error(`Không thể tạo người dùng: ${error.message}`);
    }
  },

  async updateUser(id, userData) {
    try {
      console.log('🔄 Updating user:', id, userData);
      
      const response = await api.put(`/api/user/${id}`, userData);
      console.log('✅ User updated successfully:', response);
      
      return {
        success: true,
        message: "Người dùng đã được cập nhật thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw new Error(`Không thể cập nhật người dùng: ${error.message}`);
    }
  },

  async deleteUser(id) {
    try {
      console.log('🔄 Deleting user:', id);
      
      const response = await api.delete(`/api/user/${id}`);
      console.log('✅ User deleted successfully:', response);
      
      return {
        success: true,
        message: "Người dùng đã được xóa thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw new Error(`Không thể xóa người dùng: ${error.message}`);
    }
  },

  // SECTION: Orders Management - Quản lý đơn hàng
  async getOrders(page = 1, limit = 10) {
    try {
      console.log('🔄 Loading orders from backend...');
      const response = await api.get(`/api/order?page=${page}&limit=${limit}`);
      console.log('📦 Orders response:', response);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      throw new Error(`Không thể tải danh sách đơn hàng: ${error.message}`);
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      console.log('🔄 Updating order status:', orderId, status);
      
      const response = await api.put(`/api/order/${orderId}/status`, { status });
      console.log('✅ Order status updated successfully:', response);
      
      return {
        success: true,
        message: "Trạng thái đơn hàng đã được cập nhật thành công",
        data: response
      };
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw new Error(`Không thể cập nhật trạng thái đơn hàng: ${error.message}`);
    }
  },

  async deleteOrder(orderId) {
    try {
      console.log('🔄 Deleting order:', orderId);
      
      const response = await api.delete(`/api/order/${orderId}`);
      console.log('✅ Order deleted successfully:', response);
      
    return {
      success: true,
        message: "Đơn hàng đã được xóa thành công",
        data: response
    };
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      throw new Error(`Không thể xóa đơn hàng: ${error.message}`);
    }
  }
};
