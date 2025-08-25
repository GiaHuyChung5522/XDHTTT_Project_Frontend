import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Import pages
import Home from './pages/user/Home';
import About from './pages/user/About';
import Products from './pages/user/ProductList';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderSuccess from './pages/user/OrderSuccess';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Account from './pages/user/Account';
import Wishlist from './pages/user/Wishlist';
import News from './pages/user/News';
import Promotion from './pages/user/Promotion';
import Apple from './pages/user/Apple';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';

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
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="news" element={<News />} />
              <Route path="promotion" element={<Promotion />} />
              <Route path="apple" element={<Apple />} />
            </Route>

            {/* Auth routes */}
            <Route path="/auth" element={<MainLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

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
