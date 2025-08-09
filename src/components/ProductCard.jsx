import React from "react";
import "../assets/ProductCard.css";

const ProductCard = ({ badge, image, name, price, version }) => {
  return (
    <div className="product-card">
      {badge && <div className="badge">{badge}</div>}
      <img src={image} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-price">{price.toLocaleString()}₫</p>
      <div className="product-footer">
        {version && <span className="version">{version}</span>}
        <span className="wishlist">♡ Yêu thích</span>
      </div>
    </div>
  );
};

export default ProductCard;
