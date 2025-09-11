// Test authentication flow
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...\n');

  try {
    // Step 1: Try to login as admin
    console.log('1️⃣ Testing admin login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful:', {
      status: loginResponse.status,
      fullResponse: loginResponse.data,
      token: loginResponse.data?.token ? 'Present' : 'Missing',
      user: loginResponse.data?.user?.email || 'Unknown'
    });
    
    const token = loginResponse.data?.data?.accessToken || loginResponse.data?.token || loginResponse.data?.accessToken;
    
    if (token) {
      // Step 2: Test authenticated API call
      console.log('\n2️⃣ Testing authenticated API call...');
      const productsResponse = await axios.get(`${API_BASE}/product/filter?page=1&limit=2`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Authenticated API call successful:', {
        status: productsResponse.status,
        dataLength: productsResponse.data?.data?.length || productsResponse.data?.length || 0
      });
    }

  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n💡 Suggestion: Try different admin credentials or check if admin user exists');
      }
    }
  }
}

// Run auth test
testAuthFlow();
