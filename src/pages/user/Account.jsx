import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="page-container">
      <h1>Tài khoản của tôi</h1>
      <p>Xin chào, {user?.name || 'Khách'}!</p>
      <div className="account-info">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Vai trò:</strong> {user?.role}</p>
      </div>
      
      <div className="account-actions" style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🏠 Về trang chủ mua hàng
        </button>
        
        <button 
          onClick={() => navigate('/profile')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ⚙️ Quản lý tài khoản
        </button>
      </div>
    </div>
  );
};

export default Account;
