// src/services/authService.js (chuẩn hoá dùng lib/api)
import { api } from "../lib/api";
import { setAuth, getAuth, clearAuth } from "../utils/storage";

export async function login({ email, password }) {
  console.log("Attempting login with", { email, password });
  try {
    const data = await api.post("/auth/login", { email, password });
    if (data?.accessToken && data?.user) {
      setAuth({ token: data.accessToken, user: data.user });
      return { token: data.accessToken, user: data.user };
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Login failed:", error.message);
    throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.");
  }
}

export async function register({ name, email, password, role }) {
  console.log("Attempting register with", { name, email, password, role });
  try {
    const payload = { name, email, password };
    if (role) payload.role = role;
    const data = await api.post("/auth/register", payload);
    if (data?.accessToken && data?.user) {
      setAuth({ token: data.accessToken, user: data.user });
      return { token: data.accessToken, user: data.user };
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Register failed:", error.message);
    throw new Error("Đăng ký thất bại. Vui lòng kiểm tra thông tin.");
  }
}

export async function getProfile() {
  const auth = getAuth();
  if (!auth?.user) return null;
  try {
    return { token: auth.token, user: auth.user };
  } catch (error) {
    console.error("Get profile failed:", error.message);
    return null;
  }
}

export async function logout() {
  try {
    clearAuth();
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
}