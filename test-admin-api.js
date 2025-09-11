// Test script for Admin API calls
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAdminAPIs() {
  console.log('🚀 Testing Admin APIs...\n');

  try {
    // Test 1: Get Users
    console.log('1️⃣ Testing GET /user...');
    const usersResponse = await axios.get(`${API_BASE}/user?page=1&limit=5`);
    console.log('✅ Users API:', {
      status: usersResponse.status,
      dataLength: usersResponse.data?.data?.length || usersResponse.data?.length || 0,
      structure: Object.keys(usersResponse.data)
    });
    console.log('');

    // Test 2: Get Products
    console.log('2️⃣ Testing GET /product/filter...');
    const productsResponse = await axios.get(`${API_BASE}/product/filter?page=1&limit=5`);
    console.log('✅ Products API:', {
      status: productsResponse.status,
      dataLength: productsResponse.data?.data?.length || productsResponse.data?.length || 0,
      structure: Object.keys(productsResponse.data)
    });
    console.log('');

    // Test 3: Get Orders
    console.log('3️⃣ Testing GET /order...');
    const ordersResponse = await axios.get(`${API_BASE}/order?page=1&limit=5`);
    console.log('✅ Orders API:', {
      status: ordersResponse.status,
      dataLength: ordersResponse.data?.data?.length || ordersResponse.data?.length || 0,
      structure: Object.keys(ordersResponse.data)
    });
    console.log('');

    // Test 4: Dashboard Stats
    console.log('4️⃣ Testing GET /dashboard/stats...');
    try {
      const dashboardResponse = await axios.get(`${API_BASE}/dashboard/stats`);
      console.log('✅ Dashboard API:', {
        status: dashboardResponse.status,
        data: dashboardResponse.data
      });
    } catch (error) {
      console.log('❌ Dashboard API Error:', error.response?.status, error.message);
    }
    console.log('');

    console.log('🎉 All API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testAdminAPIs();
