import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown, Space, Badge, Switch, Tooltip, message } from 'antd';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, ShoppingCartOutlined, UserOutlined,
  ShopOutlined, TagOutlined, BarChartOutlined, SettingOutlined, BellOutlined, LogoutOutlined,
  SunOutlined, MoonOutlined, AppstoreOutlined, CrownOutlined, FileTextOutlined, BulbOutlined,
  MessageOutlined, NotificationOutlined, ProfileOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import { authService } from '../pages/admin2/auth/auth.service';
import { useTheme } from '../pages/admin2/contexts/ThemeContext';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, updateTheme } = useTheme();
  const [currentUser] = useState(() => authService.getCurrentUser() || {
    name: 'Admin', email: 'admin@example.com', avatar: '👨‍💼'
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    message.success('Đăng xuất thành công!');
    navigate('/admin2/login');
  };

  const menuItems = [
    { key: '/admin2', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin2/analytics', icon: <BarChartOutlined />, label: 'Thống kê' },
    { key: '/admin2/categories', icon: <AppstoreOutlined />, label: 'Danh mục' },
    { key: '/admin2/brands', icon: <CrownOutlined />, label: 'Thương hiệu' },
    { key: '/admin2/products', icon: <ShopOutlined />, label: 'Sản phẩm' },
    { key: '/admin2/orders', icon: <ShoppingCartOutlined />, label: 'Đơn hàng' },
    { key: '/admin2/customers', icon: <UserOutlined />, label: 'Khách hàng' },
    { key: '/admin2/posts', icon: <FileTextOutlined />, label: 'Bài viết' },
    { key: '/admin2/topics', icon: <BulbOutlined />, label: 'Chủ đề' },
    { key: '/admin2/messages', icon: <MessageOutlined />, label: 'Tin nhắn' },
    { key: '/admin2/notifications', icon: <NotificationOutlined />, label: 'Thông báo' },
    { key: '/admin2/profile', icon: <ProfileOutlined />, label: 'Hồ sơ' },
    { key: '/admin2/settings', icon: <SettingOutlined />, label: 'Cài đặt' },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <ProfileOutlined />, label: 'Profile', onClick: () => navigate('/admin2/profile') },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', onClick: () => navigate('/admin2/settings') },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout },
  ];

  const handleMenuClick = ({ key }: { key: string }) => navigate(key);
  const toggleTheme = () => updateTheme({ mode: isDark ? 'light' : 'dark' });

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white border-r border-gray-200" width={280}>
        <div className="p-4 border-b border-gray-200">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">7N</span>
            </div>
            {!collapsed && (
              <div>
                <Title level={4} className="m-0 text-gray-800">7N</Title>
                <Text className="text-gray-500 text-xs">TRANG QUẢN TRỊ</Text>
              </div>
            )}
          </motion.div>
        </div>

        {!collapsed && (
          <div className="px-4 py-3 border-b border-gray-200 flex items-center space-x-3">
            <Avatar size={40} className="bg-blue-600">{currentUser.avatar}</Avatar>
            <div>
              <Text className="block text-gray-800 font-medium">{currentUser.name}</Text>
              <Text className="block text-gray-500 text-xs">{currentUser.email}</Text>
            </div>
          </div>
        )}

        <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} onClick={handleMenuClick} className="border-0" style={{ height: 'calc(100vh - 80px)' }} />
      </Sider>

      <Layout>
        <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
          <div className="flex items-center space-x-4">
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} className="text-gray-600 hover:text-gray-800" />
            <Text className="text-gray-600">{menuItems.find(i => i.key === location.pathname)?.label || 'Dashboard'}</Text>
          </div>

          <div className="flex items-center space-x-4">
            <Tooltip title="Toggle theme">
              <Switch checked={isDark} onChange={toggleTheme} checkedChildren={<MoonOutlined />} unCheckedChildren={<SunOutlined />} />
            </Tooltip>

            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} className="text-gray-600 hover:text-gray-800" onClick={() => navigate('/admin2/notifications')} />
            </Badge>

            <Dropdown
              menu={{ items: userMenuItems, style: { minWidth: 220 } }}
              placement="bottomRight"
              overlayStyle={{ zIndex: 1000 }}
              trigger={['click']}
            >
              <div className="inline-flex">
                <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
                  <Avatar size="small" className="bg-blue-600">{currentUser.avatar}</Avatar>
                  {!collapsed && (
                    <div className="text-left">
                      <Text className="text-gray-800 font-medium block">{currentUser.name}</Text>
                      <Text className="text-gray-500 text-xs block">{currentUser.email}</Text>
                    </div>
                  )}
                </Space>
              </div>
            </Dropdown>
          </div>
         
          <Header className="bg-white border-b px-6 flex justify-between fixed top-0 inset-x-0 z-50 h-16" />
          <Layout className="pt-16">  {/* chừa chỗ = 64px */}
            <Content className="m-6 p-6 bg-gray-50 rounded-lg"> ... </Content>
          </Layout>

        </Header>

        <Content className="m-6 p-6 bg-gray-50 rounded-lg mt-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
