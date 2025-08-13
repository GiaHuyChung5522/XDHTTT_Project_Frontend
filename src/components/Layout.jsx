import React from 'react';
import '../assets/styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export default Layout;
