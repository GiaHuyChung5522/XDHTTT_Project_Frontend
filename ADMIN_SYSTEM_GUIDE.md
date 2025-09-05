# 📋 HƯỚNG DẪN HỆ THỐNG ADMIN CHO BACKEND

## 🎯 TỔNG QUAN HỆ THỐNG

### **Mục đích:**
- Hệ thống admin quản lý toàn bộ website Gr7 UTH
- Phân quyền rõ ràng giữa User thường và Admin
- Bảo mật cao, chỉ admin được ủy quyền mới truy cập được

### **Cấu trúc URL:**
```
/admin/login          - Trang đăng nhập admin
/admin/dashboard      - Trang chủ admin (sau khi đăng nhập)
/admin/products       - Quản lý sản phẩm
/admin/orders         - Quản lý đơn hàng
/admin/customers      - Quản lý khách hàng
/admin/analytics      - Báo cáo thống kê
/admin/settings       - Cài đặt hệ thống
```

---

## 🔐 HỆ THỐNG XÁC THỰC (AUTHENTICATION)

### **1. Flow đăng nhập Admin:**

```javascript
// Bước 1: User truy cập /admin/login
// Bước 2: Nhập email + password
// Bước 3: Gửi POST request đến BE
// Bước 4: BE kiểm tra và trả về token + user info
// Bước 5: FE lưu token vào localStorage
// Bước 6: Redirect đến /admin/dashboard
```

### **2. API Endpoints cần implement:**

#### **POST /auth/admin/login**
```json
// Request Body:
{
  "email": "admin@gmail.com",
  "password": "admin123"
}

// Response Success (200):
{
  "statusCode": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "admin_001",
      "email": "admin@gmail.com",
      "name": "Admin Gr7 UTH",
      "role": "admin",
      "permissions": ["read", "write", "delete", "manage_users"],
      "avatar": "https://example.com/avatar.jpg",
      "lastLogin": "2024-01-15T10:30:00Z"
    }
  }
}

// Response Error (401):
{
  "statusCode": 401,
  "message": "Email hoặc mật khẩu không đúng",
  "error": "Unauthorized"
}
```

#### **POST /auth/admin/refresh**
```json
// Request Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response:
{
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token_here"
  }
}
```

#### **POST /auth/admin/logout**
```json
// Request Headers:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response:
{
  "statusCode": 200,
  "message": "Đăng xuất thành công"
}
```

---

## 🛡️ BẢO MẬT VÀ PHÂN QUYỀN

### **1. JWT Token Structure:**
```json
{
  "sub": "admin_001",
  "email": "admin@gmail.com",
  "role": "admin",
  "permissions": ["read", "write", "delete", "manage_users"],
  "iat": 1642248000,
  "exp": 1642251600
}
```

### **2. Middleware xác thực:**
```javascript
// BE cần implement middleware kiểm tra:
// 1. Token có hợp lệ không
// 2. User có role = "admin" không
// 3. Token có hết hạn không
// 4. User có quyền truy cập endpoint này không

// Example middleware:
const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Token không được cung cấp"
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        statusCode: 403,
        message: "Không có quyền truy cập"
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      message: "Token không hợp lệ"
    });
  }
};
```

### **3. Các quyền (Permissions) cần implement:**
```javascript
const ADMIN_PERMISSIONS = {
  // Quản lý sản phẩm
  PRODUCTS_READ: "products:read",
  PRODUCTS_WRITE: "products:write", 
  PRODUCTS_DELETE: "products:delete",
  
  // Quản lý đơn hàng
  ORDERS_READ: "orders:read",
  ORDERS_UPDATE: "orders:update",
  ORDERS_DELETE: "orders:delete",
  
  // Quản lý khách hàng
  CUSTOMERS_READ: "customers:read",
  CUSTOMERS_UPDATE: "customers:update",
  CUSTOMERS_DELETE: "customers:delete",
  
  // Quản lý admin khác
  ADMINS_READ: "admins:read",
  ADMINS_WRITE: "admins:write",
  ADMINS_DELETE: "admins:delete",
  
  // Báo cáo thống kê
  ANALYTICS_READ: "analytics:read",
  
  // Cài đặt hệ thống
  SETTINGS_READ: "settings:read",
  SETTINGS_WRITE: "settings:write"
};
```

---

## 📊 API ENDPOINTS CHO ADMIN DASHBOARD

### **1. Dashboard Statistics:**
```javascript
// GET /admin/dashboard/stats
// Headers: Authorization: Bearer <token>

// Response:
{
  "statusCode": 200,
  "message": "Thống kê dashboard",
  "data": {
    "totalRevenue": 125000000,        // Tổng doanh thu (VND)
    "totalOrders": 1250,              // Tổng số đơn hàng
    "pendingOrders": 45,              // Đơn hàng chờ xử lý
    "totalCustomers": 850,            // Tổng số khách hàng
    "totalProducts": 120,             // Tổng số sản phẩm
    "revenueGrowth": 15.5,            // Tăng trưởng doanh thu (%)
    "orderGrowth": 8.2,               // Tăng trưởng đơn hàng (%)
    "recentOrders": [                 // 5 đơn hàng gần nhất
      {
        "id": "ORD_001",
        "customerName": "Nguyễn Văn A",
        "total": 2500000,
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### **2. Quản lý Sản phẩm:**
```javascript
// GET /admin/products
// Query params: ?page=1&limit=10&search=laptop&category=electronics

// Response:
{
  "statusCode": 200,
  "message": "Danh sách sản phẩm",
  "data": {
    "products": [
      {
        "id": "PROD_001",
        "name": "Laptop Dell XPS 13",
        "price": 25000000,
        "originalPrice": 28000000,
        "category": "Laptop",
        "brand": "Dell",
        "stock": 15,
        "status": "active",
        "images": ["url1", "url2"],
        "description": "Laptop cao cấp...",
        "specifications": {
          "cpu": "Intel i7",
          "ram": "16GB",
          "storage": "512GB SSD"
        },
        "createdAt": "2024-01-10T08:00:00Z",
        "updatedAt": "2024-01-15T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 120,
      "totalPages": 12
    }
  }
}

// POST /admin/products
// Body: Product data để tạo mới

// PUT /admin/products/:id  
// Body: Product data để cập nhật

// DELETE /admin/products/:id
// Xóa sản phẩm
```

### **3. Quản lý Đơn hàng:**
```javascript
// GET /admin/orders
// Query params: ?page=1&limit=10&status=pending&dateFrom=2024-01-01

// Response:
{
  "statusCode": 200,
  "message": "Danh sách đơn hàng",
  "data": {
    "orders": [
      {
        "id": "ORD_001",
        "orderNumber": "7N240115001",
        "customer": {
          "id": "CUST_001",
          "name": "Nguyễn Văn A",
          "email": "nguyenvana@gmail.com",
          "phone": "0901234567"
        },
        "items": [
          {
            "productId": "PROD_001",
            "productName": "Laptop Dell XPS 13",
            "quantity": 1,
            "price": 25000000
          }
        ],
        "total": 25000000,
        "status": "pending",          // pending, confirmed, shipping, delivered, cancelled
        "paymentMethod": "bank_transfer",
        "paymentStatus": "paid",      // paid, pending, failed
        "shippingAddress": {
          "fullName": "Nguyễn Văn A",
          "address": "123 Đường ABC, Quận 1",
          "city": "TP.HCM",
          "phone": "0901234567"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1250,
      "totalPages": 125
    }
  }
}

// PUT /admin/orders/:id/status
// Body: { "status": "confirmed" }
```

### **4. Quản lý Khách hàng:**
```javascript
// GET /admin/customers
// Query params: ?page=1&limit=10&search=nguyen

// Response:
{
  "statusCode": 200,
  "message": "Danh sách khách hàng",
  "data": {
    "customers": [
      {
        "id": "CUST_001",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@gmail.com",
        "phone": "0901234567",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "totalOrders": 5,
        "totalSpent": 12500000,
        "status": "active",           // active, inactive, blocked
        "createdAt": "2024-01-01T08:00:00Z",
        "lastOrderAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 850,
      "totalPages": 85
    }
  }
}
```

### **5. Báo cáo Thống kê:**
```javascript
// GET /admin/analytics/revenue
// Query params: ?period=month&year=2024&month=1

// Response:
{
  "statusCode": 200,
  "message": "Báo cáo doanh thu",
  "data": {
    "period": "2024-01",
    "totalRevenue": 125000000,
    "totalOrders": 1250,
    "averageOrderValue": 100000,
    "dailyData": [
      {
        "date": "2024-01-01",
        "revenue": 5000000,
        "orders": 25
      }
    ],
    "growth": {
      "revenue": 15.5,
      "orders": 8.2
    }
  }
}

// GET /admin/analytics/products
// Thống kê sản phẩm bán chạy

// GET /admin/analytics/customers  
// Thống kê khách hàng
```

---

## 🔧 CẤU HÌNH VÀ SETTINGS

### **1. Environment Variables cần thiết:**
```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Admin Configuration  
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
ADMIN_DEFAULT_ROLE=admin

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=7n_fashion
DB_USER=admin
DB_PASSWORD=password

# Redis (for session management)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### **2. Database Schema gợi ý:**
```sql
-- Bảng Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  permissions JSONB DEFAULT '[]',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bảng Admin Sessions (cho refresh token)
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bảng Audit Log (ghi lại hoạt động admin)
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,  -- 'login', 'logout', 'create_product', etc.
  resource_type VARCHAR(50),     -- 'product', 'order', 'customer', etc.
  resource_id VARCHAR(100),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚨 XỬ LÝ LỖI VÀ VALIDATION

### **1. Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Dữ liệu không hợp lệ",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email không hợp lệ"
    },
    {
      "field": "password", 
      "message": "Mật khẩu phải có ít nhất 8 ký tự"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **2. Validation Rules:**
```javascript
// Admin Login Validation
const adminLoginSchema = {
  email: {
    required: true,
    type: 'email',
    message: 'Email không hợp lệ'
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Mật khẩu phải có ít nhất 6 ký tự'
  }
};

// Product Validation
const productSchema = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 255,
    message: 'Tên sản phẩm phải từ 3-255 ký tự'
  },
  price: {
    required: true,
    type: 'number',
    min: 0,
    message: 'Giá sản phẩm phải lớn hơn 0'
  },
  category: {
    required: true,
    message: 'Danh mục sản phẩm không được để trống'
  }
};
```

---

## 📱 FRONTEND INTEGRATION

### **1. API Client Configuration:**
```javascript
// File: src/lib/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Interceptor để tự động thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi 401 (token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

### **2. Auth Service:**
```javascript
// File: src/pages/admin2/auth/auth.service.ts
class AuthService {
  async login(credentials) {
    const response = await api.post('/auth/admin/login', credentials);
    
    if (response.data.statusCode === 200) {
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Lưu vào localStorage
      localStorage.setItem('adminToken', accessToken);
      localStorage.setItem('adminRefreshToken', refreshToken);
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      return { user, token: accessToken };
    }
    
    throw new Error(response.data.message);
  }
  
  async logout() {
    try {
      await api.post('/auth/admin/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa dữ liệu local
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUser');
    }
  }
  
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!(token && user);
  }
  
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('adminUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}
```

---

## 🎯 CHECKLIST CHO BACKEND DEVELOPER

### **Phase 1: Authentication (Ưu tiên cao)**
- [ ] Implement POST /auth/admin/login
- [ ] Implement POST /auth/admin/refresh  
- [ ] Implement POST /auth/admin/logout
- [ ] Tạo middleware xác thực admin
- [ ] Setup JWT với proper expiration
- [ ] Tạo bảng admin_users trong database

### **Phase 2: Dashboard APIs (Ưu tiên cao)**
- [ ] Implement GET /admin/dashboard/stats
- [ ] Implement GET /admin/products (CRUD)
- [ ] Implement GET /admin/orders (CRUD)
- [ ] Implement GET /admin/customers (CRUD)

### **Phase 3: Advanced Features (Ưu tiên trung bình)**
- [ ] Implement GET /admin/analytics/*
- [ ] Implement audit logging
- [ ] Implement role-based permissions
- [ ] Implement file upload cho products

### **Phase 4: Security & Performance (Ưu tiên thấp)**
- [ ] Implement rate limiting
- [ ] Implement input sanitization
- [ ] Implement CORS properly
- [ ] Add API documentation (Swagger)

---

## 📞 LIÊN HỆ VÀ HỖ TRỢ

### **Khi có vấn đề:**
1. **Check logs** trong console browser (F12)
2. **Check network tab** để xem API calls
3. **Verify token** trong localStorage
4. **Check BE logs** để xem server errors

### **Testing:**
- **Postman Collection** sẽ được cung cấp
- **Test data** sẽ được setup sẵn
- **Mock responses** có thể được sử dụng trong development

---

**📝 Lưu ý:** Tài liệu này sẽ được cập nhật khi có thay đổi. Vui lòng tham khảo thường xuyên!
