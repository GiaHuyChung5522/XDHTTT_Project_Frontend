import React from 'react';
import './Sidebar.css';

const SidebarMenu = () => {
  const categories = [
    {
      name: "Máy tính xách tay",
      submenu: ["ACER", "DELL", "HP", "LENOVO", "APPLE"]
    },
    {
      name: "Laptop Gaming - Đồ Họa",
      submenu: ["RTX 4060", "RTX 4070", "RTX 4080"]
    },
    {
      name: "Laptop Văn phòng",
      submenu: ["Core i5", "Core i7", "Ryzen 5"]
    },
    {
      name: "Apple Macbook",
      submenu: ["MacBook Air", "MacBook Pro"]
    },
    // Các mục khác nếu không cần submenu thì có thể bỏ qua submenu
    { name: "RAM - SSD" },
    { name: "Kho phụ kiện" },
    { name: "Cổng chuyển" },
    { name: "Tản nhiệt laptop" }
  ];

  return (
    <div className="sidebar-menu">
      <h2 className="sidebar-title">DANH MỤC</h2>
      <ul className="sidebar-list">
        {categories.map((cat, idx) => (
          <li key={idx} className="sidebar-item">
            <span>🔹</span> {cat.name}
            {cat.submenu && (
              <ul className="submenu">
                {cat.submenu.map((sub, subIdx) => (
                  <li key={subIdx} className="submenu-item">{sub}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
