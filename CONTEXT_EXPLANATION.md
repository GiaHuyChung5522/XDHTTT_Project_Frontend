# 📚 Giải Thích Context System cho Backend



### **Ví dụ đơn giản:**
```javascript
// Thay vì truyền props qua nhiều cấp:
<App>
  <Header user={user} />
  <Main>
    <Sidebar user={user} />
    <Content>
      <ProductList user={user} />
    </Content>
  </Main>
</App>

// Context cho phép:
<AuthProvider>  {/* Cung cấp dữ liệu */}
  <App>
    <Header />     {/* Sử dụng dữ liệu trực tiếp */}
    <Main>
      <Sidebar />
      <Content>
        <ProductList />
      </Content>
    </Main>
  </App>
</AuthProvider>
```

## 🔐 **AuthContext - Quản Lý Đăng Nhập**

### **Tại sao cần AuthContext?**
- User đăng nhập một lần, toàn bộ app biết
- Không cần truyền user info qua từng component
- Tự động kiểm tra quyền truy cập
- Quản lý token và refresh token

### **Cấu trúc AuthContext:**

```javascript
// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Provider Component - Cung cấp dữ liệu
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // Thông tin user
  const [token, setToken] = useState(null);      // Access token
  const [loading, setLoading] = useState(true);  // Trạng thái loading

  // Functions
  const login = async (form) => { /* ... */ };
  const register = async (form) => { /* ... */ };
  const logout = async () => { /* ... */ };
  const refreshToken = async () => { /* ... */ };

  // Cung cấp cho toàn bộ app
  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout, refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook để sử dụng
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

### **Cách sử dụng trong component:**

```javascript
// Trong bất kỳ component nào
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, login, logout } = useAuth();
  
  if (user) {
    return <div>Xin chào {user.name}!</div>;
  } else {
    return <button onClick={() => login({...})}>Đăng nhập</button>;
  }
}
```

## 🛒 **CartContext - Quản Lý Giỏ Hàng**

### **Tại sao cần CartContext?**
- Giỏ hàng cần được chia sẻ giữa nhiều trang
- Header hiển thị số lượng sản phẩm
- Trang sản phẩm có thể thêm vào giỏ
- Trang giỏ hàng hiển thị danh sách

### **Cấu trúc CartContext:**

```javascript
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Functions
  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, wishlistItems,
      addToCart, removeFromCart, getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}
```

## 🔄 **Flow Hoạt Động Chi Tiết**

### **1. Khi app khởi động:**

```javascript
// App.tsx
function App() {
  return (
    <AuthProvider>      {/* Cung cấp auth context */}
      <CartProvider>    {/* Cung cấp cart context */}
        <RouterProvider />  {/* App chính */}
      </CartProvider>
    </AuthProvider>
  );
}
```

### **2. Khi user đăng nhập:**

```javascript
// User nhập email/password và click "Đăng nhập"
const handleLogin = async (formData) => {
  try {
    // 1. Gọi AuthContext.login()
    await login(formData);
    
    // 2. AuthContext sẽ:
    //    - Gọi API POST /api/auth/login
    //    - Nhận response: { accessToken, refreshToken, role }
    //    - Tạo user object
    //    - Lưu vào state và localStorage
    //    - Cập nhật toàn bộ app
    
    // 3. App tự động redirect hoặc cập nhật UI
  } catch (error) {
    // Hiển thị lỗi
  }
};
```

### **3. Khi component cần thông tin user:**

```javascript
function ProductCard({ product }) {
  const { user, addToCart } = useAuth(); // Lấy từ context
  
  const handleAddToCart = () => {
    if (user) {
      addToCart(product); // Thêm vào giỏ hàng
    } else {
      // Redirect to login
    }
  };
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
```

## 🗄️ **Storage Management**

### **localStorage Structure:**

```javascript
// localStorage.auth
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1234567890,
    "email": "user@example.com",
    "role": "user",
    "name": "user",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// localStorage.cart
[
  {
    "id": 1,
    "name": "Laptop Dell",
    "price": 15000000,
    "quantity": 1
  }
]
```

### **Tại sao dùng localStorage?**
- Dữ liệu không mất khi refresh trang
- User không cần đăng nhập lại
- Giỏ hàng được lưu trữ

## 🔧 **API Integration**

### **authService.js - Layer giao tiếp với API:**

```javascript
// src/services/authService.js
export async function login({ email, password }) {
  try {
    // GỌI API BACKEND
    const response = await api.post("/auth/login", { email, password });
    
    // XỬ LÝ RESPONSE TỪ BE
    let loginData = response;
    if (response?.data && response?.statusCode) {
      loginData = response.data; // Lấy data từ wrapper
    }
    
    // TẠO USER OBJECT TỪ THÔNG TIN BE TRẢ VỀ
    if (loginData?.accessToken) {
      const user = {
        id: Date.now(), // Tạm thời
        email: email,
        role: loginData.role || 'user',
        name: email.split('@')[0], // Tạm thời
        refreshToken: loginData.refreshToken
      };
      
      // LƯU VÀO STORAGE
      setAuth({ token: loginData.accessToken, user: user });
      return { token: loginData.accessToken, user: user };
    }
  } catch (error) {
    throw new Error("Đăng nhập thất bại");
  }
}
```

## 🎯 **Tóm Tắt cho Backend**

### **BE cần làm:**
1. ✅ Tạo API endpoints: `/auth/login`, `/auth/register`, `/auth/refresh`
2. ✅ Trả về format: `{ accessToken, refreshToken, role }`
3. ✅ Xử lý validation và error responses

### **Frontend sẽ tự động:**
1. ✅ Gọi API khi cần
2. ✅ Xử lý response và tạo user object
3. ✅ Lưu vào context và storage
4. ✅ Cập nhật toàn bộ app
5. ✅ Quản lý refresh token
6. ✅ Handle errors và redirects

### **Context giúp:**
- ✅ Chia sẻ dữ liệu giữa các component
- ✅ Không cần truyền props qua nhiều cấp
- ✅ Quản lý state tập trung
- ✅ Tự động cập nhật UI khi có thay đổi

**Kết luận:** BE chỉ cần tạo API đúng format, Frontend sẽ tự động xử lý tất cả logic còn lại thông qua Context system!
