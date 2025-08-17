// src/services/authService.js
import { api } from "./http";
import { setAuth, getAuth, clearAuth } from "../utils/storage";

export async function login({ email, password }) {
  console.log("Attempting login with", { email, password }); // Log để debug
  try {
    const { data } = await api.post("/login", { email, password }); // Gọi API login
    // data = { accessToken, user }
    if (data?.accessToken && data?.user) {
      setAuth({ token: data.accessToken, user: data.user });
      return { token: data.accessToken, user: data.user };
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Login failed:", error.response?.status, error.response?.data || error.message);
    throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.");
  }
}

export async function register({ name, email, password, role }) {
  console.log("Attempting register with", { name, email, password, role }); // Log để debug
  try {
    const payload = { name, email, password };
    if (role) payload.role = role; // DEV seeding
    const { data } = await api.post("/register", payload); // Gọi API register
    if (data?.accessToken && data?.user) {
      setAuth({ token: data.accessToken, user: data.user });
      return { token: data.accessToken, user: data.user };
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Register failed:", error.response?.status, error.response?.data || error.message);
    throw new Error("Đăng ký thất bại. Vui lòng kiểm tra thông tin.");
  }
}

export async function getProfile() {
  const auth = getAuth();
  if (!auth?.user?.id) return null;
  try {
    const { data } = await api.get(`/users/${auth.user.id}`); // Gọi API lấy thông tin người dùng
    return { token: auth.token, user: data };
  } catch (error) {
    console.error("Get profile failed:", error.response?.status, error.response?.data || error.message);
    return null; // Trả về null nếu không lấy được profile
  }
}

export async function logout() {
  try {
    clearAuth(); // Xóa thông tin xác thực
  } catch (error) {
    console.error("Logout failed:", error.message); // Log lỗi nếu có
  }
}