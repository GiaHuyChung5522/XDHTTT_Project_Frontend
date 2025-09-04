# 🛍️ 7Gr Fashion Store - Frontendcd FE_web && git add README.md


## 🚀 Cách chạy nhanh

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy ứng dụng
```bash
npm run dev
```

### 3. Mở trình duyệt
```
http://localhost:5173
```

## 📱 Tính năng chính

- **🏠 Trang chủ:** Hiển thị sản phẩm nổi bật
- **🛒 Giỏ hàng:** Thêm/xóa sản phẩm, thanh toán
- **❤️ Yêu thích:** Lưu sản phẩm yêu thích
- **👤 Tài khoản:** Đăng nhập, đăng ký, quản lý profile
- **🔍 Tìm kiếm:** Tìm kiếm sản phẩm theo tên, giá
- **📱 Responsive:** Tương thích mọi thiết bị

## 🎨 Giao diện

- **ProductCard:** Hover hiển thị nút "Thêm vào giỏ hàng"
- **Header:** Giỏ hàng, yêu thích, địa chỉ cửa hàng
- **Floating buttons:** Liên hệ nhanh (Call, Zalo, Messenger)
- **Notification:** Thông báo real-time

## 🔧 Công nghệ

- **React 18** + **Vite**
- **React Router** - Điều hướng
- **Ant Design** - UI Components
- **Tailwind CSS** - Styling
- **Framer Motion** - Animation
- **Context API** - State Management

## 📁 Cấu trúc thư mục

```
src/
├── components/     # Components tái sử dụng
├── pages/         # Trang chính
├── context/       # State management
├── services/      # API calls
├── assets/        # Hình ảnh, CSS
└── utils/         # Utilities
```

## 🌐 API Backend

- **Base URL:** `http://localhost:3000`
- **Proxy:** Vite tự động proxy `/api/*` → `http://localhost:3000/*`

## 👨‍💻 Admin Panel

- **URL:** `http://localhost:5173/admin/login`
- **Tính năng:** Quản lý sản phẩm, đơn hàng, khách hàng
- **Chi tiết:** Xem `ADMIN_SYSTEM_GUIDE.md`

## 🐛 Troubleshooting

### Lỗi thường gặp:
1. **Port 5173 đã được sử dụng:** Đổi port trong `vite.config.ts`
2. **API không kết nối:** Kiểm tra backend đang chạy
3. **Dependencies lỗi:** Xóa `node_modules` và chạy lại `npm install`

## 📞 Hỗ trợ

- **Email:** support@7grfashion.com
- **Hotline:** 1900-xxxx
- **Zalo:** 7Gr Fashion Store

---
**© 2024 7Gr Fashion Store. All rights reserved.**