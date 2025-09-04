import React, { useState } from "react";
import "../assets/ProductCard.css";

const ProductCard = ({ 
  badge, 
  image, 
  name, 
  price, 
  version = "1 phiên bản",
  specifications = {},
  isLiked = false,
  onLike,
  onAddToCart,
  onCompare
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {badge && <div className="product-badge">{badge}</div>}
      
      {/* Product Image */}
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price.toLocaleString()}₫</p>
        
        <div className="product-footer">
          <span className="version">{version}</span>
          <button 
            className={`wishlist-btn ${isLiked ? 'liked' : ''}`}
            onClick={onLike}
          >
            <span className="heart-icon">♡</span>
            <span>Yêu thích</span>
          </button>
        </div>
      </div>

      {/* Specifications Overlay (shown on hover) */}
      {isHovered && (
        <div className="specifications-overlay">
          <div className="specifications-content">
            {specifications.cpu && (
              <div className="spec-item">
                <span className="spec-label">CPU:</span>
                <span className="spec-value">{specifications.cpu}</span>
              </div>
            )}
            {specifications.ram && (
              <div className="spec-item">
                <span className="spec-label">RAM:</span>
                <span className="spec-value">{specifications.ram}</span>
              </div>
            )}
            {specifications.screen && (
              <div className="spec-item">
                <span className="spec-label">Màn hình:</span>
                <span className="spec-value">{specifications.screen}</span>
              </div>
            )}
            {specifications.graphics && (
              <div className="spec-item">
                <span className="spec-label">Đồ họa:</span>
                <span className="spec-value">{specifications.graphics}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons (shown on hover) */}
      {isHovered && (
        <div className="action-buttons">
          <button 
            className="action-btn add-to-cart-btn"
            onClick={onAddToCart}
            title="Thêm vào giỏ hàng"
          >
            🛒
          </button>
          <button 
            className="action-btn compare-btn"
            onClick={onCompare}
            title="So sánh"
          >
            ⚖️
            <span>So sánh</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;

