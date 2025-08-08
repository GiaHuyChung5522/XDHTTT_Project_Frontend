import React, { useState, useEffect } from "react";
import "./ProductList.css"; // CSS dành riêng cho danh sách sản phẩm
import productsData from "../../data/products.json"; // Import trực tiếp file JSON

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Không cần fetch, gán dữ liệu trực tiếp từ file đã import
    setProducts(productsData);
  }, []);

  return (
    <div className="product-showcase">
      <h2 className="product-showcase__title">Sản phẩm nổi bật</h2>
      <div className="product-showcase__grid">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img
              src={product.image}
              alt={product.name}
              className="product-item__image"
            />
            <h3 className="product-item__name">{product.name}</h3>
            <p className="product-item__description">{product.description}</p>
            <p className="product-item__price">{product.price} VND</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;
