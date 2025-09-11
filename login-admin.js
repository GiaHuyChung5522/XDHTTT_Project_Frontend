// Script để login admin và lưu token vào localStorage
const axios = require('axios');

async function loginAdmin() {
  try {
    console.log('🔐 Logging in as admin...');
    
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    if (loginResponse.data && loginResponse.data.data) {
      const token = loginResponse.data.data.accessToken;
      console.log('✅ Login successful!');
      console.log('Token:', token.substring(0, 50) + '...');
      
      // Tạo HTML để set localStorage
      const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Admin Login</title>
</head>
<body>
    <h1>Admin Login Successful!</h1>
    <p>Token saved to localStorage</p>
    <script>
        localStorage.setItem('adminToken', '${token}');
        localStorage.setItem('auth', JSON.stringify({
            token: '${token}',
            accessToken: '${token}',
            role: 'admin'
        }));
        console.log('✅ Token saved to localStorage');
        setTimeout(() => {
            window.location.href = 'http://localhost:5174/admin';
        }, 1000);
    </script>
</body>
</html>`;
      
      require('fs').writeFileSync('admin-login.html', html);
      console.log('📄 Created admin-login.html');
      console.log('🌐 Open: http://localhost:5174/admin-login.html');
      
    } else {
      console.log('❌ Login failed: Invalid response');
    }
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
  }
}

loginAdmin();
