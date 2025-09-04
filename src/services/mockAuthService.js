// Mock Auth Service for testing without real API
import { testUsers, mockApiResponses } from '../data/authTestData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  async login({ email, password }) {
    await delay(1000); // Simulate network delay
    
    console.log('Mock login attempt:', { email, password });
    
    // Find user in test data
    const user = Object.values(testUsers).find(u => u.email === email);
    
    if (!user || user.password !== password) {
      throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
    }
    
    // Return success response
    return {
      accessToken: `mock-token-${Date.now()}`,
      user: {
        id: user.email === 'admin@7nfashion.com' ? 1 : 
            user.email === 'staff@7nfashion.com' ? 2 : 3,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: '0123456789'
      }
    };
  },

  async register({ name, email, password, role = 'user' }) {
    await delay(1500); // Simulate network delay
    
    console.log('Mock register attempt:', { name, email, password, role });
    
    // Check if email already exists
    const existingUser = Object.values(testUsers).find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email đã được sử dụng. Vui lòng chọn email khác.');
    }
    
    // Validate password strength
    if (password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự.');
    }
    
    // Return success response
    return {
      accessToken: `mock-token-${Date.now()}`,
      user: {
        id: Date.now(),
        name,
        email,
        role,
        phone: '0123456789'
      }
    };
  },

  async getProfile() {
    await delay(500);
    
    // Get user from localStorage
    const auth = localStorage.getItem('auth');
    if (!auth) return null;
    
    try {
      const { user, token } = JSON.parse(auth);
      return { user, token };
    } catch {
      return null;
    }
  },

  async logout() {
    await delay(300);
    console.log('Mock logout');
    return true;
  }
};

// Switch between real and mock service
export const useMockAuth = process.env.NODE_ENV === 'development' && 
                          localStorage.getItem('useMockAuth') === 'true';

export const getAuthService = () => {
  return useMockAuth ? mockAuthService : require('./authService');
};
