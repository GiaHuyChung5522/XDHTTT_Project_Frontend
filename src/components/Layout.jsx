import React from 'react';
import '../assets/Layout.css';

const Layout = ({ title, children }) => {
  return (
    <div className="layout">
      <h1 className="title">{title}</h1>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
