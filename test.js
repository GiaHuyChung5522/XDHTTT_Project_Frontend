const API = "http://localhost:3002";

async function test() {
  // Đăng ký
  let res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user3@gmail.com",
      password: "123456",
      name: "User Three",
      role: "user"
    })
  });
  let data = await res.json();
  console.log("Đăng ký:", data);

  // Đăng nhập
  res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user3@gmail.com",
      password: "123456"
    })
  });
  data = await res.json();
  console.log("Đăng nhập:", data);

  const token = data.accessToken;
  const userId = data.user.id; // ✅ lấy ID động từ user trả về

  // Test API có bảo vệ
  res = await fetch(`${API}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  data = await res.json();
  console.log("User info:", data);
}

test();
