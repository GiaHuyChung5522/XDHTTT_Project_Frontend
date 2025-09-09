import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../assets/ProductCard.css";

const ProductCard = ({ 
  id,
  badge, 
  image, 
  name, 
  price, 
  version = "1 phiên bản",
  specifications = {},
  onCompare
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();
  
  const isLiked = isInWishlist(id);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const product = { id, name, price, image, badge, version, specifications };
    addToWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const product = { id, name, price, image, badge, version, specifications };
    addToCart(product);
  };

  const handleCardClick = () => {
    console.log("🔍 ProductCard - ID:", id, "Type:", typeof id);
    if (!id || id === 'undefined') {
      console.error("❌ ProductCard - ID không hợp lệ:", id);
      return;
    }
    navigate(`/products/${id}`);
  };

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
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
            onClick={handleLike}
          >
            <span className="heart-icon">♡</span>
            <span>Yêu thích</span>
          </button>
        </div>
      </div>

      {/* Action Button (shown on hover) */}
      {isHovered && (
        <div className="action-extension">
          <div className="action-buttons">
            <button 
              className="action-btn add-to-cart-btn"
              onClick={handleAddToCart}
              title="Thêm vào giỏ hàng"
            >
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductCard;

