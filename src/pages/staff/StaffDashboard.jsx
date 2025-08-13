import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function StaffDashboard() {
  const { user } = useAuth();
  return (
    <div className="container py-4">
      <h1>Staff Dashboard</h1>
      <p>Xin chào, {user?.name} ({user?.role})</p>
    </div>
  );
}
