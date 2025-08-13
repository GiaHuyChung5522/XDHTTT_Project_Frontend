import React from "react";
import AuthForm from "../../components/AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Roles } from "../../constants/roles";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSuccess = () => {
    if (user?.role === Roles.ADMIN) navigate("/admin", { replace: true });
    else if (user?.role === Roles.STAFF) navigate("/staff", { replace: true });
    else navigate("/account", { replace: true });
  };

  return (
    <div className="container py-4">
      <h1 className="mb-3">Đăng nhập</h1>
      <AuthForm mode="login" onClose={() => navigate(-1)} onSuccess={onSuccess} />
    </div>
  );
}
