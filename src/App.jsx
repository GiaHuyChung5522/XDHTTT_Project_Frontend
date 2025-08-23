// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// pages user
import Home from './pages/user/Home';
import ProductShowcase from './pages/user/ProductList';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import ApplePage from './pages/user/Apple';
import About from './pages/user/About';
import KhuyenMai from './pages/user/Promotion';
import PromotionDetail from './pages/user/PromotionDetail'; // NEW
import TinTuc from './pages/user/News';
import NewsDetail from './pages/user/NewsDetail'; 

import NotFound from './pages/NotFound';

// pages admin & staff
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';

// auth
import ProtectedRoute from './components/router/ProtectedRoute';
import RoleRoute from './components/router/RoleRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Account from './pages/user/Account';

import Forbidden from './pages/Forbidden';
import { Roles } from './constants/roles';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Public routes với MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<ProductShowcase />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="apple" element={<ApplePage />} />
              <Route path="about" element={<About />} />

              {/* Khuyến mãi */}
              <Route path="khuyen-mai" element={<KhuyenMai />} />
              <Route path="khuyen-mai/:id" element={<PromotionDetail />} /> {/* NEW */}

              {/* Tin tức */}
              <Route path="tin-tuc" element={<TinTuc />} />
              <Route path="tin-tuc/:id" element={<NewsDetail />} />
            </Route>

            {/* Auth routes */}
            <Route path="/auth" element={<MainLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={[Roles.ADMIN]}>
                    <AdminLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminDashboard />} />
              <Route path="products" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminDashboard />} />
            </Route>

            {/* Staff routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={[Roles.STAFF]}>
                    <AdminLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route path="products" element={<StaffDashboard />} />
              <Route path="orders" element={<StaffDashboard />} />
            </Route>

            {/* User routes */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Account />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
