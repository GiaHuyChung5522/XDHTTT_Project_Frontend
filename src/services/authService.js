// src/services/authService.js (chuẩn hoá dùng lib/api)
import { api } from "../lib/api";
import { setAuth, getAuth, clearAuth } from "../utils/storage";

export async function login({ email, password }) {
  console.log("Attempting login with", { email, password });
  
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log("Login response:", response);
    
    // API chỉ trả về: { accessToken, refreshToken, role }
    // hoặc format: { statusCode, message, data: { accessToken, refreshToken, role } }
    let loginData = response;
    
    // Nếu response có cấu trúc { statusCode, message, data }
    if (response?.data && response?.statusCode) {
      loginData = response.data;
    }
    
    // Kiểm tra accessToken
    if (loginData?.accessToken) {
      // Tạo user object từ thông tin có sẵn
      const user = {
        id: Date.now(), // Tạm thời dùng timestamp
        email: email,
        role: loginData.role || 'user',
        name: email.split('@')[0], // Tạm thời dùng email làm tên
        refreshToken: loginData.refreshToken // Lưu refreshToken
      };
      
      setAuth({ token: loginData.accessToken, user: user });
      return { token: loginData.accessToken, user: user };
    }
    
    console.error("No accessToken in response:", response);
    throw new Error("Invalid response from server");
  } catch (error) {
    console.error("Login API failed:", error);
    throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.");
  }
}

export async function register({ firstName, lastName, email, password, gender, birth, address, telephone }) {
  console.log("Attempting register with", { firstName, lastName, email, password, gender, birth, address, telephone });
  
  try {
    const response = await api.post("/auth/register", { 
      firstName, 
      lastName, 
      email, 
      password, 
      gender, 
      birth, 
      address, 
      telephone 
    });
    console.log("Register response:", response);
    
    // API có thể trả về: { accessToken, refreshToken, role } hoặc { statusCode, message, data }
    let registerData = response;
    
    if (response?.data && response?.statusCode) {
      registerData = response.data;
    }
    
    // Nếu có accessToken, tạo user object
    if (registerData?.accessToken) {
      const user = {
        id: Date.now(),
        email: email,
        role: registerData.role || 'user',
        name: `${firstName} ${lastName}`,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        birth: birth,
        address: address,
        telephone: telephone,
        refreshToken: registerData.refreshToken
      };
      
      setAuth({ token: registerData.accessToken, user: user });
      return { token: registerData.accessToken, user: user };
    }
    
    // Nếu không có accessToken, chỉ trả về user info
    const user = {
      id: Date.now(),
      email: email,
      role: 'user',
      name: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      birth: birth,
      address: address,
      telephone: telephone
    };
    
    return { user: user };
  } catch (error) {
    console.error("Register API failed:", error.message);
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

export async function refreshToken() {
  try {
    const auth = getAuth();
    if (!auth?.user?.refreshToken) {
      throw new Error("No refresh token available");
    }
    
    const response = await api.post("/auth/refresh", { 
      refreshToken: auth.user.refreshToken 
    });
    
    let refreshData = response;
    if (response?.data && response?.statusCode) {
      refreshData = response.data;
    }
    
    if (refreshData?.accessToken) {
      const updatedUser = { ...auth.user, refreshToken: refreshData.refreshToken };
      setAuth({ token: refreshData.accessToken, user: updatedUser });
      return { token: refreshData.accessToken, user: updatedUser };
    }
    
    throw new Error("Invalid refresh response");
  } catch (error) {
    console.error("Refresh token failed:", error.message);
    clearAuth();
    throw error;
  }
}

export async function logout() {
  try {
    clearAuth();
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
}