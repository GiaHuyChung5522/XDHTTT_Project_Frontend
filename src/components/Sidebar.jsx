import React from 'react';
import '../assets/Sidebar.css';

const SidebarMenu = () => {
  const categories = [
    "Máy tính xách tay",
    "Laptop Gaming - Đồ Họa",
    "Laptop Văn phòng",
    "Laptop Lập trình",
    "Laptop cao cấp",
    "Apple Macbook",
    "RAM - SSD",
    "Kho phụ kiện",
    "Cổng chuyển",
    "Tản nhiệt laptop"
  ];

  return (
    <div className="sidebar-menu">
      <h2 className="sidebar-title">DANH MỤC</h2>
      <ul className="sidebar-list">
        {categories.map((cat, idx) => (
          <li key={idx} className="sidebar-item">
            <span>🔹</span> {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
