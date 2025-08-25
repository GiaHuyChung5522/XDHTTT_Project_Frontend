import React from 'react';
import { Navigate } from 'react-router-dom';
// Guard dành cho khu vực Admin
// Ghi chú cho BE:
// - FE thống nhất dùng authService tại: src/pages/admin2/auth/auth.service.ts
// - Token + user lưu ở localStorage: 'auth_token', 'auth_user'
// - Khi tích hợp API thật, chỉ cần thay logic trong auth.service.ts
import { authService as adminAuthService } from '../../pages/admin2/auth/auth.service';

const AdminProtectedRoute = ({ children }) => {
  // Kiểm tra trạng thái đăng nhập
  const isAuthenticated = adminAuthService.isAuthenticated();
  
  // Kiểm tra quyền admin
  const hasAdminRole = typeof adminAuthService.isAdmin === 'function'
    ? adminAuthService.isAdmin()
    : !!adminAuthService.getCurrentUser?.()?.role === 'admin';

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập → về trang login admin2
    return <Navigate to="/admin2/login" replace />;
  }

  if (!hasAdminRole) {
    // Không đủ quyền → trang cấm truy cập
    return <Navigate to="/forbidden" replace />;
  }

  // Nếu đã đăng nhập và là admin, hiển thị component con
  return children;
};

export default AdminProtectedRoute;
