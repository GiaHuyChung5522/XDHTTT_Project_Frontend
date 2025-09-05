# 🔧 Hướng Dẫn Tích Hợp API cho Backend

## 📋 **Tổng Quan Context System**

### 🎯 **Context là gì?**
Context trong React là cách chia sẻ dữ liệu giữa các component mà không cần truyền props qua từng cấp. Giống như một "kho chung" để lưu trữ thông tin user, giỏ hàng, etc.

## 🔐 **AuthContext - Quản Lý Đăng Nhập**

### **File:** `src/context/AuthContext.jsx`

### **Chức năng:**
- Lưu trữ thông tin user đã đăng nhập
- Quản lý token (accessToken, refreshToken)
- Kiểm tra quyền (role: user, admin, staff)
- Cung cấp functions: login, register, logout, refreshToken

### **Cách hoạt động:**

```javascript
// 1. Khi user đăng nhập
const { login } = useAuth();
await login({ email: "user@example.com", password: "123456" });

// 2. Context sẽ:
// - Gọi API POST /api/auth/login
// - Nhận response: { accessToken, refreshToken, role }
// - Tạo user object từ thông tin có sẵn
// - Lưu vào localStorage và state
// - Cập nhật toàn bộ app biết user đã đăng nhập
```

### **API Response Format cần thiết:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}
```

### **Hoặc format có wrapper:**

```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "user"
  }
}
```

## 🛒 **CartContext - Quản Lý Giỏ Hàng**

### **File:** `src/context/CartContext.jsx`

### **Chức năng:**
- Lưu trữ sản phẩm trong giỏ hàng
- Quản lý wishlist (yêu thích)
- Tính tổng tiền, số lượng
- Lưu vào localStorage

### **Cách sử dụng:**

```javascript
const { 
  cartItems,           // Danh sách sản phẩm trong giỏ
  addToCart,          // Thêm sản phẩm vào giỏ
  removeFromCart,     // Xóa sản phẩm khỏi giỏ
  getTotalPrice,      // Tính tổng tiền
  wishlistItems,      // Danh sách yêu thích
  addToWishlist       // Thêm vào yêu thích
} = useCart();
```

## 🔄 **Flow Đăng Nhập Chi Tiết**

### **1. User nhập email/password**

```javascript
// Trong component Login
const handleLogin = async (formData) => {
  try {
    await login(formData); // Gọi AuthContext.login()
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### **2. AuthContext.login() xử lý:**

```javascript
// src/context/AuthContext.jsx - line 34-41
const login = async (form) => {
  const { user, token } = await authSvc.login(form); // Gọi authService
  const normalizedUser = { ...user, role: String(user.role || '').toLowerCase() };
  setUser(normalizedUser); 
  setToken(token);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(normalizedUser));
  return user;
};
```

### **3. authService.login() gọi API:**

```javascript
// src/services/authService.js - line 5-42
export async function login({ email, password }) {
  try {
    // GỌI API BACKEND
    const response = await api.post("/auth/login", { email, password });
    
    // XỬ LÝ RESPONSE
    let loginData = response;
    if (response?.data && response?.statusCode) {
      loginData = response.data; // Lấy data từ wrapper
    }
    
    // TẠO USER OBJECT TỪ THÔNG TIN CÓ SẴN
    if (loginData?.accessToken) {
      const user = {
        id: Date.now(), // Tạm thời dùng timestamp
        email: email,
        role: loginData.role || 'user',
        name: email.split('@')[0], // Tạm thời dùng email làm tên
        refreshToken: loginData.refreshToken
      };
      
      setAuth({ token: loginData.accessToken, user: user });
      return { token: loginData.accessToken, user: user };
    }
  } catch (error) {
    throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.");
  }
}
```

## 🔄 **Flow Đăng Ký Chi Tiết**

### **API Response cần thiết:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}
```

### **Hoặc chỉ trả về success (không auto login):**

```json
{
  "statusCode": 200,
  "message": "User registered successfully"
}
```

## 🔄 **Flow Refresh Token**

### **API Endpoint cần tạo:**

```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **API Response:**

```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token" // Optional
}
```

## 🗄️ **Storage Structure**

### **localStorage.auth:**
```json
{
  "token": "access_token_here",
  "user": {
    "id": 1234567890,
    "email": "user@example.com",
    "role": "user",
    "name": "user",
    "refreshToken": "refresh_token_here"
  }
}
```

### **Fallback storage:**
- `localStorage.token` - Chỉ chứa access token
- `localStorage.user` - Chứa user object

## 🔧 **API Endpoints Cần Thiết**

### **1. Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token", 
  "role": "user"
}
```

### **2. Register**
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "gender": "male",
  "birth": "1990-01-01",
  "address": "123 Main St",
  "telephone": "0123456789"
}

Response:
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "role": "user"
}
```

### **3. Refresh Token**
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}

Response:
{
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

## 🚨 **Error Handling**

### **Login Failed:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### **Token Expired:**
```json
{
  "statusCode": 401,
  "message": "Token expired"
}
```

## 📝 **Lưu Ý Quan Trọng**

1. **User ID**: Frontend tạm thời dùng `Date.now()` làm ID
2. **User Name**: Dùng email prefix làm tên tạm thời
3. **Role**: Tự động lowercase và validate
4. **Auto Refresh**: Khi API trả 401, frontend tự động gọi refresh token
5. **Fallback**: Nếu refresh thất bại, redirect về login

## 🎯 **Tóm Tắt cho BE**

**BE chỉ cần:**
1. ✅ Tạo 3 endpoints: `/auth/login`, `/auth/register`, `/auth/refresh`
2. ✅ Trả về format: `{ accessToken, refreshToken, role }`
3. ✅ Xử lý validation và error responses
4. ✅ Frontend sẽ tự động xử lý tất cả logic còn lại

**Frontend sẽ:**
- ✅ Tự động tạo user object từ thông tin có sẵn
- ✅ Lưu token vào storage
- ✅ Auto refresh khi cần
- ✅ Quản lý state toàn bộ app
