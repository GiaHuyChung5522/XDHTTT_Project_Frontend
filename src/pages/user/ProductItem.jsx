import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useCart } from "../context/CartContext"; // Import context giỏ hàng
import { useState, useCallback } from "react";
import "./ProductItem.css";

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(n || 0)
  );

const ProductItem = ({ product }) => {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  if (!product) return null;

  const { id, name, price, image, badge } = product;
  const imgSrc = image || "/src/assets/img/sanpham1.jpg";

  // Debounce function to prevent double clicks
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Xử lý khi thêm vào giỏ
  const handleAddToCart = useCallback(debounce(() => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    addToCart(product); // Tăng số lượng
    
    setTimeout(() => setIsProcessing(false), 1000);
  }, 500), [isProcessing, product, addToCart]);

  return (
    <div
      className="product-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative" }}>
        {badge && <div className="product-item__badge">{badge}</div>}

        <Link to={`/products/${id}`} aria-label={`Xem chi tiết ${name}`}>
          <img
            src={imgSrc}
            alt={name}
            className="product-item__image"
            loading="lazy"
          />
        </Link>

        {hovered && (
          <div className="product-item__hover-buttons">
            <button
              className={`product-item__add-to-cart ${isProcessing ? 'processing' : ''}`}
              onClick={handleAddToCart}
              disabled={isProcessing}
            >
              🛒 {isProcessing ? 'Đang xử lý...' : 'Thêm vào giỏ'}
            </button>
            <button
              className="product-item__go-to-cart"
              onClick={() => navigate("/cart")}
            >
              Xem giỏ hàng
            </button>
          </div>
        )}
      </div>

      <div className="product-item__content">
        <h3 className="product-item__name">{name}</h3>
        <div className="product-item__price">{currency(price)}</div>
        <div className="product-item__footer">
          <span>1 phiên bản</span>
          <span>♡ Yêu thích</span>
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    badge: PropTypes.string,
  }),
};

export default ProductItem;

  