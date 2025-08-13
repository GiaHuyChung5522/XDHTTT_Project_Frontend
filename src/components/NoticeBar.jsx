import React from "react";
import "./notice-bar.css";

const NoticeBar = () => {
  return (
    <div className="notice-bar notice-bar--grid4">
      {/* Cột 1: Danh mục */}
      <div
        className="notice-bar__cell notice-bar__cell--category"
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="icon-hamburger"><span></span></span>
        <span className="notice-bar__category-label">Danh mục</span>

        {/* Dropdown */}
        <div className="notice-bar__dropdown" role="menu">
          <a className="notice-bar__dropdown-item" href="#"><span>🔹</span>Máy tính xách tay</a>
          <a className="notice-bar__dropdown-item" href="#"><span>🔹</span>Laptop Gaming - Đồ Họa</a>
          <a className="notice-bar__dropdown-item" href="#"><span>🔹</span>Laptop Văn phòng</a>
          <a className="notice-bar__dropdown-item" href="#"><span>🔹</span>Apple Macbook</a>
          <a className="notice-bar__dropdown-item" href="#"><span>🔹</span>RAM - SSD</a>
          <a className="notice-bar__dropdown-item" href="#"><span>🔹</span>Kho phụ kiện</a>
        </div>
      </div>

      {/* Cột 2 */}
      <a className="notice-bar__cell notice-bar__link" href="#">
        <span className="dot"></span>
        <span className="notice-bar__text">Đặt Lịch Hẹn Để Được Hỗ Trợ Tốt Hơn!</span>
      </a>
      {/* Cột 3 */}
      <a className="notice-bar__cell notice-bar__link" href="#">
        <span className="dot"></span>
        <span className="notice-bar__text">LEGION 2025 LINE-UP!</span>
      </a>
      {/* Cột 4 */}
      <a className="notice-bar__cell notice-bar__link" href="#">
        <span className="dot"></span>
        <span className="notice-bar__text">TỔNG HỢP LENOVO IDEAPAD 2024 - 2025!</span>
      </a>
    </div>
  );
};

export default NoticeBar;
