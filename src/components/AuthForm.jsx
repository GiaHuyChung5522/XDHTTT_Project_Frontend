import React, { useState } from "react";
import "./AuthForm.css";

const AuthForm = ({ onClose, onSwitchMode }) => {
  const [mode, setMode] = useState("login"); // "login", "register", "forgot"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Xóa lỗi khi user gõ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "login") {
        // Logic đăng nhập
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.accessToken);
          setSuccess("Đăng nhập thành công!");
          setTimeout(() => onClose(), 1500);
        } else {
          setError("Email hoặc mật khẩu không đúng!");
        }
      } else if (mode === "register") {
        // Logic đăng ký
        if (formData.password !== formData.confirmPassword) {
          setError("Mật khẩu xác nhận không khớp!");
          return;
        }

        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
          })
        });

        if (response.ok) {
          setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
          setTimeout(() => setMode("login"), 1500);
        } else {
          setError("Email đã tồn tại hoặc có lỗi xảy ra!");
        }
      } else if (mode === "forgot") {
        // Logic quên mật khẩu
        const response = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email })
        });

        if (response.ok) {
          setSuccess("Đã gửi email khôi phục mật khẩu!");
          setTimeout(() => setMode("login"), 2000);
        } else {
          setError("Email không tồn tại hoặc có lỗi xảy ra!");
        }
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: ""
    });
    setError("");
    setSuccess("");
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        {/* Header */}
        <div className="auth-header">
          <h2 className="auth-title">
            {mode === "login" && "Đăng Nhập"}
            {mode === "register" && "Đăng Ký"}
            {mode === "forgot" && "Quên Mật Khẩu"}
          </h2>
          <button className="auth-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Thông báo thành công */}
          {success && (
            <div className="auth-success">
              <span className="success-icon">✓</span>
              {success}
            </div>
          )}

          {/* Thông báo lỗi */}
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Tên (chỉ hiển thị khi đăng ký) */}
          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          {/* Mật khẩu (không hiển thị khi quên mật khẩu) */}
          {mode !== "forgot" && (
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          )}

          {/* Xác nhận mật khẩu (chỉ hiển thị khi đăng ký) */}
          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
          )}

          {/* Số điện thoại (chỉ hiển thị khi đăng ký) */}
          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          )}

          {/* Nút submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                {mode === "login" && "Đăng Nhập"}
                {mode === "register" && "Đăng Ký"}
                {mode === "forgot" && "Gửi Email"}
              </>
            )}
          </button>
        </form>

        {/* Footer với các link chuyển đổi */}
        <div className="auth-footer">
          {mode === "login" && (
            <>
              <p className="auth-switch">
                Chưa có tài khoản?{" "}
                <button
                  className="auth-link"
                  onClick={() => switchMode("register")}
                >
                  Đăng ký ngay
                </button>
              </p>
              <button
                className="auth-link forgot-link"
                onClick={() => switchMode("forgot")}
              >
                Quên mật khẩu?
              </button>
            </>
          )}

          {mode === "register" && (
            <p className="auth-switch">
              Đã có tài khoản?{" "}
              <button
                className="auth-link"
                onClick={() => switchMode("login")}
              >
                Đăng nhập
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <p className="auth-switch">
              Nhớ mật khẩu rồi?{" "}
              <button
                className="auth-link"
                onClick={() => switchMode("login")}
              >
                Đăng nhập
              </button>
            </p>
          )}
        </div>

        {/* Social login */}
        <div className="auth-social">
          <p className="social-divider">Hoặc</p>
          <div className="social-buttons">
            <button className="social-btn social-google">
              <span className="social-icon">🔍</span>
              Google
            </button>
            <button className="social-btn social-facebook">
              <span className="social-icon">📘</span>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;