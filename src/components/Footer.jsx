const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-6">

          {/* Cột 1: Giới thiệu */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
            <p className="text-sm leading-relaxed">
              Thế giới điện thoại chuyên cung cấp điện thoại chính hãng,
              giá tốt, nhiều ưu đãi hấp dẫn.
            </p>
          </div>

          {/* Cột 2: Hỗ trợ */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:underline">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:underline">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:underline">Bảo hành & sửa chữa</a></li>
              <li><a href="#" className="hover:underline">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Cột 3: Chính sách */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Chính sách</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:underline">Bảo mật thông tin</a></li>
              <li><a href="#" className="hover:underline">Vận chuyển & giao hàng</a></li>
              <li><a href="#" className="hover:underline">Hình thức thanh toán</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="col-span-12 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="text-sm space-y-2">
              <li>Địa chỉ: 123 Lê Lợi, TP.HCM</li>
              <li>SĐT: 0909 123 456</li>
              <li>Email: cskh@thegioidienthoai.vn</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm">
          © 2025 Thế giới điện thoại. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
