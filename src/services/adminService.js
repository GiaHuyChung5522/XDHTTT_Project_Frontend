// ✅ Admin Service - Tích hợp với Backend API
import { api } from '../lib/api';
import { 
  adminStats, 
  recentOrders, 
  topProducts, 
  userAnalytics, 
  productCategories 
} from '../data/adminMockData';

// Simulate API delay cho mock data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
      console.warn('Backend API không khả dụng, sử dụng mock data');
      
      // Fallback to mock data
      return {
        success: true,
        data: {
          totalRevenue: 0,
          pendingOrders: 0,
          totalOrders: 0,
          completedOrders: 0,
          totalUsers: 0,
          totalProducts: 0,
          uniqueCustomers: 0
        }
      };
    }
  },

  // Recent Orders
  async getRecentOrders(limit = 10) {
    try {
      console.log('🔄 Loading recent orders from backend...');
      const response = await api.get(`/api/order?limit=${limit}`);
      
      console.log('📦 Recent orders response:', response);
      
      // Transform backend data to frontend format
      const ordersData = response?.orders || response || [];
      const transformedOrders = ordersData.map((order, index) => ({
        key: order._id || order.id || index.toString(),
        id: order._id || order.id || index.toString(),
        customerName: order.userId?.firstName + ' ' + order.userId?.lastName || 'Khách hàng',
        customerPhone: order.userId?.phone || 'N/A',
        items: order.items?.map(item => ({
          name: item.productId?.name || 'Sản phẩm',
          quantity: item.quantity || 1,
          price: item.price || 0
        })) || [],
        total: order.total || 0,
        status: order.status || 'PENDING',
        paymentMethod: order.paymentMethod || 'CASH',
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: order.updatedAt || new Date().toISOString(),
      }));
      
      console.log(`✅ Loaded ${transformedOrders.length} recent orders`);
      
      return {
        success: true,
        data: transformedOrders
      };
    } catch (error) {
      console.error('❌ Error loading recent orders:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Top Products
  async getTopProducts(limit = 5) {
    await delay(300);
    return {
      success: true,
      data: topProducts.slice(0, limit)
    };
  },

  // User Analytics
  async getUserAnalytics() {
    await delay(400);
    return {
      success: true,
      data: userAnalytics
    };
  },

  // Product Categories
  async getProductCategories() {
    await delay(200);
    return {
      success: true,
      data: productCategories
    };
  },

  // Mock Users Data
  async getUsers(page = 1, limit = 10) {
    await delay(400);
    const mockUsers = [
      {
        id: 1,
        name: "Admin Phuoc",
        email: "admin@gmail.com",
        role: "admin",
        status: "active",
        createdAt: "2024-01-01",
        lastLogin: "2024-01-15"
      },
      {
        id: 2,
        name: "Staff User",
        email: "staff@example.com",
        role: "staff",
        status: "active",
        createdAt: "2024-01-02",
        lastLogin: "2024-01-14"
      },
      {
        id: 3,
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        status: "active",
        createdAt: "2024-01-03",
        lastLogin: "2024-01-13"
      },
      {
        id: 4,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        status: "inactive",
        createdAt: "2024-01-04",
        lastLogin: "2024-01-10"
      }
    ];

    return {
      success: true,
      data: {
        users: mockUsers,
        pagination: {
          page,
          limit,
          total: mockUsers.length,
          totalPages: Math.ceil(mockUsers.length / limit)
        }
      }
    };
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
        if (category) params.category = category;
        
        const response = await api.get('/api/product/filter', params);
        
        // ✅ Backend trả về: { data, total, page, limit, totalPages }
        return {
          success: true,
          data: {
            products: response.data || [],
            pagination: {
              page: response.page || page,
              limit: response.limit || limit,
              total: response.total || 0,
              totalPages: response.totalPages || 0
            }
          }
        };
      }
      
      // ✅ Nếu không có filter, dùng endpoint /api/product (lấy tất cả)
      const response = await api.get('/api/product');
      
      // ✅ Backend trả về object với {data, total, page, limit, totalPages}
      const allProducts = response.data || [];
      
      // ✅ Filter local nếu có search query
      let filteredProducts = allProducts;
      if (q) {
        const searchTerm = q.toLowerCase();
        filteredProducts = allProducts.filter(product => 
          (product.name || '').toLowerCase().includes(searchTerm) ||
          (product.description || '').toLowerCase().includes(searchTerm)
        );
      }
      
      // ✅ Pagination local
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const products = filteredProducts.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: {
          products: products,
          pagination: {
            page,
            limit,
            total: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / limit)
          }
        }
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      
      // Fallback to mock data
      await delay(400);
      const mockProducts = [
        {
          id: 1,
          name: "Laptop Dell XPS 13",
          category: "Laptop Văn phòng",
          price: 25000000,
          stock: 15,
          image: "/src/assets/img/sanpham1.jpg",
          status: "active",
          createdAt: "2024-01-01"
        },
        {
          id: 2,
          name: "MacBook Pro M2",
          category: "Laptop Đồ họa",
          price: 45000000,
          stock: 8,
          image: "/src/assets/img/sanpham1.jpg",
          status: "active",
          createdAt: "2024-01-02"
        },
        {
          id: 3,
          name: "Laptop Asus ROG",
          category: "Laptop Gaming",
          price: 32000000,
          stock: 12,
          image: "/src/assets/img/sanpham1.jpg",
          status: "active",
          createdAt: "2024-01-03"
        },
        {
          id: 4,
          name: "Laptop HP Pavilion",
          category: "Laptop Văn phòng",
          price: 18000000,
          stock: 20,
          image: "/src/assets/img/sanpham1.jpg",
          status: "inactive",
          createdAt: "2024-01-04"
        }
      ];

      return {
        success: true,
        data: {
          products: mockProducts,
          pagination: {
            page,
            limit,
            total: mockProducts.length,
            totalPages: Math.ceil(mockProducts.length / limit)
          }
        }
      };
    }
  },

  // SECTION: Product CRUD Operations
  async createProduct(productData) {
    try {
      const response = await api.post('/api/product', productData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/api/product/${productId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // SECTION: Product with Image Upload
  async createProductWithImage(formData) {
    try {
      console.log('📤 Creating product with image upload...');
      // Let axios automatically set Content-Type with boundary
      const response = await api.post('/api/product', formData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error creating product with image:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async updateProductWithImage(productId, formData) {
    try {
      console.log('📤 Updating product with image upload...', productId);
      console.log('📤 FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Let axios automatically set Content-Type with boundary
      const response = await api.patch(`/api/product/${productId}`, formData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error updating product with image:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getProductById(productId) {
    try {
      const response = await api.get(`/api/product/${productId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error getting product:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getProductCategories() {
    try {
      const response = await api.get('/api/product/categories');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error getting categories:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getProductBrands() {
    try {
      const response = await api.get('/api/product/brands');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error getting brands:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // SECTION: Category Management - Quản lý danh mục
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
      console.error('❌ Error getting categories:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async createCategory(categoryData) {
    try {
      console.log('🔄 Creating category:', categoryData);
      const response = await api.post('/api/category', categoryData);
      console.log('✅ Category created:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async updateCategory(id, categoryData) {
    try {
      console.log('🔄 Updating category:', id, categoryData);
      const response = await api.patch(`/api/category/${id}`, categoryData);
      console.log('✅ Category updated:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error updating category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async deleteCategory(id) {
    try {
      console.log('🔄 Deleting category:', id);
      const response = await api.delete(`/api/category/${id}`);
      console.log('✅ Category deleted:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // SECTION: Brand Management - Quản lý thương hiệu
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
      console.error('❌ Error getting brands:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async createBrand(brandData) {
    try {
      console.log('🔄 Creating brand:', brandData);
      const response = await api.post('/api/brand', brandData);
      console.log('✅ Brand created:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating brand:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async updateBrand(id, brandData) {
    try {
      console.log('🔄 Updating brand:', id, brandData);
      const response = await api.patch(`/api/brand/${id}`, brandData);
      console.log('✅ Brand updated:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error updating brand:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async deleteBrand(id) {
    try {
      console.log('🔄 Deleting brand:', id);
      const response = await api.delete(`/api/brand/${id}`);
      console.log('✅ Brand deleted:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error deleting brand:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  async getUsers({
    page = 1, 
    limit = 10, 
    search = '', 
    role = '', 
    status = ''
  } = {}) {
    try {
      const response = await api.get('/api/user');
      
      // Backend trả về mảng users trực tiếp
      const allUsers = Array.isArray(response) ? response : [];
      
      console.log('🔍 Raw users data from backend:', allUsers);
      
      // Transform backend data to match our User interface
      const transformedUsers = allUsers.map((user, index) => {
        console.log(`👤 User ${index}:`, {
          id: user._id || user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          telephone: user.telephone,
          address: user.address
        });
        
        return {
          key: user._id || user.id || index.toString(),
          id: user._id || user.id || index.toString(),
          email: user.email || 'Chưa có email',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Chưa có tên',
          phone: user.telephone || 'Chưa cập nhật',
          address: user.address || 'Chưa cập nhật',
          role: user.role || 'USER',
          gender: user.gender || 'MALE',
          birth: user.birth || null,
          avatar: user.avatar || null,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
          status: 'active', // Default status
        };
      });
      
      // Filter local nếu có search query
      let filteredUsers = transformedUsers;
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredUsers = transformedUsers.filter(user => 
          (user.fullName || '').toLowerCase().includes(searchTerm) ||
          (user.email || '').toLowerCase().includes(searchTerm) ||
          (user.phone || '').includes(search) ||
          (user.id || '').toLowerCase().includes(searchTerm)
        );
      }
      
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }
      
      if (status) {
        filteredUsers = filteredUsers.filter(user => user.status === status);
      }
      
      // Pagination local
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const users = filteredUsers.slice(startIndex, endIndex);
      
      console.log('✅ Transformed users:', users);
      
      return {
        success: true,
        data: {
          users: users,
          pagination: {
            page,
            limit,
            total: filteredUsers.length,
            totalPages: Math.ceil(filteredUsers.length / limit)
          }
        }
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      
      // Fallback to mock data
      await delay(400);
      const mockUsers = [
        {
          key: '1',
          id: 'USER-001',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          fullName: 'Admin User',
          phone: '0123456789',
          address: '123 Admin Street',
          role: 'ADMIN',
          status: 'active',
          createdAt: '2024-01-01',
        },
        {
          key: '2',
          id: 'USER-002',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          phone: '0987654321',
          address: '456 User Street',
          role: 'USER',
          status: 'active',
          createdAt: '2024-01-02',
        }
      ];

      return {
        success: true,
        data: {
          users: mockUsers,
          pagination: {
            page,
            limit,
            total: mockUsers.length,
            totalPages: Math.ceil(mockUsers.length / limit)
          }
        }
      };
    }
  },

  // SECTION: User CRUD Operations
  async createUser(userData) {
    try {
      const response = await api.post('/api/user/create', userData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.patch(`/api/user/update/${userId}`, userData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/api/user/delete/${userId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getUserById(userId) {
    try {
      const response = await api.get(`/api/user/profile/${userId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error getting user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Mock Orders Data
  async getOrders(page = 1, limit = 10) {
    await delay(400);
    const mockOrders = [
      {
        id: 1,
        customerName: "Nguyễn Văn A",
        customerEmail: "nguyenvana@example.com",
        product: "Laptop Dell XPS 13",
        amount: 25000000,
        status: "completed",
        date: "2024-01-15",
        paymentMethod: "Credit Card"
      },
      {
        id: 2,
        customerName: "Trần Thị B",
        customerEmail: "tranthib@example.com",
        product: "MacBook Pro M2",
        amount: 45000000,
        status: "pending",
        date: "2024-01-14",
        paymentMethod: "Bank Transfer"
      },
      {
        id: 3,
        customerName: "Lê Văn C",
        customerEmail: "levanc@example.com",
        product: "Laptop Asus ROG",
        amount: 32000000,
        status: "processing",
        date: "2024-01-13",
        paymentMethod: "Cash"
      },
      {
        id: 4,
        customerName: "Phạm Thị D",
        customerEmail: "phamthid@example.com",
        product: "Laptop HP Pavilion",
        amount: 18000000,
        status: "completed",
        date: "2024-01-12",
        paymentMethod: "Credit Card"
      }
    ];

    return {
      success: true,
      data: {
        orders: mockOrders,
        pagination: {
          page,
          limit,
          total: mockOrders.length,
          totalPages: Math.ceil(mockOrders.length / limit)
        }
      }
    };
  },


  async createProduct(productData) {
    try {
      // ✅ Sử dụng Backend API: POST /product
      const response = await api.post('/api/product', productData);
      return {
        success: true,
        message: "Sản phẩm đã được tạo thành công",
        data: response
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      await delay(600);
      return {
        success: true,
        message: "Sản phẩm đã được tạo thành công",
        data: { id: Date.now(), ...productData }
      };
    }
  },

  async updateProduct(id, productData) {
    try {
      // ✅ Sử dụng Backend API: PATCH /product/:id
      const response = await api.patch(`/api/product/${id}`, productData);
      return {
        success: true,
        message: "Sản phẩm đã được cập nhật thành công",
        data: response
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      await delay(500);
      return {
        success: true,
        message: "Sản phẩm đã được cập nhật thành công",
        data: { id, ...productData }
      };
    }
  },

  async deleteProduct(id) {
    try {
      // ✅ Sử dụng Backend API: DELETE /product/:id
      const response = await api.delete(`/api/product/${id}`);
      return {
        success: true,
        message: "Sản phẩm đã được xóa thành công",
        data: response
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      await delay(400);
      return {
        success: true,
        message: "Sản phẩm đã được xóa thành công"
      };
    }
  },

  async updateOrderStatus(id, status) {
    await delay(400);
    return {
      success: true,
      message: "Trạng thái đơn hàng đã được cập nhật",
      data: { id, status }
    };
  }
};

export default adminService;
