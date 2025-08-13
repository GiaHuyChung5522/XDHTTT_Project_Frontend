import React from "react";

// Import các file CSS cần thiết
import "../../assets/styles/base.css"; // CSS cơ sở cho grid và layout chung
import "./Home.css"; // CSS dành riêng cho trang Home

// Import các components con sẽ được sử dụng trong trang Home
import Sidebar from "../../components/Sidebar";
import MainBanner from "../../components/MainBanner";
import NewsPanel from "../../components/NewsSection";
import ProductShowcase from "./ProductList";
import LaptopNeedsSection from "../../components/LaptopNeedsSection";


// Component chính của trang chủ
const Home = () => {
  return (
    // Gói toàn bộ nội dung trong home-container (max-width: 1200px)
    <div className="home-container">
      {/* Hàng đầu tiên: Sidebar - Main Banner - News Panel */}
      <div className="home__top-content">
        <aside className="home__sidebar">
          <Sidebar />
        </aside>
        <section className="home__main-banner">
          <MainBanner />
          <div className="home__news-grid">
            <div className="news-item">Tạm Ngưng Hỗ Trợ Kỹ Thuật, Bảo Dưỡng Bảo Hành Trong 4 ngày</div>
            <div className="news-item">Đặt Lịch Hẹn Trước Để Được Hỗ Trợ Tốt Hơn, Tại Sao Không?</div>
            <div className="news-item highlight">Thông Báo Lịch Làm Việc Dịp Đại Lễ 30/4 - 1/5</div>
            <div className="news-item">Thông Báo Bảo Trì Website</div>
          </div>
        </section>

        <aside className="home__news-panel">
          <NewsPanel />
        </aside>
      </div>

      {/* Hàng thứ hai: khu vực trưng bày sản phẩm */}

        <LaptopNeedsSection />
      
      <div className="home__product-showcase">
        <ProductShowcase />
      </div>

      <div className="home__product-showcase">
        <ProductShowcase />
      </div>
    </div>
  );
};

export default Home;
