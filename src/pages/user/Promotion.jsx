import React from 'react';
import './Promotion.css'; // Import file CSS để tạo kiểu
import { Link } from "react-router-dom";  // thêm import

// Dữ liệu mẫu cho các chương trình khuyến mãi
const promotionsData = [
  {
    id: 1,
    title: 'Back to School - Laptop Giảm Sốc!',
    description: 'Giảm giá lên đến 20% cho tất cả các dòng laptop sinh viên. Kèm quà tặng balo và chuột không dây.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    expiryDate: '2025-08-31', // Định dạng YYYY-MM-DD
    tag: 'Laptop'
  },
  {
    id: 2,
    title: 'Mua iPhone Mới - Tặng Sạc Nhanh 20W',
    description: 'Áp dụng cho các dòng iPhone 16 series. Nhận ngay củ sạc nhanh chính hãng Apple trị giá 500.000₫.',
    image: 'https://news.khangz.com/wp-content/uploads/2022/09/khung-vien-cua-nhung-phien-ban-iphone-14-duoc-lam-tu-titan-1-750x536.jpg',
    expiryDate: '2025-09-15',
    tag: 'Phụ Kiện'
  },
  {
    id: 3,
    title: 'Hệ Sinh Thái Apple - Giảm Thêm 15%',
    description: 'Giảm ngay 15% cho sản phẩm thứ hai (Apple Watch, AirPods) khi mua kèm iPhone hoặc MacBook.',
    image: 'https://cdn-media.sforum.vn/storage/app/media/ctv_seo8/h%C3%ACnh%20n%E1%BB%81n%20apple%20watch/hinh-nen-apple-watch-28.jpg',
    expiryDate: '2025-08-25',
    tag: 'Apple'
  }
];

// Hàm tính số ngày còn lại
const calculateDaysLeft = (expiryDate) => {
  const difference = +new Date(expiryDate) - +new Date();
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Đã kết thúc';
  if (days === 0) return 'Kết thúc hôm nay';
  return `Còn ${days} ngày`;
};

const Promotions = () => {
  return (
    <div className="promotions-container">
      <div className="promotions-header">
        <h1>Ưu Đãi Hấp Dẫn</h1>
        <p>Khám phá các chương trình khuyến mãi đặc biệt chỉ có tại KINZ!</p>
      </div>

      <div className="promotions-grid">
        {promotionsData.map(promo => (
          <div className="promo-card" key={promo.id}>
            <div className="promo-image-wrapper">
              <img src={promo.image} alt={promo.title} className="promo-image" />
              <span className="promo-tag">{promo.tag}</span>
            </div>
            <div className="promo-content">
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
              <div className="promo-footer">
                <span className="promo-expiry">
                  <i className="fas fa-clock"></i> {calculateDaysLeft(promo.expiryDate)}
                </span>
                <Link to={`/khuyen-mai/${promo.id}`} className="promo-button">
                  Xem Chi Tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;