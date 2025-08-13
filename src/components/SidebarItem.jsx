import React from 'react';
import './Sidebar.css';

const SidebarItem = ({ item, isActive, onClick }) => {
  const { name, submenu } = item;
  
  return (
    <div className="sidebar-item">
      <div 
        className={`sidebar-item__header ${isActive ? 'active' : ''}`}
        onClick={() => onClick(name)}
      >
        <span className="sidebar-item__icon">🔹</span>
        <span className="sidebar-item__name">{name}</span>
        {submenu && (
          <span className="sidebar-item__arrow">
            {isActive ? '▼' : '▶'}
          </span>
        )}
      </div>
      
      {submenu && isActive && (
        <ul className="sidebar-item__submenu">
          {submenu.map((subItem, index) => (
            <li key={index} className="sidebar-item__submenu-item">
              {subItem}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarItem;
