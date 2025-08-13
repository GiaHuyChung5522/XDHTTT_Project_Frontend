import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page-container">
      <h1>404 - Trang không tìm thấy</h1>
      <p>Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="btn btn-primary">Về trang chủ</Link>
    </div>
  );
};

export default NotFound;
