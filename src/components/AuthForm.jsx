import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode = "login", onClose, onSuccess }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        setMsg({ type: "success", text: "Đăng nhập thành công!" });
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
        setMsg({ type: "success", text: "Tạo tài khoản thành công!" });
      }
      setTimeout(() => onSuccess?.(), 500);
    } catch (err) {
      setMsg({ type: "danger", text: err?.message || "Thao tác thất bại. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const show = true;

  return (
    <>
      <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{isLogin ? "Đăng nhập" : "Tạo tài khoản"}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {msg.text ? <div className={`alert alert-${msg.type}`}>{msg.text}</div> : null}

              <form onSubmit={submit} noValidate>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="name">Họ tên</label>
                    <input id="name" name="name" className="form-control" value={form.name} onChange={onChange} required />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={onChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Mật khẩu</label>
                  <input id="password" name="password" type="password" className="form-control" value={form.password} onChange={onChange} required minLength={6} />
                  <div className="form-text">Tối thiểu 6 ký tự.</div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý…</>) : (isLogin ? "Đăng nhập" : "Đăng ký")}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Huỷ</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
