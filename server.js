const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();


// Thêm CORS middleware
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom authentication routes
server.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Tìm user trong db
  const user = router.db.get('users').find({ email }).value();

  console.log('Found user:', user);

  if (user) {
    console.log('User exists, checking password...');
    console.log('User password:', user.password);
    console.log('Input password:', password);

    // Kiểm tra password
    let isValidPassword = false;

    if (user.password && user.password.startsWith('$2a$')) {
      console.log('Bcrypt password detected');
      isValidPassword = false; // Tạm thời false
    } else if (user.password) {
      console.log('Plain text password comparison');
      isValidPassword = (user.password === password);
      console.log('Password match:', isValidPassword);
    } else {
      console.log('User has no password field');
      isValidPassword = false;
    }

    if (isValidPassword) {
      console.log('Password valid, generating token...');
      const token = `token_${user.id}_${Date.now()}`;
      res.json({
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        }
      });
    } else {
      console.log('Password invalid');
      res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }
  } else {
    console.log('User not found in database');
    res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
  }

  console.log('=== END LOGIN ===');
});

server.post('/register', (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  // Kiểm tra email đã tồn tại
  const existingUser = router.db.get('users').find({ email }).value();
  if (existingUser) {
    return res.status(400).json({ error: 'Email đã tồn tại' });
  }

  // Tạo user mới
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role
  };

  router.db.get('users').push(newUser).write();

  // Tạo token
  const token = `token_${newUser.id}_${Date.now()}`;

  res.json({
    accessToken: token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// Middleware kiểm tra quyền admin
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  // Tìm user từ token
  const userId = token.split('_')[1];
  const user = router.db.get('users').find({ id: parseInt(userId) }).value();

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.user = user;
  next();
}

// Middleware kiểm tra quyền staff
function requireStaff(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  const userId = token.split('_')[1];
  const user = router.db.get('users').find({ id: parseInt(userId) }).value();

  if (!user || !['admin', 'staff'].includes(user.role)) {
    return res.status(403).json({ error: 'Staff access required' });
  }

  req.user = user;
  next();
}

// Middleware kiểm tra quyền user (đã đăng nhập)
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  const userId = token.split('_')[1];
  const user = router.db.get('users').find({ id: parseInt(userId) }).value();

  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
}

// API endpoints với phân quyền

// Public endpoints (không cần đăng nhập)
server.get('/products', (req, res) => {
  const products = router.db.get('products').value();
  res.json(products);
});

server.get('/news', (req, res) => {
  const news = router.db.get('news').value();
  res.json(news);
});

// User endpoints (cần đăng nhập)
server.get('/profile', requireAuth, (req, res) => {
  res.json(req.user);
});

server.post('/cart/add', requireAuth, (req, res) => {
  // Logic thêm vào giỏ hàng
  res.json({ message: 'Added to cart' });
});

// Staff endpoints (cần quyền staff trở lên)
server.post('/products', requireStaff, (req, res) => {
  // Logic tạo sản phẩm mới
  res.json({ message: 'Product created' });
});

server.put('/products/:id', requireStaff, (req, res) => {
  // Logic cập nhật sản phẩm
  res.json({ message: 'Product updated' });
});

// Admin endpoints (chỉ admin)
server.delete('/products/:id', requireAdmin, (req, res) => {
  // Logic xóa sản phẩm
  res.json({ message: 'Product deleted' });
});

server.get('/admin/users', requireAdmin, (req, res) => {
  // Danh sách tất cả users (chỉ admin xem được)
  const users = router.db.get('users').value();
  res.json(users);
});


// Sử dụng router
server.use(router);

// Khởi động server
const port = process.env.PORT || 3002;
server.listen(port, () => {
  console.log(`JSON Server đang chạy tại http://localhost:${port}`);
  console.log('Endpoints có sẵn:');
  console.log('- POST /login - Đăng nhập');
  console.log('- POST /register - Đăng ký');
  console.log('- GET /users - Danh sách users');
  console.log('- GET /products - Danh sách sản phẩm');
  console.log('- GET /news - Danh sách tin tức');
});