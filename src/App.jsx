// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// pages hiện có
import Home from './pages/user/Home';
import ProductShowcase from './pages/user/ProductList';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import NotFound from './pages/NotFound';

// thêm import ApplePage
import ApplePage from './pages/user/Apple';

// đổi sang About
import About from './pages/user/About';
import KhuyenMai from './pages/user/Promotion';
import TinTuc from './pages/user/News';

// auth stuff
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/router/ProtectedRoute';
import RoleRoute from './components/router/RoleRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Account from './pages/user/Account';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import Forbidden from './pages/Forbidden';
import { Roles } from './constants/roles';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/products" element={<MainLayout><ProductShowcase /></MainLayout>} />
          <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
          <Route path="/apple" element={<MainLayout><ApplePage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/khuyen-mai" element={<MainLayout><KhuyenMai /></MainLayout>} />
          <Route path="/tin-tuc" element={<MainLayout><TinTuc /></MainLayout>} />
          <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />

          {/* Auth */}
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/403" element={<MainLayout><Forbidden /></MainLayout>} />

          {/* Account (đăng nhập mới vào được) */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MainLayout><Account /></MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin-only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute roles={[Roles.ADMIN]}>
                  <MainLayout><AdminDashboard /></MainLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Staff-only */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <RoleRoute roles={[Roles.STAFF]}>
                  <MainLayout><StaffDashboard /></MainLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
