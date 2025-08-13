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
        const res = await authSvc.getProfile();
        if (mounted && res) {
          setUser(res.user);
          setToken(res.token);
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
    setUser(user); setToken(token);
    return user;
  };

  const register = async (form) => {
    const { user, token } = await authSvc.register(form);
    setUser(user); setToken(token);
    return user;
  };

  const logout = async () => {
    await authSvc.logout();
    setUser(null); setToken(null);
  };

  const isAuthenticated = !!user && !!token;
  const hasRole = (roles) => (isAuthenticated ? (!roles?.length || roles.includes(user.role)) : false);

  const value = useMemo(() => ({
    user, token, loading, isAuthenticated, hasRole,
    login, register, logout, Roles,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
