import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

<<<<<<< HEAD
// Import pages
=======
// pages user
>>>>>>> eebdd9b11460000b483e54b3d9e5b6a239a259b1
import Home from './pages/user/Home';
import About from './pages/user/About';
import Products from './pages/user/ProductList';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
<<<<<<< HEAD
import Checkout from './pages/user/Checkout';
import OrderSuccess from './pages/user/OrderSuccess';
=======
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
>>>>>>> eebdd9b11460000b483e54b3d9e5b6a239a259b1
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Account from './pages/user/Account';
import Wishlist from './pages/user/Wishlist';
import News from './pages/user/News';
import Promotion from './pages/user/Promotion';
import Apple from './pages/user/Apple';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
<<<<<<< HEAD

// Import admin pages
import AdminLogin from './pages/admin2/pages/Login';
import {
  Dashboard as AdminDashboard,
  Analytics as AdminAnalytics,
  Categories as AdminCategories,
  Brands as AdminBrands,
  Products as AdminProducts,
  Orders as AdminOrders,
  Customers as AdminCustomers,
  Posts as AdminPosts,
  Topics as AdminTopics,
  Messages as AdminMessages,
  Notifications as AdminNotifications,
  Profile as AdminProfile,
  Settings as AdminSettings,
} from './pages/admin2/pages';
import { LanguageProvider } from './pages/admin2/contexts/LanguageContext';
import { ThemeProvider } from './pages/admin2/contexts/ThemeContext';

// Import contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Import components
import ProtectedRoute from './components/router/ProtectedRoute';
import RoleRoute from './components/router/RoleRoute';
import AdminProtectedRoute from './components/router/AdminProtectedRoute';
=======
import { Roles } from './constants/roles';
import { AuthProvider } from './context/AuthContext';
>>>>>>> eebdd9b11460000b483e54b3d9e5b6a239a259b1

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
<<<<<<< HEAD
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="news" element={<News />} />
              <Route path="promotion" element={<Promotion />} />
              <Route path="apple" element={<Apple />} />
=======

              {/* Khuyến mãi */}
              <Route path="khuyen-mai" element={<KhuyenMai />} />
              <Route path="khuyen-mai/:id" element={<PromotionDetail />} /> {/* NEW */}

              {/* Tin tức */}
              <Route path="tin-tuc" element={<TinTuc />} />
              <Route path="tin-tuc/:id" element={<NewsDetail />} />
>>>>>>> eebdd9b11460000b483e54b3d9e5b6a239a259b1
            </Route>

            {/* Auth routes */}
            <Route path="/auth" element={<MainLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

<<<<<<< HEAD
            {/* Protected user routes */}
            <Route path="/user" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="account" element={<Account />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="wishlist" element={<Wishlist />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin2" element={<ThemeProvider><LanguageProvider><AdminLayout /></LanguageProvider></ThemeProvider>}>
              <Route index element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
              <Route path="categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
              <Route path="brands" element={<AdminProtectedRoute><AdminBrands /></AdminProtectedRoute>} />
              <Route path="products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
              <Route path="orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
              <Route path="customers" element={<AdminProtectedRoute><AdminCustomers /></AdminProtectedRoute>} />
              <Route path="posts" element={<AdminProtectedRoute><AdminPosts /></AdminProtectedRoute>} />
              <Route path="topics" element={<AdminProtectedRoute><AdminTopics /></AdminProtectedRoute>} />
              <Route path="messages" element={<AdminProtectedRoute><AdminMessages /></AdminProtectedRoute>} />
              <Route path="notifications" element={<AdminProtectedRoute><AdminNotifications /></AdminProtectedRoute>} />
              <Route path="profile" element={<AdminProtectedRoute><AdminProfile /></AdminProtectedRoute>} />
              <Route path="settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
            </Route>

            {/* Admin login route */}
            <Route path="/admin2/login" element={<ThemeProvider><LanguageProvider><AdminLogin /></LanguageProvider></ThemeProvider>} />
=======
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
>>>>>>> eebdd9b11460000b483e54b3d9e5b6a239a259b1

            {/* Error routes */}
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
