import React from 'react';
import './About.css'; // Import file CSS để tạo kiểu
import logoCuaHang from "../../assets/img/logoCuaHang.png"

// Bạn có thể thay đổi link ảnh này bằng ảnh cửa hàng hoặc team của bạn
const storeImage = logoCuaHang;

const About = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>Về KINZ</h1>
        <p>Hơn cả một cửa hàng, chúng tôi là người bạn đồng hành trên hành trình khám phá công nghệ của bạn.</p>
      </div>

      <div className="about-story-section">
        <div className="story-image">
          <img src={storeImage} alt="Cửa hàng TechZone" />
        </div>
        <div className="story-content">
          <h2>Câu Chuyện Của Chúng Tôi</h2>
          <p>
            <strong>KINZ</strong> được thành lập vào năm 2020 với một mục tiêu đơn giản: mang những sản phẩm công nghệ chính hãng, chất lượng cao với mức giá tốt nhất đến tay người tiêu dùng Việt Nam. Chúng tôi nhận thấy rằng việc lựa chọn một thiết bị điện tử ưng ý giữa vô vàn lựa chọn có thể rất khó khăn. 
          </p>
          <p>
            Vì vậy, KINZ ra đời không chỉ để bán hàng, mà còn để tư vấn, chia sẻ và giúp bạn đưa ra quyết định thông minh nhất. Đội ngũ của chúng tôi là những người đam mê công nghệ, luôn cập nhật những xu hướng mới nhất để sẵn sàng hỗ trợ bạn.
          </p>
        </div>
      </div>

      <div className="about-commitments-section">
        <h2>Cam Kết Của Chúng Tôi</h2>
        <div className="commitments-grid">
          {/* Commitment Card 1 */}
          <div className="commitment-card">
            <i className="fas fa-medal"></i>
            <h3>Chất Lượng Hàng Đầu</h3>
            <p>Chúng tôi cam kết 100% sản phẩm là hàng chính hãng, có nguồn gốc xuất xứ rõ ràng và được bảo hành theo tiêu chuẩn của nhà sản xuất.</p>
          </div>

          {/* Commitment Card 2 */}
          <div className="commitment-card">
            <i className="fas fa-hand-holding-usd"></i>
            <h3>Giá Cả Cạnh Tranh</h3>
            <p>Luôn nỗ lực mang đến mức giá tốt nhất thị trường cùng nhiều chương trình khuyến mãi hấp dẫn để tối ưu chi phí cho khách hàng.</p>
          </div>

          {/* Commitment Card 3 */}
          <div className="commitment-card">
            <i className="fas fa-headset"></i>
            <h3>Dịch Vụ Vượt Trội</h3>
            <p>Với đội ngũ tư vấn viên chuyên nghiệp và chính sách hậu mãi chu đáo, chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7, trước và sau khi mua hàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;