// Quick test for Orders API
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testOrdersAPI() {
  console.log('🔍 Testing Orders API...\n');
  
  try {
    // Login first
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data?.data?.accessToken;
    console.log('✅ Login successful');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test different order endpoints
    const endpoints = [
      '/order',
      '/order?page=1&limit=5',
      '/orders',
      '/orders?page=1&limit=5'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔄 Testing ${endpoint}...`);
        const response = await axios.get(`${API_BASE}${endpoint}`, { headers });
        console.log(`✅ ${endpoint}: ${response.status}`);
        console.log('   Data structure:', Object.keys(response.data));
        console.log('   Data length:', response.data?.data?.length || response.data?.orders?.length || response.data?.length || 0);
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOrdersAPI();
