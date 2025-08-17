import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadUsers();
    loadProducts();
    loadOrders();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Lỗi load users:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Lỗi load products:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Lỗi load orders:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Quản lý Users</h2>
            <div className="users-grid">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>Email: {user.email}</p>
                    <p>Role: <span className={`role role-${user.role}`}>{user.role}</span></p>
                  </div>
                  <div className="user-actions">
                    <button className="btn-edit">Sửa</button>
                    <button className="btn-delete">Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <h2>Quản lý Products</h2>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>Giá: {product.price}</p>
                    <p>{product.description}</p>
                  </div>
                  <div className="product-actions">
                    <button className="btn-edit">Sửa</button>
                    <button className="btn-delete">Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Quản lý Orders</h2>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p>Status: {order.status}</p>
                    <p>Total: {order.total}</p>
                  </div>
                  <div className="order-actions">
                    <button className="btn-edit">Cập nhật</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;