// Mock Admin Service - Có thể thay thế bằng real API calls sau này
import { 
  adminStats, 
  recentOrders, 
  topProducts, 
  userAnalytics, 
  productCategories 
} from '../data/adminMockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  // Dashboard Stats
  async getDashboardStats() {
    await delay(500); // Simulate network delay
    return {
      success: true,
      data: adminStats
    };
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

  // Mock Products Data
  async getProducts(page = 1, limit = 10) {
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

  // CRUD Operations (Mock)
  async createUser(userData) {
    await delay(600);
    return {
      success: true,
      message: "Người dùng đã được tạo thành công",
      data: { id: Date.now(), ...userData }
    };
  },

  async updateUser(id, userData) {
    await delay(500);
    return {
      success: true,
      message: "Người dùng đã được cập nhật thành công",
      data: { id, ...userData }
    };
  },

  async deleteUser(id) {
    await delay(400);
    return {
      success: true,
      message: "Người dùng đã được xóa thành công"
    };
  },

  async createProduct(productData) {
    await delay(600);
    return {
      success: true,
      message: "Sản phẩm đã được tạo thành công",
      data: { id: Date.now(), ...productData }
    };
  },

  async updateProduct(id, productData) {
    await delay(500);
    return {
      success: true,
      message: "Sản phẩm đã được cập nhật thành công",
      data: { id, ...productData }
    };
  },

  async deleteProduct(id) {
    await delay(400);
    return {
      success: true,
      message: "Sản phẩm đã được xóa thành công"
    };
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
