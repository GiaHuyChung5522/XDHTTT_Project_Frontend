import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

import "../assets/styles/base.css";
import "./header.css";
import "./notice-bar.css";

import NoticeBar from "./NoticeBar";
import AuthForm from "./AuthForm";

import logoPhone from "../assets/img/logoCongTy.png";
import { useAuth } from "../context/AuthContext";
import { Roles } from "../constants/roles";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [authMode, setAuthMode] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();

  const isAdmin = user?.role === Roles.ADMIN;
  const isStaff = user?.role === Roles.STAFF;
  const isUser = user?.role === Roles.USER;

  const navigate = useNavigate();

  const addToCart = () => setCartCount((n) => n + 1);
  const addToWishlist = () => setWishlistCount((n) => n + 1);

  const openLogin = () => setAuthMode("login");
  const openRegister = () => setAuthMode("register");
  const closeAuth = () => setAuthMode(null);

  const handleAuthSuccess = () => {
    setAuthMode(null);
    const stored = localStorage.getItem('user');
    const nextUser = stored ? JSON.parse(stored) : user;
    if (nextUser?.role === Roles.ADMIN) navigate("/admin");
    else if (nextUser?.role === Roles.STAFF) navigate("/staff");
    else navigate("/account");
  };

  const goDashboard = () => {
    const stored = localStorage.getItem('user');
    const nextUser = stored ? JSON.parse(stored) : user;
    if (!nextUser) return;
    if (nextUser.role === Roles.ADMIN) navigate("/admin/dashboard");
    else if (nextUser.role === Roles.STAFF) navigate("/staff");
    else navigate("/account");
  };


  const handleLogout = async () => {
    await logout();
    navigate("/");
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="site-header">
      <div className="site-header__container">
        {/* Logo + SĐT */}
        <div className="site-header__logo">
          <NavLink to="/" className="site-header__logo-link">
            <img src={logoPhone} alt="Nhom_7_UHT" className="site-header__logo-img" />
            <div className="site-header__logo-text">
              <div className="site-header__brand">KINZ</div>
              <div className="site-header__phone">0987654321</div>
            </div>
          </NavLink>
        </div>

        {/* Menu */}
        <nav className="site-header__nav" aria-label="Main menu">
          <NavLink to="/about" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>
            Giới thiệu
          </NavLink>
          <NavLink to="/khuyen-mai" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>
            Khuyến mãi
          </NavLink>
          <NavLink to="/tin-tuc" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>
            Tin tức
          </NavLink>
        </nav>

        {/* Search */}
        <div className="site-header__search">
          <div className="site-header__search-field">
            <input
              type="text"
              className="site-header__search-input"
              placeholder="Tìm kiếm laptop và phụ kiện"
              aria-label="Tìm kiếm"
            />
            <FaSearch className="site-header__search-icon" aria-hidden="true" />
          </div>
        </div>

        {/* Actions */}
        <div className="site-header__actions">
          {/* Địa chỉ cửa hàng */}
          <div className="site-header__action-item">
            <Link to="/store-location" className="site-header__action-link">
              <FaMapMarkerAlt className="site-header__action-icon" />
              <span className="site-header__action-label">ĐỊA CHỈ CỬA HÀNG</span>
            </Link>
          </div>

          {/* Yêu thích */}
          <div className="site-header__action-item">
            <button 
              type="button" 
              className="site-header__action-btn" 
              onClick={addToWishlist} 
              aria-label="Thêm vào yêu thích"
            >
              <FaHeart className="site-header__action-icon" />
              <span className="site-header__badge" aria-live="polite">{wishlistCount}</span>
            </button>
          </div>

          {/* Giỏ hàng */}
          <div className="site-header__action-item">
            <Link to="/cart" className="site-header__action-btn" aria-label="Giỏ hàng" onClick={addToCart}>
              <FaShoppingCart className="site-header__action-icon" />
              <span className="site-header__badge" aria-live="polite">{cartCount}</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="site-header__user">
            <button 
              className="site-header__user-btn"
              onClick={toggleUserMenu}
              onMouseEnter={() => setShowUserMenu(true)}
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <FaUser className="site-header__action-icon" />
              <FaChevronDown className="site-header__chevron" />
            </button>
            
            {/* Dropdown Menu */}
            <div 
              className={`site-header__user-menu ${showUserMenu ? 'show' : ''}`}
              onMouseLeave={() => setShowUserMenu(false)}
              role="menu"
            >
              {!isAuthenticated ? (
                <>
                  <button 
                    className="site-header__menu-item site-header__menu-item--primary" 
                    role="menuitem" 
                    onClick={openLogin}
                  >
                    <FaUser className="site-header__menu-icon" />
                    Đăng nhập
                  </button>
                  <button 
                    className="site-header__menu-item site-header__menu-item--secondary" 
                    role="menuitem" 
                    onClick={openRegister}
                  >
                    <FaUser className="site-header__menu-icon" />
                    Tạo tài khoản
                  </button>
                </>
              ) : (
                <>
                  <div className="site-header__user-info">
                    <div className="site-header__user-avatar">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="site-header__user-details">
                      <div className="site-header__user-name">{user?.name}</div>
                      <div className="site-header__user-role">{user?.role}</div>
                    </div>
                  </div>
                  <Link 
                    to="/profile"
                    className="site-header__menu-item" 
                    role="menuitem"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaUser className="site-header__menu-icon" />
                    Tài khoản của tôi
                  </Link>
                  <Link 
                    to="/orders"
                    className="site-header__menu-item" 
                    role="menuitem"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaShoppingCart className="site-header__menu-icon" />
                    Đơn hàng của tôi
                  </Link>
                  <button 
                    className="site-header__menu-item site-header__menu-item--danger" 
                    role="menuitem" 
                    onClick={handleLogout}
                  >
                    <FaUser className="site-header__menu-icon" />
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Bar */}
      <div className="site-header__container">
        <NoticeBar />
      </div>

      {/* Auth Modal */}
      {authMode && (
        <AuthForm mode={authMode} onClose={closeAuth} onSuccess={handleAuthSuccess} />
      )}
    </header>
  );
};

export default Header;