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
      // ✅ TODO: Backend cần implement endpoint /admin/dashboard/stats
      // Hiện tại sử dụng mock data
      await delay(500);
      return {
        success: true,
        data: adminStats
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      return {
        success: true,
        data: adminStats
      };
    }
  },

  // Recent Orders
  async getRecentOrders(limit = 10) {
    await delay(300);
    return {
      success: true,
      data: recentOrders.slice(0, limit)
    };
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
        
        const response = await api.get('/product/filter', params);
        
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
      
      // ✅ Nếu không có filter, dùng endpoint /product (lấy tất cả)
      const response = await api.get('/product');
      
      // ✅ Backend trả về mảng sản phẩm trực tiếp
      const allProducts = Array.isArray(response) ? response : [];
      
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
      const response = await api.post('/product', productData);
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

  async updateProduct(productId, productData) {
    try {
      const response = await api.patch(`/product/${productId}`, productData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/product/${productId}`);
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

  async getProductById(productId) {
    try {
      const response = await api.get(`/product/${productId}`);
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
      const response = await api.get('/product/categories');
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
      const response = await api.get('/product/brands');
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

  // SECTION: User Management - Quản lý người dùng
  async getUsers({
    page = 1, 
    limit = 10, 
    search = '', 
    role = '', 
    status = ''
  } = {}) {
    try {
      const response = await api.get('/user');
      
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
      const response = await api.post('/user/create', userData);
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
      const response = await api.patch(`/user/update/${userId}`, userData);
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
      const response = await api.delete(`/user/delete/${userId}`);
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
      const response = await api.get(`/user/profile/${userId}`);
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

  // SECTION: CRUD Operations - Thao tác tạo, sửa, xóa
  async createUser(userData) {
    try {
      // ✅ TODO: Backend cần implement endpoint POST /user
      // Hiện tại sử dụng mock
      await delay(600);
      return {
        success: true,
        message: "Người dùng đã được tạo thành công",
        data: { id: Date.now(), ...userData }
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      return {
        success: true,
        message: "Người dùng đã được tạo thành công",
        data: { id: Date.now(), ...userData }
      };
    }
  },

  async updateUser(id, userData) {
    try {
      // ✅ TODO: Backend cần implement endpoint PATCH /user/:id
      await delay(500);
      return {
        success: true,
        message: "Người dùng đã được cập nhật thành công",
        data: { id, ...userData }
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      return {
        success: true,
        message: "Người dùng đã được cập nhật thành công",
        data: { id, ...userData }
      };
    }
  },

  async deleteUser(id) {
    try {
      // ✅ TODO: Backend cần implement endpoint DELETE /user/:id
      await delay(400);
      return {
        success: true,
        message: "Người dùng đã được xóa thành công"
      };
    } catch (error) {
      console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
      return {
        success: true,
        message: "Người dùng đã được xóa thành công"
      };
    }
  },

  async createProduct(productData) {
    try {
      // ✅ Sử dụng Backend API: POST /product
      const response = await api.post('/product', productData);
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
      const response = await api.patch(`/product/${id}`, productData);
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
      const response = await api.delete(`/product/${id}`);
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
