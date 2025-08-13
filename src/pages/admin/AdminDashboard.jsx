import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="container py-4">
      <h1>Admin Dashboard</h1>
      <p>Xin chào, {user?.name} ({user?.role})</p>
    </div>
  );
}
