# 🔐 Hướng Dẫn Flow Authentication

## 📋 Tổng Quan

Flow authentication đã được cập nhật để phù hợp với API backend chỉ trả về:
- `accessToken`
- `refreshToken` 
- `role`

## 🔄 Flow Đăng Nhập

### 1. **API Response Format**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user" // hoặc "admin"
}
```

### 2. **Frontend Processing**
```javascript
// authService.js - login()
const user = {
  id: Date.now(), // Tạm thời dùng timestamp
  email: email,
  role: loginData.role || 'user',
  name: email.split('@')[0], // Tạm thời dùng email làm tên
  refreshToken: loginData.refreshToken
};

setAuth({ token: loginData.accessToken, user: user });
```

## 🔄 Flow Đăng Ký

### 1. **API Response Format**
```json
// Có thể trả về:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}

// Hoặc chỉ trả về success message
{
  "message": "User registered successfully"
}
```

### 2. **Frontend Processing**
```javascript
// authService.js - register()
if (registerData?.accessToken) {
  // Auto login sau khi đăng ký
  const user = { /* user data */ };
  setAuth({ token: registerData.accessToken, user: user });
  return { token: registerData.accessToken, user: user };
} else {
  // Chỉ trả về user info, không auto login
  return { user: user };
}
```

## 🔄 Flow Refresh Token

### 1. **API Endpoint**
```
POST /api/auth/refresh
Body: { "refreshToken": "..." }
```

### 2. **API Response**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token" // Optional
}
```

### 3. **Auto Refresh Logic**
```javascript
// lib/api.js - request()
if (res.status === 401 && retryCount === 0) {
  const refreshed = await handleTokenRefresh();
  if (refreshed) {
    return request(path, options, retryCount + 1); // Retry
  } else {
    window.location.href = '/login'; // Redirect to login
  }
}
```

## 🗄️ Storage Structure

### localStorage.auth
```json
{
  "token": "access_token",
  "user": {
    "id": 1234567890,
    "email": "user@example.com",
    "role": "user",
    "name": "user",
    "refreshToken": "refresh_token"
  }
}
```

### Fallback Storage
- `localStorage.token` - Chỉ chứa access token
- `localStorage.user` - Chứa user object

## 🔧 Cách Sử Dụng

### 1. **Login**
```javascript
const { login } = useAuth();
await login({ email, password });
```

### 2. **Register**
```javascript
const { register } = useAuth();
await register({ firstName, lastName, email, password, ... });
```

### 3. **Refresh Token**
```javascript
const { refreshToken } = useAuth();
await refreshToken(); // Manual refresh
```

### 4. **Logout**
```javascript
const { logout } = useAuth();
await logout();
```

## 🚨 Error Handling

### 1. **Login Failed**
- Hiển thị lỗi từ API
- Không lưu token

### 2. **Token Expired**
- Tự động refresh token
- Nếu refresh thất bại → redirect to login

### 3. **Refresh Failed**
- Clear auth data
- Redirect to login

## 📝 Lưu Ý

1. **User ID**: Hiện tại dùng `Date.now()` làm ID tạm thời
2. **User Name**: Dùng email prefix làm tên tạm thời
3. **Role**: Tự động lowercase và validate
4. **Token Storage**: Ưu tiên `localStorage.auth`, fallback `localStorage.token`

## 🔄 Migration từ Flow Cũ

Flow cũ mong đợi API trả về nhiều thông tin user hơn. Flow mới:
- ✅ Chỉ cần `accessToken`, `refreshToken`, `role`
- ✅ Tự động tạo user object từ thông tin có sẵn
- ✅ Hỗ trợ auto refresh token
- ✅ Fallback storage cho compatibility
