import React, { useState, useCallback } from "react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();
  
  const isLiked = isInWishlist(id);

  // Debounce function to prevent double clicks
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const handleLike = useCallback(debounce((e) => {
    if (isProcessing) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);
    
    const product = { id, name, price, image, badge, version, specifications };
    addToWishlist(product);
    
    setTimeout(() => setIsProcessing(false), 1000);
  }, 500), [isProcessing, id, name, price, image, badge, version, specifications, addToWishlist]);

  const handleAddToCart = useCallback(debounce((e) => {
    if (isProcessing) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);
    
    const product = { id, name, price, image, badge, version, specifications };
    addToCart(product);
    
    setTimeout(() => setIsProcessing(false), 1000);
  }, 500), [isProcessing, id, name, price, image, badge, version, specifications, addToCart]);

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
            className={`wishlist-btn ${isLiked ? 'liked' : ''} ${isProcessing ? 'processing' : ''}`}
            onClick={handleLike}
            disabled={isProcessing}
          >
            <span className="heart-icon">♡</span>
            <span>{isProcessing ? 'Đang xử lý...' : 'Yêu thích'}</span>
          </button>
        </div>
      </div>

      {/* Action Button (shown on hover) */}
      {isHovered && (
        <div className="action-extension">
          <div className="action-buttons">
            <button 
              className={`action-btn add-to-cart-btn ${isProcessing ? 'processing' : ''}`}
              onClick={handleAddToCart}
              disabled={isProcessing}
              title="Thêm vào giỏ hàng"
            >
              🛒 {isProcessing ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductCard;

