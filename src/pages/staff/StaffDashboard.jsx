import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/product');
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

  const updateProduct = async (productId, updates) => {
    try {
      await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      loadProducts(); // Reload danh sách
    } catch (error) {
      console.error('Lỗi cập nhật product:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      loadOrders(); // Reload danh sách
    } catch (error) {
      console.error('Lỗi cập nhật order:', error);
    }
  };

  return (
    <div className="staff-dashboard">
      <div className="staff-header">
      <h1>Staff Dashboard</h1>
        <p>Quản lý sản phẩm và đơn hàng</p>
      </div>

      <div className="staff-tabs">
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

      <div className="staff-content">
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
                    <button className="btn-view">Xem</button>
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
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="btn-view">Chi tiết</button>
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

export default StaffDashboard;