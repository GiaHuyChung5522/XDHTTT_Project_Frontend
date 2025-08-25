// src/pages/user/PromotionDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./PromotionDetail.css"; // CSS riêng cho trang chi tiết

// Danh sách chương trình khuyến mãi
const promotionsData = [
  {
    id: 1,
    title: "Back to School - Laptop Giảm Sốc!",
    description: `
🎓 **Back to School 2025 - Đồng hành cùng sinh viên**

- Giảm ngay **10% - 20%** cho tất cả các dòng laptop sinh viên: Acer, Asus, HP, Dell, Lenovo.
- Tặng kèm balo thời trang trị giá **500.000đ** và chuột không dây Logitech chính hãng.
- **Hỗ trợ trả góp 0%** lãi suất qua thẻ tín dụng nhiều ngân hàng.
- Cài đặt phần mềm học tập cơ bản (Word, Excel, Teams, Zoom) miễn phí.

👉 Đây là cơ hội vàng để bạn sở hữu chiếc laptop hiệu năng cao, giá siêu ưu đãi để học tập, làm việc và giải trí.
    `,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    expiryDate: "2025-08-31",
    tag: "Laptop",
  },
  {
    id: 2,
    title: "Mua iPhone Mới - Tặng Sạc Nhanh 20W",
    description: `
📱 **Sở hữu iPhone 16 Series - Nhận quà tặng chính hãng**

- Khi mua iPhone 16 Series, tặng ngay **củ sạc nhanh Apple 20W** trị giá **500.000đ**.
- Tặng thêm miếng **dán cường lực cao cấp** và hỗ trợ cài đặt máy miễn phí.
- **Bảo hành chính hãng 12 tháng**, đổi mới trong 30 ngày nếu lỗi từ nhà sản xuất.
- Hỗ trợ **trả góp 0% lãi suất**, chỉ cần CMND + CCCD.

👉 iPhone 16 với chip A18 Bionic mạnh mẽ, camera nâng cấp vượt trội và màn hình ProMotion sẽ mang lại trải nghiệm đỉnh cao.
    `,
    image:
      "https://news.khangz.com/wp-content/uploads/2022/09/khung-vien-cua-nhung-phien-ban-iphone-14-duoc-lam-tu-titan-1-750x536.jpg",
    expiryDate: "2025-09-15",
    tag: "iPhone",
  },
  {
    id: 3,
    title: "Hệ Sinh Thái Apple - Giảm Thêm 15%",
    description: `
🍎 **Trải nghiệm hệ sinh thái Apple - Giảm thêm 15%**

- Giảm ngay **15% cho sản phẩm thứ hai** khi mua kèm iPhone hoặc MacBook.
- Áp dụng cho **Apple Watch, AirPods, iPad** và các phụ kiện Apple chính hãng.
- Tặng thêm **3 tháng Apple Music** và **50GB iCloud** miễn phí.
- Tư vấn đồng bộ thiết bị: nghe gọi, nhắn tin, nhận thông báo liền mạch trên tất cả sản phẩm.

👉 Đây là cơ hội tuyệt vời để bạn nâng cấp toàn bộ thiết bị Apple với chi phí tiết kiệm mà vẫn tận hưởng sự tiện lợi.
    `,
    image:
      "https://cdn-media.sforum.vn/storage/app/media/ctv_seo8/h%C3%ACnh%20n%E1%BB%81n%20apple%20watch/hinh-nen-apple-watch-28.jpg",
    expiryDate: "2025-08-25",
    tag: "Apple",
  },
];

// Hàm tính số ngày còn lại
const calculateDaysLeft = (expiryDate) => {
  const difference = +new Date(expiryDate) - +new Date();
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
  if (days < 0) return "Đã kết thúc";
  if (days === 0) return "Kết thúc hôm nay";
  return `Còn ${days} ngày`;
};

const PromotionDetail = () => {
  const { id } = useParams();
  const promotion = promotionsData.find((p) => p.id === parseInt(id));

  if (!promotion) {
    return <h2>Không tìm thấy khuyến mãi</h2>;
  }

  return (
    <div className="promotion-detail-container">
      <h1>{promotion.title}</h1>
      <div className="promotion-detail-meta">
        <strong>⏳ Hạn sử dụng:</strong> {calculateDaysLeft(promotion.expiryDate)}
      </div>
      <img
        src={promotion.image}
        alt={promotion.title}
        className="promotion-detail-image"
      />
      <div className="promotion-detail-content">
        <ReactMarkdown>{promotion.description}</ReactMarkdown>
      </div>
      <Link to="/khuyen-mai" className="back-to-promotions">
        ← Quay lại danh sách khuyến mãi
      </Link>
    </div>
  );
};

export default PromotionDetail;
