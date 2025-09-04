import React from 'react';
import './Sidebar.css';

const SidebarMenu = () => {
  const categories = [
    { name: "Laptop văn phòng", href: "/products?category=laptop-van-phong" },
    { name: "Laptop gaming", href: "/products?category=laptop-gaming" },
  ];

  return (
    <div className="sidebar-menu">
      <h2 className="sidebar-title">DANH MỤC</h2>
      <ul className="sidebar-list">
        {categories.map((cat, idx) => (
          <li key={idx} className="sidebar-item">
            <a href={cat.href}>
              <span>🔹</span> {cat.name}
            </a>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default SidebarMenu;
