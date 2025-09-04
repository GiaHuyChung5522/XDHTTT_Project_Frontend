// src/services/authService.js (chuẩn hoá dùng lib/api)
import { api } from "../lib/api";
import { setAuth, getAuth, clearAuth } from "../utils/storage";

export async function login({ email, password }) {
  console.log("Attempting login with", { email, password });
  
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log("Login response:", response);
    console.log("Response type:", typeof response);
    console.log("Response keys:", Object.keys(response || {}));
    
    // BE có thể trả format: { statusCode, message, data: { accessToken, refreshToken, role } }
    // hoặc format: { accessToken, refreshToken, role }
    let loginData = response;
    
    // Nếu response có cấu trúc { statusCode, message, data }
    if (response?.data && response?.statusCode) {
      loginData = response.data;
    }
    
    // Kiểm tra accessToken
    if (loginData?.accessToken) {
      // Tạo user object từ thông tin có sẵn
      const user = {
        id: loginData.userId || Date.now(),
        email: email,
        role: loginData.role || 'user',
        name: email.split('@')[0] // Tạm thời dùng email làm tên
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
    const data = await api.post("/auth/register", { 
      firstName, 
      lastName, 
      email, 
      password, 
      gender, 
      birth, 
      address, 
      telephone 
    });
    console.log("Register response:", data);
    
    // BE trả user data sau khi đăng ký
    if (data?.data) {
      const user = {
        id: data.data._id || Date.now(),
        email: data.data.email,
        role: data.data.role || 'user',
        name: `${data.data.firstName} ${data.data.lastName}`,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        gender: data.data.gender,
        birth: data.data.birth,
        address: data.data.address,
        telephone: data.data.telephone
      };
      
      return { user: user };
    }
    throw new Error("Invalid response from server");
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

export async function logout() {
  try {
    clearAuth();
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
}