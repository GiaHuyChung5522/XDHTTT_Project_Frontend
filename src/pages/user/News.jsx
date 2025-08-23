// src/pages/user/News.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './News.css'; 
import khaiTruongChiNhanh from "../../assets/img/khaiTruongChiNhanh.jpg";

// Dữ liệu mẫu
const newsData = [
  {
    id: 1,
    title: 'Đánh giá chi tiết MacBook Pro M4: Sức mạnh vượt trội cho dân sáng tạo',
    excerpt: 'Chip M4 mới của Apple không chỉ nhanh hơn mà còn tối ưu hóa điện năng...',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    category: 'Đánh giá',
    date: '18 tháng 8, 2025'
  },
  {
    id: 2,
    title: 'Top 5 tai nghe chống ồn tốt nhất bạn có thể mua hè này',
    excerpt: 'Từ Sony, Bose đến Apple, chúng tôi đã tổng hợp những lựa chọn...',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    category: 'Tư vấn',
    date: '15 tháng 8, 2025'
  },
  {
    id: 3,
    title: 'Hướng dẫn build PC Gaming 30 triệu tối ưu hiệu năng',
    excerpt: 'Với ngân sách 30 triệu, bạn có thể xây dựng một bộ máy tính chơi game mạnh mẽ...',
    image: 'https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/08/build-pc-do-hoa-30-trieu-3.jpg',
    category: 'Hướng dẫn',
    date: '12 tháng 8, 2025'
  },
  {
    id: 4,
    title: 'KINZ khai trương chi nhánh mới tại Hà Nội',
    excerpt: 'Mang các thiết bị cũ của bạn đến KINZ để được định giá và lên đời...',
    image: khaiTruongChiNhanh,
    category: 'Tin tức',
    date: '10 tháng 8, 2025'
  }
];

const featuredArticle = newsData[0];
const otherArticles = newsData.slice(1);

const News = () => {
  return (
    <div className="news-page-container">
      <div className="news-header">
        <h1>Góc Công Nghệ</h1>
        <p>Cập nhật những tin tức, bài đánh giá và tư vấn công nghệ mới nhất từ KINZ.</p>
      </div>

      {/* --- Bài viết nổi bật --- */}
      <div className="featured-article">
        <div className="featured-image-wrapper">
          <img src={featuredArticle.image} alt={featuredArticle.title} />
        </div>
        <div className="featured-content">
          <span className="news-category">{featuredArticle.category}</span>
          <h2>
            <Link to={`/tin-tuc/${featuredArticle.id}`}>{featuredArticle.title}</Link>
          </h2>
          <p className="news-excerpt">{featuredArticle.excerpt}</p>
          <div className="news-meta">
            <span><i className="fas fa-calendar-alt"></i> {featuredArticle.date}</span>
          </div>
          <Link to={`/tin-tuc/${featuredArticle.id}`} className="read-more-btn">
            Đọc tiếp &rarr;
          </Link>
        </div>
      </div>

      <div className="divider"></div>

      {/* --- Lưới các bài viết khác --- */}
      <div className="news-grid">
        {otherArticles.map(article => (
          <div className="news-card" key={article.id}>
            <div className="news-image-wrapper">
              <Link to={`/tin-tuc/${article.id}`}>
                <img src={article.image} alt={article.title} />
              </Link>
              <span className="news-category">{article.category}</span>
            </div>
            <div className="news-card-content">
              <h3>
                <Link to={`/tin-tuc/${article.id}`}>{article.title}</Link>
              </h3>
              <div className="news-meta">
                <span><i className="fas fa-calendar-alt"></i> {article.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
