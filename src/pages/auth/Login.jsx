import React from "react";
import AuthForm from "../../components/AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Roles } from "../../constants/roles";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSuccess = () => {
    if (user?.role === Roles.ADMIN) navigate("/admin2", { replace: true });
    else if (user?.role === Roles.STAFF) navigate("/staff", { replace: true });
    else navigate("/account", { replace: true });
  };

  return (
    <div className="container py-4">
      <h1 className="mb-3">Đăng nhập</h1>
      <AuthForm mode="login" onClose={() => navigate(-1)} onSuccess={onSuccess} />
      <div className="mt-3 d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => navigate('/auth/register')}
        >
          Đăng ký
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin2/login')} 
        >
        </button>
      </div>
    </div>
  );
}
