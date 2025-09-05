import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authSvc from "../services/authService";
import { Roles } from "../constants/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Khởi tạo từ localStorage nếu có
        const tokenFromStorage = localStorage.getItem('token');
        if (tokenFromStorage) setToken(tokenFromStorage);

        const res = await authSvc.getProfile();
        if (mounted && res?.user) {
          const normalizedUser = { ...res.user, role: String(res.user.role || '').toLowerCase() };
          setUser(normalizedUser);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (form) => {
    const { user, token } = await authSvc.login(form);
    const normalizedUser = { ...user, role: String(user.role || '').toLowerCase() };
    setUser(normalizedUser); setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    return user;
  };

  const register = async (form) => {
    const result = await authSvc.register(form);
    const normalizedUser = { ...result.user, role: String(result.user.role || '').toLowerCase() };
    setUser(normalizedUser);
    
    // Nếu có token từ register, lưu vào state
    if (result.token) {
      setToken(result.token);
      localStorage.setItem('token', result.token);
    }
    
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    return result.user;
  };

  const refreshToken = async () => {
    try {
      const { user, token } = await authSvc.refreshToken();
      const normalizedUser = { ...user, role: String(user.role || '').toLowerCase() };
      setUser(normalizedUser);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return { user: normalizedUser, token };
    } catch (error) {
      console.error("Refresh token failed:", error);
      // Nếu refresh thất bại, logout user
      await logout();
      throw error;
    }
  };

  const logout = async () => {
    await authSvc.logout();
    setUser(null); setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user && !!token;
  const hasRole = (roles) => (isAuthenticated ? (!roles?.length || roles.includes(user.role)) : false);

  const value = useMemo(() => ({
    user, token, loading, isAuthenticated, hasRole,
    login, register, logout, refreshToken, Roles,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
