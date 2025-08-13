import React from 'react';

const ApplePage = () => {
  return (
    <div className="page-container">
      <h1>Apple Products</h1>
      <p>Khám phá các sản phẩm Apple chính hãng với giá tốt nhất.</p>
      <div className="apple-products">
        <div className="product-category">
          <h2>iPhone</h2>
          <p>iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max</p>
        </div>
        <div className="product-category">
          <h2>MacBook</h2>
          <p>MacBook Air, MacBook Pro với chip M2, M3</p>
        </div>
        <div className="product-category">
          <h2>iPad</h2>
          <p>iPad Air, iPad Pro, iPad mini</p>
        </div>
      </div>
    </div>
  );
};

export default ApplePage;
