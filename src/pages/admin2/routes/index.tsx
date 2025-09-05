import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';

import {
  Dashboard, Products, Orders, Customers, Categories, Brands,
  Posts, Topics, Messages, Notifications, Analytics, Profile
} from '../pages';
import Settings from '../pages/Settings';

export const routes = createBrowserRouter([
  { path: '/admin/login', element: <Login /> },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <Products /> },
      { path: 'categories', element: <Categories /> },
      { path: 'brands', element: <Brands /> },
      { path: 'orders', element: <Orders /> },
      { path: 'customers', element: <Customers /> },
      { path: 'posts', element: <Posts /> },
      { path: 'topics', element: <Topics /> },
      { path: 'messages', element: <Messages /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  // Public site nếu cần:
  // { path: '/', element: <MainLayout />, children: [{ index: true, element: <Home /> }] },
]);
