import React, { useState } from "react";
import "./AuthForm.css";
import { useAuth } from "../context/AuthContext";

const AuthForm = ({ onClose, onSwitchMode, mode: initialMode = "login", onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // "login", "register", "forgot", "verify", "reset"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "Nam", // Sửa: dùng tiếng Việt như BE
    birth: "",
    address: "",
    telephone: "",
    code: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // For forgot password flow
  const [fieldErrors, setFieldErrors] = useState({}); // Thêm: lỗi cho từng field

  const handleInputChange = (e) => {
    let value = e.target.value;
    
    // Xử lý đặc biệt cho ngày sinh
    if (e.target.name === "birth" && value) {
      // Convert từ DD/MM/YYYY sang YYYY-MM-DD
      if (value.includes('/')) {
        const parts = value.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          value = `${year}-${month}-${day}`;
        }
      }
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError(""); // Xóa lỗi chung khi user gõ
    // Xóa lỗi của field này
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({
        ...prev,
        [e.target.name]: ""
      }));
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber,
      checks: { minLength, hasUpper, hasLower, hasNumber }
    };
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Email không hợp lệ";
      case "telephone":
        if (value && value.length < 12) {
          return "Số điện thoại phải có ít nhất 12 ký tự";
        }
        return "";
      case "birth":
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return "Ngày sinh không hợp lệ";
          }
        }
        return "";
      default:
        return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({}); // Reset field errors

    try {
      if (mode === "login") {
        // Đăng nhập qua context service
        await login({ email: formData.email, password: formData.password });
        setSuccess("Đăng nhập thành công!");
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose && onClose();
        }, 600);
      } else if (mode === "register") {
        // Validate từng field trước
        const newFieldErrors = {};
        let hasErrors = false;

        // Validate required fields
        if (!formData.firstName.trim()) {
          newFieldErrors.firstName = "Họ không được để trống";
          hasErrors = true;
        }
        if (!formData.lastName.trim()) {
          newFieldErrors.lastName = "Tên không được để trống";
          hasErrors = true;
        }
        if (!formData.email.trim()) {
          newFieldErrors.email = "Email không được để trống";
          hasErrors = true;
        }

        // Validate format fields
        const emailError = validateField("email", formData.email);
        if (emailError) {
          newFieldErrors.email = emailError;
          hasErrors = true;
        }

        if (formData.telephone) {
          const phoneError = validateField("telephone", formData.telephone);
          if (phoneError) {
            newFieldErrors.telephone = phoneError;
            hasErrors = true;
          }
        }

        if (formData.birth) {
          const birthError = validateField("birth", formData.birth);
          if (birthError) {
            newFieldErrors.birth = birthError;
            hasErrors = true;
          }
        }

        // Validate password
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
          newFieldErrors.password = "Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ hoa, 1 chữ thường, 1 số";
          hasErrors = true;
        }
        
        if (formData.password !== formData.confirmPassword) {
          newFieldErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
          hasErrors = true;
        }

        if (hasErrors) {
          setFieldErrors(newFieldErrors);
          setLoading(false);
          return;
        }

        // Đăng ký với authService
        try {
          // Đảm bảo birth đúng định dạng ISO 8601 (YYYY-MM-DD)
          let birthDate = formData.birth;
          if (birthDate) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
              if (birthDate.includes('/')) {
                const parts = birthDate.split('/');
                if (parts.length === 3) {
                  const day = parts[0].padStart(2, '0');
                  const month = parts[1].padStart(2, '0');
                  const year = parts[2];
                  birthDate = `${year}-${month}-${day}`;
                }
              }
            }
            
            const dateObj = new Date(birthDate + 'T00:00:00.000Z');
            if (!isNaN(dateObj.getTime())) {
              birthDate = dateObj.toISOString().split('T')[0];
            } else {
              birthDate = undefined;
            }
          }

          const registerData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword, // ✅ Thêm confirmPassword
            gender: formData.gender,
            birth: birthDate,
            address: formData.address || undefined,
            telephone: formData.telephone || undefined
          };

          console.log("🚀 Gửi request đăng ký:", registerData);

          const result = await register(registerData);
          console.log("✅ Đăng ký thành công:", result);
          
          setSuccess("Đăng ký thành công! Đang đăng nhập...");
          
          // Auto login sau khi đăng ký
          setTimeout(async () => {
            try {
              await login({ email: formData.email, password: formData.password });
              onSuccess && onSuccess();
              onClose && onClose();
            } catch (err) {
              console.error("Auto login failed:", err);
              setError("Đăng ký thành công nhưng đăng nhập thất bại. Vui lòng đăng nhập thủ công.");
            }
          }, 1000);
        } catch (error) {
          console.log("❌ Lỗi đăng ký:", error);
          
          // Xử lý lỗi validation từ BE
          if (error.message && typeof error.message === 'object') {
            setFieldErrors(error.message);
            setError("Vui lòng kiểm tra và sửa các lỗi bên dưới");
          } else {
            setError(error.message || "Đăng ký thất bại!");
          }
        }
      } else if (mode === "forgot") {
        // Gửi email quên mật khẩu
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email })
        });

        if (response.ok) {
          setSuccess("Đã gửi email khôi phục mật khẩu! Vui lòng kiểm tra hộp thư.");
          setMode("verify");
          setStep(2);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Email không tồn tại hoặc có lỗi xảy ra!");
        }
      } else if (mode === "verify") {
        // Xác thực code
        const response = await fetch("/api/auth/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: formData.email, 
            code: formData.code 
          })
        });

        if (response.ok) {
          setSuccess("Xác thực code thành công! Vui lòng đặt lại mật khẩu.");
          setMode("reset");
          setStep(3);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Code không đúng!");
        }
      } else if (mode === "reset") {
        // Đặt lại mật khẩu
        if (formData.newPassword !== formData.confirmNewPassword) {
          setError("Mật khẩu xác nhận không khớp!");
          return;
        }

        const passwordValidation = validatePassword(formData.newPassword);
        if (!passwordValidation.isValid) {
          setError("Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ hoa, 1 chữ thường, 1 số");
          return;
        }

        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            code: formData.code,
            newPassword: formData.newPassword
          })
        });

        if (response.ok) {
          setSuccess("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
          setTimeout(() => setMode("login"), 2000);
          setStep(1);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Đặt lại mật khẩu thất bại!");
        }
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep(1);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      gender: "Nam", // Sửa: reset về tiếng Việt
      birth: "",
      address: "",
      telephone: "",
      code: "",
      newPassword: "",
      confirmNewPassword: ""
    });
    setError("");
    setSuccess("");
    setFieldErrors({}); // Reset field errors
    onSwitchMode && onSwitchMode(newMode);
  };

  const renderPasswordStrength = (password) => {
    if (!password) return null;
    
    const validation = validatePassword(password);
    const strength = Object.values(validation.checks).filter(Boolean).length;

  return (
      <div className="password-strength">
        <div className="strength-bar">
          <div 
            className={`strength-fill strength-${strength}`} 
            style={{ width: `${(strength / 4) * 100}%` }}
          ></div>
        </div>
        <div className="strength-text">
          {strength === 0 && "Rất yếu"}
          {strength === 1 && "Yếu"}
          {strength === 2 && "Trung bình"}
          {strength === 3 && "Mạnh"}
          {strength === 4 && "Rất mạnh"}
        </div>
        <div className="strength-checks">
          <span className={validation.checks.minLength ? "valid" : "invalid"}>
            ✓ Ít nhất 6 ký tự
          </span>
          <span className={validation.checks.hasUpper ? "valid" : "invalid"}>
            ✓ 1 chữ hoa
          </span>
          <span className={validation.checks.hasLower ? "valid" : "invalid"}>
            ✓ 1 chữ thường
          </span>
          <span className={validation.checks.hasNumber ? "valid" : "invalid"}>
            ✓ 1 số
          </span>
        </div>
        </div>
    );
  };

  const renderFieldError = (fieldName) => {
    if (!fieldErrors[fieldName]) return null;
    
    return (
      <div className="field-error">
              <span className="error-icon">⚠</span>
        {fieldErrors[fieldName]}
            </div>
    );
  };

  const renderForm = () => {
    switch (mode) {
      case "login":
        return (
          <>
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
                className={fieldErrors.email ? "error" : ""}
            />
              {renderFieldError("email")}
          </div>
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
                className={fieldErrors.password ? "error" : ""}
              />
              {renderFieldError("password")}
            </div>
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
            </div>
          </>
        );

      case "register":
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Họ *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ"
                  required
                  className={fieldErrors.firstName ? "error" : ""}
                />
                {renderFieldError("firstName")}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Tên *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên"
                  required
                  className={fieldErrors.lastName ? "error" : ""}
                />
                {renderFieldError("lastName")}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email của bạn"
                required
                className={fieldErrors.email ? "error" : ""}
              />
              {renderFieldError("email")}
            </div>
            <div className="form-group">
              <label htmlFor="gender">Giới tính *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className={fieldErrors.gender ? "error" : ""}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              {renderFieldError("gender")}
            </div>
            <div className="form-group">
              <label htmlFor="birth">Ngày sinh</label>
              <input
                type="date"
                id="birth"
                name="birth"
                value={formData.birth}
                onChange={handleInputChange}
                className={fieldErrors.birth ? "error" : ""}
              />
              {renderFieldError("birth")}
            </div>
            <div className="form-group">
              <label htmlFor="telephone">Số điện thoại (tối thiểu 12 số)</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại (VD: 012345678901)"
                className={fieldErrors.telephone ? "error" : ""}
              />
              {renderFieldError("telephone")}
            </div>
            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
                className={fieldErrors.address ? "error" : ""}
              />
              {renderFieldError("address")}
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                required
                className={fieldErrors.password ? "error" : ""}
              />
              {renderFieldError("password")}
              {renderPasswordStrength(formData.password)}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
                required
                className={fieldErrors.confirmPassword ? "error" : ""}
              />
              {renderFieldError("confirmPassword")}
            </div>
          </>
        );

      case "forgot":
        return (
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
              className={fieldErrors.email ? "error" : ""}
            />
            {renderFieldError("email")}
          </div>
        );

      case "verify":
        return (
          <>
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
                disabled
                className={fieldErrors.email ? "error" : ""}
              />
              {renderFieldError("email")}
            </div>
            <div className="form-group">
              <label htmlFor="code">Mã xác thực</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Nhập mã từ email"
                required
                className={fieldErrors.code ? "error" : ""}
              />
              {renderFieldError("code")}
            </div>
          </>
        );

      case "reset":
        return (
          <>
            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu mới"
                required
                className={fieldErrors.newPassword ? "error" : ""}
              />
              {renderFieldError("newPassword")}
              {renderPasswordStrength(formData.newPassword)}
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu mới"
                required
                className={fieldErrors.confirmNewPassword ? "error" : ""}
              />
              {renderFieldError("confirmNewPassword")}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getSubmitButtonText = () => {
    if (loading) return <span className="loading-spinner"></span>;
    
    switch (mode) {
      case "login": return "Đăng Nhập";
      case "register": return "Đăng Ký";
      case "forgot": return "Gửi Email";
      case "verify": return "Xác Thực";
      case "reset": return "Đặt Lại Mật Khẩu";
      default: return "Xác Nhận";
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return "Đăng Nhập";
      case "register": return "Đăng Ký";
      case "forgot": return "Quên Mật Khẩu";
      case "verify": return "Xác Thực Mã";
      case "reset": return "Đặt Lại Mật Khẩu";
      default: return "Xác Thực";
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        {/* Header */}
        <div className="auth-header">
          <h2 className="auth-title">{getTitle()}</h2>
          <button className="auth-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Progress Steps for Forgot Password */}
        {mode === "forgot" || mode === "verify" || mode === "reset" ? (
          <div className="auth-progress">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Gửi Email</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Xác Thực</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Đặt Lại</div>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Thông báo thành công */}
          {success && (
            <div className="auth-success">
              <span className="success-icon">✓</span>
              {success}
            </div>
          )}

          {/* Thông báo lỗi chung */}
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Form fields */}
          {renderForm()}

          {/* Submit button */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {getSubmitButtonText()}
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

          {(mode === "forgot" || mode === "verify" || mode === "reset") && (
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
        {mode === "login" && (
        <div className="auth-social">
          <p className="social-divider">Hoặc</p>
          <div className="social-buttons">
              <button type="button" className="social-btn social-google">
              <span className="social-icon">🔍</span>
              Google
            </button>
              <button type="button" className="social-btn social-facebook">
              <span className="social-icon">📘</span>
              Facebook
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;