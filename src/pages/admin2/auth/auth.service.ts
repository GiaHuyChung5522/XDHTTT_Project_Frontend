export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Mock admin credentials - trong thực tế sẽ call API
  private readonly mockAdmin = {
    email: 'admin',
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin',
      name: 'Admin ',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  };

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication
    if (credentials.email === this.mockAdmin.email && credentials.password === this.mockAdmin.password) {
      const token = 'mock_jwt_token_' + Date.now();
      const authResponse = {
        user: this.mockAdmin.user,
        token
      };

      // Store in localStorage
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(this.mockAdmin.user));

      return authResponse;
    } else {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export const authService = new AuthService();
