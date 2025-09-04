import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import './UserProfile.css';

const UserProfile = () => {
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'Nam',
    birth: '',
    address: '',
    telephone: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        gender: user.gender || 'Nam',
        birth: user.birth ? user.birth.split('T')[0] : '',
        address: user.address || '',
        telephone: user.telephone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Cập nhật thông tin user
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        birth: formData.birth || undefined,
        address: formData.address || undefined,
        telephone: formData.telephone || undefined
      };

      console.log('Updating user profile:', updateData);
      
      // Gọi API cập nhật user (cần implement endpoint này trong BE)
      // const response = await api.patch(`/user/${user.id}`, updateData);
      
      // Tạm thời cập nhật local state
      const updatedUser = {
        ...user,
        ...updateData,
        name: `${formData.firstName} ${formData.lastName}`
      };
      
      // Cập nhật localStorage
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      auth.user = updatedUser;
      localStorage.setItem('auth', JSON.stringify(auth));
      
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      setEditing(false);
      
      // Reload page để cập nhật context
      window.location.reload();
      
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage({ type: 'error', text: 'Cập nhật thông tin thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="user-profile-container">
        <div className="profile-error">
          <h2>Chưa đăng nhập</h2>
          <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
          <button onClick={() => window.location.href = '/auth/login'} className="btn-primary">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
        <div className="profile-actions">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary">
              Chỉnh sửa
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={() => setEditing(false)} className="btn-cancel">
                Hủy
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-info">
          <div className="info-section">
            <h3>Thông tin cơ bản</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Họ</label>
                {editing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{user.firstName || 'Chưa cập nhật'}</div>
                )}
              </div>
              <div className="form-group">
                <label>Tên</label>
                {editing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{user.lastName || 'Chưa cập nhật'}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="info-value">{user.email}</div>
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              {editing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              ) : (
                <div className="info-value">{user.gender || 'Chưa cập nhật'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              {editing ? (
                <input
                  type="date"
                  name="birth"
                  value={formData.birth}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <div className="info-value">
                  {user.birth ? new Date(user.birth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Thông tin liên hệ</h3>
            <div className="form-group">
              <label>Địa chỉ</label>
              {editing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập địa chỉ"
                />
              ) : (
                <div className="info-value">{user.address || 'Chưa cập nhật'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              {editing ? (
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <div className="info-value">{user.telephone || 'Chưa cập nhật'}</div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Tài khoản</h3>
            <div className="form-group">
              <label>Vai trò</label>
              <div className="info-value">
                <span className={`role-badge role-${user.role}`}>
                  {user.role === 'admin' ? 'Quản trị viên' : 
                   user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions-bottom">
          <button onClick={handleLogout} className="btn-danger">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
