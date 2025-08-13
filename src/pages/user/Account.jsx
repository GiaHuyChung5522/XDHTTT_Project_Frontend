import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Account = () => {
  const { user } = useAuth();
  
  return (
    <div className="page-container">
      <h1>Tài khoản của tôi</h1>
      <p>Xin chào, {user?.name || 'Khách'}!</p>
      <div className="account-info">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Vai trò:</strong> {user?.role}</p>
      </div>
    </div>
  );
};

export default Account;
