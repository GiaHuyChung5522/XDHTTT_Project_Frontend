// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// pages hiện có
import Home from './pages/user/Home';
import ProductShowcase from './pages/user/ProductList';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';

// thêm import ApplePage
import ApplePage from './pages/user/Apple';

// đổi sang About
import About from './pages/user/About';
import KhuyenMai from './pages/user/Promotion';
import TinTuc from './pages/user/News';

// auth stuff - XÓA IMPORT TRÙNG LẶP
import ProtectedRoute from './components/router/ProtectedRoute';
import RoleRoute from './components/router/RoleRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Account from './pages/user/Account';

import Forbidden from './pages/Forbidden';
import { Roles } from './constants/roles';
import { AuthProvider } from './context/AuthContext'; // CHỈ GIỮ 1 IMPORT

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
              <Route path="khuyen-mai" element={<KhuyenMai />} />
              <Route path="tin-tuc" element={<TinTuc />} />
            </Route>

            {/* Auth routes với MainLayout */}
            <Route path="/auth" element={<MainLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Admin routes với AdminLayout */}
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

            {/* Staff routes với AdminLayout */}
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

            {/* User routes với MainLayout */}
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