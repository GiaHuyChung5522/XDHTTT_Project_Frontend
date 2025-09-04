// Test data cho authentication system
export const testUsers = {
  admin: {
    email: 'admin@7nfashion.com',
    password: 'Admin123',
    name: 'Admin User',
    role: 'admin'
  },
  staff: {
    email: 'staff@7nfashion.com', 
    password: 'Staff123',
    name: 'Staff User',
    role: 'staff'
  },
  user: {
    email: 'user@test.com',
    password: 'User123',
    name: 'Test User',
    role: 'user'
  }
};

export const testCredentials = {
  valid: {
    email: 'user@test.com',
    password: 'User123'
  },
  invalid: {
    email: 'wrong@test.com',
    password: 'wrongpass'
  },
  weakPassword: {
    email: 'test@test.com',
    password: '123'
  },
  invalidEmail: {
    email: 'invalid-email',
    password: 'Password123'
  }
};

export const registerTestData = {
  valid: {
    name: 'New User',
    email: 'newuser@test.com',
    password: 'NewUser123',
    confirmPassword: 'NewUser123',
    firstName: 'New',
    lastName: 'User',
    gender: 'Nam',
    birth: '1990-01-01',
    address: '123 Test Street',
    telephone: '0123456789'
  },
  invalid: {
    name: '',
    email: 'invalid-email',
    password: '123',
    confirmPassword: '456'
  }
};

// Mock API responses
export const mockApiResponses = {
  loginSuccess: {
    accessToken: 'mock-jwt-token-12345',
    user: {
      id: 1,
      name: 'Test User',
      email: 'user@test.com',
      role: 'user',
      phone: '0123456789'
    }
  },
  registerSuccess: {
    accessToken: 'mock-jwt-token-67890',
    user: {
      id: 2,
      name: 'New User',
      email: 'newuser@test.com',
      role: 'user',
      phone: '0123456789'
    }
  },
  loginError: {
    message: 'Invalid credentials'
  },
  registerError: {
    message: 'Email already exists'
  }
};
