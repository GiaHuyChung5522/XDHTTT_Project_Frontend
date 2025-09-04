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
    name: 'Quản trị viên', 
    email: 'admin@example.com', 
    avatar: '👤'
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
    { key: '/admin2/products', icon: <ShopOutlined />, label: 'Sản phẩm' },
    { key: '/admin2/orders', icon: <ShoppingCartOutlined />, label: 'Đơn hàng' },
    { key: '/admin2/customers', icon: <UserOutlined />, label: 'Khách hàng' },
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
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={280}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo Section */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #f3f4f6',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }} 
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}>
              <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>7N</span>
            </div>
            {!collapsed && (
              <div>
                <Title level={4} style={{ margin: 0, color: 'white', fontWeight: '700' }}>
                  7N Fashion
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '500' }}>
                  ADMIN DASHBOARD
                </Text>
              </div>
            )}
          </motion.div>
        </div>

        {/* User Info Section */}
        {!collapsed && (
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid #f3f4f6',
            background: '#ffffff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar 
                size={48} 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: '3px solid #eef2ff',
                }}
              >
                {currentUser.avatar}
              </Avatar>
              <div>
                <Text style={{ 
                  display: 'block', 
                  color: '#1f2937', 
                  fontWeight: '600',
                  fontSize: '14px',
                }}>
                  {currentUser.name}
                </Text>
                <Text style={{ 
                  display: 'block', 
                  color: '#6b7280', 
                  fontSize: '12px',
                  fontWeight: '500',
                }}>
                  {currentUser.email}
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <Menu 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          onClick={handleMenuClick} 
          style={{ 
            border: 'none',
            height: 'calc(100vh - 140px)',
            background: '#ffffff',
            padding: '16px 0',
          }}
          className="admin-menu"
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: '#ffffff', 
          borderBottom: '1px solid #e5e7eb',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
              type="text" 
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
              onClick={() => setCollapsed(!collapsed)} 
              style={{ 
                color: '#6b7280',
                fontSize: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
              }}
            />
            <Text style={{ 
              color: '#374151', 
              fontSize: '18px',
              fontWeight: '600',
            }}>
              {menuItems.find(i => i.key === location.pathname)?.label || 'Dashboard'}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Tooltip title="Chuyển đổi giao diện">
              <Switch 
                checked={isDark} 
                onChange={toggleTheme} 
                checkedChildren={<MoonOutlined />} 
                unCheckedChildren={<SunOutlined />}
                style={{
                  background: isDark ? '#6366f1' : '#10b981',
                }}
              />
            </Tooltip>

            <Badge count={5} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                style={{ 
                  color: '#6b7280',
                  fontSize: '16px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                }}
              />
            </Badge>

            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Button 
                type="text" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                }}
              >
                <Avatar 
                  size={32} 
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {currentUser.avatar}
                </Avatar>
                {!collapsed && (
                  <Text style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                    {currentUser.name.split(' ')[0]}
                  </Text>
                )}
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ 
          margin: 0,
          background: '#f8fafc',
          overflow: 'auto',
        }}>
          <Outlet />
        </Content>
      </Layout>

      <style>{`
        .admin-menu .ant-menu-item {
          margin: 4px 16px;
          border-radius: 8px;
          height: 44px;
          line-height: 44px;
        }
        
        .admin-menu .ant-menu-item-selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .admin-menu .ant-menu-item:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .admin-menu .ant-menu-item-selected:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>
    </Layout>
  );
};

export default AdminLayout;
