# 🚀 HƯỚNG DẪN SỬ DỤNG TRANG WEB THỰC TẾ

## 📋 **THÔNG TIN ĐĂNG NHẬP**

### **👨‍💼 Admin Account**
- **Email:** `admin@gr7.com`
- **Mật khẩu:** `123456`
- **Quyền:** Tạo, sửa, xóa sản phẩm

### **👤 User Account**
- **Email:** `testuser12@example.com`
- **Mật khẩu:** `123456`
- **Quyền:** Xem sản phẩm, mua hàng

## 🛍️ **TÍNH NĂNG HOẠT ĐỘNG**

### **✅ Trang chủ**
- Hiển thị danh sách laptop từ Backend
- Hover để xem nút "Thêm vào giỏ hàng"
- Click để xem chi tiết sản phẩm

### **✅ Đăng ký/Đăng nhập**
- Tạo tài khoản mới
- Đăng nhập với email/password
- JWT token authentication

### **✅ Giỏ hàng**
- Thêm/xóa sản phẩm
- Cập nhật số lượng
- Tính tổng tiền

### **✅ Admin Panel**
- Truy cập: `http://localhost:5173/admin`
- Quản lý sản phẩm
- Xem thống kê

## 🗄️ **DỮ LIỆU THỰC TẾ**

### **Sản phẩm có sẵn:**
1. **Lenovo IdeaPad 5 Pro 14 GT** - 26,190,000đ
2. **Gigabyte Gaming A16** - 22,990,000đ
3. **Lenovo Legion R7000** - 22,990,000đ
4. **Acer Aspire A514** - 18,990,000đ
5. **Dell Inspiron 15** - 19,990,000đ

## 🔧 **CÁCH THÊM SẢN PHẨM MỚI**

### **Qua Admin Panel:**
1. Đăng nhập với `admin@gr7.com`
2. Truy cập `/admin`
3. Click "Thêm sản phẩm"
4. Điền thông tin sản phẩm

### **Qua API:**
```bash
# Đăng nhập admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gr7.com","password":"123456"}'

# Tạo sản phẩm mới
curl -X POST http://localhost:3000/api/product \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop mới","price":20000000,"description":"Mô tả","category":"Laptop","brand":"Brand","stock":10}'
```

## 🚀 **TRẠNG THÁI HOÀN THÀNH**

- ✅ Backend API hoạt động
- ✅ Database có dữ liệu thật
- ✅ Authentication system
- ✅ Frontend hiển thị dữ liệu thật
- ✅ Admin panel hoạt động
- ✅ Giỏ hàng và thanh toán
- ✅ Responsive design

## 📞 **LIÊN HỆ HỖ TRỢ**

**Nhóm 7 - UTH**
- **Môn:** Xây Dựng Hệ Thống Thông Tin
- **Đề tài:** Demo cửa hàng bán laptop

---
**© 2024 Nhóm 7 - UTH - Trang web hoạt động thực tế!** 🎉
