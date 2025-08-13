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

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          <Route
            path="/products"
            element={
              <MainLayout>
                <ProductShowcase />
              </MainLayout>
            }
          />

          <Route
            path="/products/:id"
            element={
              <MainLayout>
                <ProductDetail />
              </MainLayout>
            }
          />

          {/* Apple */}
          <Route
            path="/apple"
            element={
              <MainLayout>
                <ApplePage />
              </MainLayout>
            }
          />

          {/* Giới thiệu */}
          <Route
            path="/about"
            element={
              <MainLayout>
                <About />
              </MainLayout>
            }
          />

          <Route
            path="/khuyen-mai"
            element={
              <MainLayout>
                <KhuyenMai />
              </MainLayout>
            }
          />
          <Route
            path="/tin-tuc"
            element={
              <MainLayout>
                <TinTuc />
              </MainLayout>
            }
          />

          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />

          <Route
            path="*"
            element={
              <MainLayout>
                <NotFound />
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
