import { RouterProvider, createBrowserRouter } from "react-router-dom";
// Import admin routes
import AdminLayout from "../../../../layouts/AdminLayout";
import ProtectedRoute from "../../routes/ProtectedRoute";
import AdminLogin from "../Login";
import Dashboard from "../Dashboard";
import Products from "../Products";
import Orders from "../Orders";
import Customers from "../Customers";
import Categories from "../Categories";
import Brands from "../Brands";
import Posts from "../Posts";
import Topics from "../Topics";
import Messages from "../Messages";
import Notifications from "../Notifications";
import Analytics from "../Analytics";
import Profile from "../Profile";
import Settings from "../Settings";

// Import các component từ trang ecommerce
import MainLayout from "../../../../layouts/MainLayout";
import Home from "../../../../pages/user/Home";
import ProductList from "../../../../pages/user/ProductList";
import ProductDetail from "../../../../pages/user/ProductDetail";
import Cart from "../../../../pages/user/Cart";
import Checkout from "../../../../pages/user/Checkout";
import Login from "../../../../pages/auth/Login";
import Register from "../../../../pages/auth/Register";
import Account from "../../../../pages/user/Account";
import News from "../../../../pages/user/News";
import NewsDetail from "../../../../pages/user/NewsDetail";
import Promotion from "../../../../pages/user/Promotion";
import PromotionDetail from "../../../../pages/user/PromotionDetail";
import Wishlist from "../../../../pages/user/Wishlist";
import About from "../../../../pages/user/About";
import OrderSuccess from "../../../../pages/user/OrderSuccess";
import NotFound from "../../../../pages/NotFound";

// Tạo router chính kết nối cả ecommerce và admin
const mainRoutes = createBrowserRouter([
  // Admin routes
  {
    path: "/admin2/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin2",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "brands",
        element: <Brands />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "topics",
        element: <Topics />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "analytics", 
        element: <Analytics />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  
  // Ecommerce routes
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <ProductList />,
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "news/:id",
        element: <NewsDetail />,
      },
      {
        path: "promotion",
        element: <Promotion />,
      },
      {
        path: "promotion/:id",
        element: <PromotionDetail />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const RouteProvider = () => {
  return <RouterProvider router={mainRoutes} />;
};

export default RouteProvider;
