import React from "react";

// Import các file CSS cần thiết
import "../../assets/styles/base.css"; // CSS cơ sở cho grid và layout chung
import "./Home.css"; // CSS dành riêng cho trang Home


// Import các components con sẽ được sử dụng trong trang Home
import Sidebar from "../../components/Sidebar";
import MainBanner from "../../components/MainBanner";
import NewsPanel from "../../components/NewsSection";
import ProductShowcase from "./ProductList";

// Component chính của trang chủ
const Home = () => {
  return (
    // Sử dụng .container để giới hạn chiều rộng và căn giữa nội dung chính
    // 'home' là Block chính theo BEM
    <div className="home container">
      
      {/* Hàng đầu tiên: chứa Sidebar, Main Banner và News Panel */}
      
      <div className="row home__top-content">
        <aside className="home__sidebar">
          <Sidebar />
        </aside>
        <section className="home__main-banner">
          <MainBanner />
        </section>
        <aside className="home__news-panel">
          <NewsPanel />
        </aside>
      </div>

      {/* Hàng thứ hai: chứa khu vực trưng bày sản phẩm */}
      <div className="row">
        
        {/* Cột này chiếm toàn bộ 12/12 chiều rộng để hiển thị danh sách sản phẩm */}
        <div className="col-12">
          {/* 'home__product-showcase' là một Element của 'home' */}
          <div className="home__product-showcase">
            <ProductShowcase /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;