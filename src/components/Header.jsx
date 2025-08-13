import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaMapMarkerAlt } from "react-icons/fa";

import "../assets/styles/base.css";     // reset + variables + grid, v.v.
import "./header.css";                  // BEM cho header (kèm alias an toàn)
import "./notice-bar.css";              // BEM cho notice bar
import NoticeBar from "./NoticeBar";

import logoPhone from "../assets/img/logoPhone.png";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const addToCart = () => setCartCount(n => n + 1);
  const addToWishlist = () => setWishlistCount(n => n + 1);

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

          <div className="site-header__user">
            <FaUser className="site-header__action-icon" />
            <div className="site-header__user-menu" role="menu">
              <button className="btn btn--primary" role="menuitem">Đăng nhập</button>
              <button className="btn btn--outline" role="menuitem">Tạo tài khoản</button>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Bar */}
      <div className="site-header__container">
        <NoticeBar />
      </div>
    </header>
  );
};

export default Header;
