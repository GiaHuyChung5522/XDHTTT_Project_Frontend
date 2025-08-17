import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const logout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  // Xác định role từ URL path
  const isAdmin = location.pathname.startsWith('/admin');
  const isStaff = location.pathname.startsWith('/staff');
  
  const getTitle = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isStaff) return "Staff Dashboard";
    return "Dashboard";
  };

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/users', label: 'Quản lý Users' },
        { path: '/admin/products', label: 'Quản lý Products' },
        { path: '/admin/orders', label: 'Quản lý Orders' }
      ];
    }
    if (isStaff) {
      return [
        { path: '/staff', label: 'Dashboard' },
        { path: '/staff/products', label: 'Quản lý Products' },
        { path: '/staff/orders', label: 'Quản lý Orders' }
      ];
    }
    return [];
  };

  return (
    <div className="admin-layout">
      {/* Top Navigation Bar */}
      <nav className="admin-nav">
        <div className="admin-nav__left">
          <h1>{getTitle()}</h1>
        </div>
        <div className="admin-nav__right">
          {getNavItems().map((item) => (
            <button 
              key={item.path}
              className={`btn-nav ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
          <button 
            className="btn-nav"
            onClick={() => navigate('/')}
          >
            ← Về trang chủ
          </button>
          <button 
            className="btn-logout"
            onClick={logout}
          >
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;