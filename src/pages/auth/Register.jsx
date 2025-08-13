import React from "react";
import AuthForm from "../../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  return (
    <div className="container py-4">
      <h1 className="mb-3">Tạo tài khoản</h1>
      <AuthForm mode="register" onClose={() => navigate(-1)} onSuccess={() => navigate("/account", { replace: true })} />
    </div>
  );
}
