


# 💻 Demo Cửa Hàng Bán Laptop - Nhóm 7

**Trường:** Đại học Tài nguyên và Môi trường TP.HCM (UTH)  
**Môn:** Xây Dựng Hệ Thống Thông Tin  
**Nhóm:** 7  
**Đề tài:** Demo cửa hàng bán laptop  

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

## 📱 Tính năng demo

- **🏠 Trang chủ:** Hiển thị laptop nổi bật
- **🛒 Giỏ hàng:** Thêm/xóa laptop, thanh toán
- **❤️ Yêu thích:** Lưu laptop yêu thích
- **👤 Tài khoản:** Đăng nhập, đăng ký, quản lý profile
- **🔍 Tìm kiếm:** Tìm kiếm laptop theo tên, giá
- **📱 Responsive:** Tương thích mọi thiết bị
- **👨‍💻 Admin:** Quản lý sản phẩm, đơn hàng, khách hàng

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

## 👥 Thành viên nhóm 7

- **Trưởng nhóm:** [Tên trưởng nhóm]
- **Thành viên:** [Danh sách thành viên]
- **GVHD:** [Tên giảng viên hướng dẫn]

## 📞 Liên hệ

- **Email:** [email nhóm]
- **GitHub:** [link repository]
- **Trường:** Đại học Tài nguyên và Môi trường TP.HCM

---
**© 2024 Nhóm 7 - UTH - Môn Xây Dựng Hệ Thống Thông Tin**