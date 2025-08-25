// src/pages/NewsDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import khaiTruongChiNhanh from "../../assets/img/khaiTruongChiNhanh.jpg";
import "./NewsDetail.css";

const newsData = [
  {
    id: 1,
    title: "Đánh giá chi tiết MacBook Pro M4: Sức mạnh vượt trội cho dân sáng tạo",
    content: [
      "Chip M4 mới của Apple không chỉ nhanh hơn mà còn tiết kiệm pin đáng kinh ngạc. Trong các bài benchmark, hiệu suất CPU tăng trung bình 20% so với M3, trong khi GPU cũng được cải thiện rõ rệt.",
      "Nhờ công nghệ sản xuất 3nm, MacBook Pro M4 có thể duy trì hiệu suất cao trong thời gian dài mà không quá nóng, giúp trải nghiệm render video, dựng 3D mượt mà hơn.",
      "Điểm cộng lớn là thời lượng pin: Apple công bố 22 tiếng xem video liên tục, và trong thử nghiệm thực tế máy hoàn toàn có thể trụ cả ngày làm việc nặng."
    ],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    category: "Đánh giá",
    date: "18 tháng 8, 2025"
  },
  {
    id: 2,
    title: "Top 5 tai nghe chống ồn tốt nhất bạn có thể mua hè này",
    content: [
      "Nếu bạn thường xuyên đi máy bay, đi làm ở môi trường ồn ào thì tai nghe chống ồn là món đồ không thể thiếu.",
      "Sony WH-1000XM5 tiếp tục dẫn đầu nhờ khả năng chống ồn chủ động (ANC) cực tốt và chất âm cân bằng.",
      "Bose 700 vẫn là lựa chọn tuyệt vời cho dân văn phòng với mic thoại siêu trong trẻo.",
      "AirPods Max phù hợp với hệ sinh thái Apple, chất lượng hoàn thiện cao và dễ dàng kết nối với iPhone, iPad."
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    category: "Tư vấn",
    date: "15 tháng 8, 2025"
  },
  {
    id: 3,
    title: "Hướng dẫn build PC Gaming 30 triệu tối ưu hiệu năng",
    content: [
      "Với ngân sách 30 triệu, bạn hoàn toàn có thể sở hữu một dàn PC mạnh mẽ chiến mọi game AAA ở mức thiết lập cao.",
      "CPU: Intel Core i5-13600KF hoặc AMD Ryzen 7 7700X – hiệu năng/giá thành rất tốt.",
      "GPU: NVIDIA RTX 4070 12GB – chơi mượt hầu hết game ở 2K, thậm chí 4K medium.",
      "RAM: 32GB DDR5 6000MHz – thoải mái cho gaming, streaming và dựng video.",
      "Ngoài ra nên đầu tư SSD NVMe 1TB và nguồn 750W chuẩn 80+ Gold để hệ thống hoạt động ổn định lâu dài."
    ],
    image: "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/08/build-pc-do-hoa-30-trieu-3.jpg",
    category: "Hướng dẫn",
    date: "12 tháng 8, 2025"
  },
  {
    id: 4,
    title: "KINZ khai trương chi nhánh mới tại Hà Nội",
    content: [
      "Ngày 10/8/2025, KINZ chính thức khai trương chi nhánh mới tại quận Cầu Giấy, Hà Nội.",
      "Khách hàng mang thiết bị cũ đến sẽ được định giá và thu cũ đổi mới với mức trợ giá cực tốt.",
      "Trong tuần khai trương, KINZ tặng hàng nghìn voucher giảm giá lên đến 20% cho các sản phẩm laptop, PC gaming, phụ kiện.",
      "Sự kiện có sự góp mặt của nhiều KOL công nghệ và livestream trải nghiệm sản phẩm ngay tại cửa hàng."
    ],
    image: khaiTruongChiNhanh,
    category: "Tin tức",
    date: "10 tháng 8, 2025"
  }
];

const NewsDetail = () => {
  const { id } = useParams();
  const article = newsData.find(item => item.id === parseInt(id));

  if (!article) {
    return (
      <div className="news-detail">
        <h2>Bài viết không tồn tại</h2>
        <Link to="/tin-tuc" className="back-to-news">← Quay lại Tin tức</Link>
      </div>
    );
  }

  return (
    <div className="news-detail-container">
      <h1>{article.title}</h1>
      <p className="news-detail-meta">
        <strong>{article.category}</strong> • <i>{article.date}</i>
      </p>
      <img src={article.image} alt={article.title} className="news-detail-image" />

      <div className="news-detail-content">
        {article.content.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      <Link to="/tin-tuc" className="back-to-news">← Quay lại Tin tức</Link>
    </div>
  );
};

export default NewsDetail;
