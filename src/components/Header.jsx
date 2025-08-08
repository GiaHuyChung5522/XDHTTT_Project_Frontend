import React from "react";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./header.css";
import logoPhone from "../assets/img/logoPhone.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">

        {/* Logo + SĐT */}
        <div className="header-logo">
          <img src={logoPhone} alt="logo" />
          <div className="header-logo-text">
            <div>Nhom_7_UHT</div>
            <div className="phone-number">0987654321</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="header-nav">
          <a href="#">Giới thiệu</a>
          <a href="#">Khuyến mãi</a>
          <a href="#">Tin tức</a>
        </nav>

        {/* Search */}
        <div className="header-search">
          <div className="relative">
            <input type="text" placeholder="Tìm kiếm laptop và phụ kiện" />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Icons */}
        <div className="header-icons">
          <a href="#">
            <FaMapMarkerAlt className="text-blue-600" />
            <span className="hidden sm:inline">ĐỊA CHỈ CỬA HÀNG</span>
          </a>

          <div className="relative">
            <FaHeart className="icon" />
            <span className="badge">0</span>
          </div>

          <div className="relative">
            <FaShoppingCart className="icon" />
            <span className="badge">0</span>
          </div>

          {/* 👤 User Icon + Hover Dropdown */}
          <div className="user-dropdown-wrapper">
            <FaUser className="icon" />
            <div className="user-dropdown">
              <button className="btn-login">Đăng nhập</button>
              <button className="btn-register">Tạo tài khoản</button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
