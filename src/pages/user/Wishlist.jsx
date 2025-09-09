import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>Danh sách yêu thích</h1>
          <p>Danh sách sản phẩm bạn đã thêm vào yêu thích</p>
        </div>
        
        <div className="wishlist-empty">
          <div className="empty-icon">💝</div>
          <h3>Danh sách yêu thích trống</h3>
          <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
          <Link to="/" className="btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>Danh sách yêu thích</h1>
        <p>{wishlistItems.length} sản phẩm trong danh sách yêu thích</p>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((product) => (
          <div key={product.id} className="wishlist-item">
            <div className="wishlist-item__image">
              <img src={product.imageUrl || product.image} alt={product.name} />
              <div className="wishlist-item__badge">
                {product.badge || "Sẵn Hàng"}
              </div>
            </div>

            <div className="wishlist-item__content">
              <h3 className="wishlist-item__name">{product.name}</h3>
              <p className="wishlist-item__price">
                {product.price.toLocaleString()}₫
              </p>
              <p className="wishlist-item__version">
                {product.version || "1 phiên bản"}
              </p>
            </div>

            <div className="wishlist-item__actions">
              <button 
                className="btn-add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
                🛒 Thêm vào giỏ hàng
              </button>
              <button 
                className="btn-remove"
                onClick={() => handleRemoveFromWishlist(product.id)}
                title="Xóa khỏi yêu thích"
              >
                ❌
              </button>
            </div>

            <div className="wishlist-item__date">
              Đã thêm: {new Date(product.addedAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        ))}
      </div>

      <div className="wishlist-footer">
        <Link to="/" className="btn-secondary">
          Tiếp tục mua sắm
        </Link>
        <Link to="/cart" className="btn-primary">
          Xem giỏ hàng
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;