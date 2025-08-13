import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleRoute({ roles = [], children }) {
  const { hasRole } = useAuth();
  if (!hasRole(roles)) return <Navigate to="/403" replace />;
  return children;
}
