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
  private readonly TOKEN_KEY = 'adminToken';
  private readonly USER_KEY = 'adminUser';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Admin login attempt:', credentials.email);
      
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('🔐 Admin login response:', data);

      if (response.ok && data.statusCode === 200) {
        // Kiểm tra role admin
        if (data.data.role !== 'admin') {
          throw new Error('Tài khoản này không có quyền admin');
        }

        const user: User = {
          id: data.data.sub || Date.now().toString(),
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        };

        const authResponse: AuthResponse = {
          user,
          token: data.data.accessToken
        };

        // Store in localStorage
        localStorage.setItem(this.TOKEN_KEY, data.data.accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        console.log('✅ Admin login successful');
        return authResponse;
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
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