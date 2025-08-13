import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaMapMarkerAlt } from "react-icons/fa";

import "../assets/styles/base.css";
import "./header.css";
import "./notice-bar.css";

import NoticeBar from "./NoticeBar";
import AuthForm from "./AuthForm";

import logoPhone from "../assets/img/logoPhone.png";
import { useAuth } from "../context/AuthContext";
import { Roles } from "../constants/roles";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [authMode, setAuthMode] = useState(null); // "login" | "register" | null

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const addToCart = () => setCartCount((n) => n + 1);
  const addToWishlist = () => setWishlistCount((n) => n + 1);

  const openLogin = () => setAuthMode("login");
  const openRegister = () => setAuthMode("register");
  const closeAuth = () => setAuthMode(null);

  const handleAuthSuccess = () => {
    setAuthMode(null);
    if (user?.role === Roles.ADMIN) navigate("/admin");
    else if (user?.role === Roles.STAFF) navigate("/staff");
    else navigate("/account");
  };

  const goDashboard = () => {
    if (!user) return;
    if (user.role === Roles.ADMIN) navigate("/admin");
    else if (user.role === Roles.STAFF) navigate("/staff");
    else navigate("/account");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="site-header__container">

        {/* Logo + SĐT */}
        <div className="site-header__logo">
          <NavLink to="/" className="site-header__logo-link">
            <img src={logoPhone} alt="Nhom_7_UHT" className="site-header__logo-img" />
            <div className="site-header__logo-text">
              <div className="site-header__brand">Nhom_7_UHT</div>
              <div className="site-header__phone">0987654321</div>
            </div>
          </NavLink>
        </div>

        {/* Menu */}
        <nav className="site-header__nav" aria-label="Main menu">
          <NavLink to="/about" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>Giới thiệu</NavLink>
          <NavLink to="/khuyen-mai" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>Khuyến mãi</NavLink>
          <NavLink to="/tin-tuc" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>Tin tức</NavLink>
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
          <Link to="/store-location" className="site-header__action-link">
            <FaMapMarkerAlt className="site-header__action-icon" />
            <span className="site-header__action-label">ĐỊA CHỈ CỬA HÀNG</span>
          </Link>

          <button type="button" className="site-header__action-btn" onClick={addToWishlist} aria-label="Thêm vào yêu thích">
            <FaHeart className="site-header__action-icon" />
            <span className="site-header__badge" aria-live="polite">{wishlistCount}</span>
          </button>

          <Link to="/cart" className="site-header__action-btn" aria-label="Giỏ hàng" onClick={addToCart}>
            <FaShoppingCart className="site-header__action-icon" />
            <span className="site-header__badge" aria-live="polite">{cartCount}</span>
          </Link>

          {/* User */}
          <div className="site-header__user">
            <FaUser className="site-header__action-icon" />
            <div className="site-header__user-menu" role="menu">
              {!isAuthenticated ? (
                <>
                  <button className="btn btn-primary btn-sm" role="menuitem" onClick={openLogin}>Đăng nhập</button>
                  <button className="btn btn-outline-secondary btn-sm" role="menuitem" onClick={openRegister}>Tạo tài khoản</button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary btn-sm" role="menuitem" onClick={goDashboard}>
                    {user?.name} ({user?.role})
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" role="menuitem" onClick={handleLogout}>
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
