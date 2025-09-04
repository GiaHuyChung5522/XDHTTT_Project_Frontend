import React, { useState } from 'react';
import { Card, Button, Input, Form, message, Space, Divider, Typography, Alert } from 'antd';
import { useAuth } from '../context/AuthContext';
import { testUsers, testCredentials } from '../data/authTestData';

const { Title, Text } = Typography;

const TestAuth = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleQuickLogin = async (userType) => {
    setLoading(true);
    try {
      const testUser = testUsers[userType];
      await login({ email: testUser.email, password: testUser.password });
      message.success(`Đăng nhập thành công với tài khoản ${userType}!`);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Đăng nhập thành công!');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestRegister = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Đăng ký thành công!');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Đăng xuất thành công!');
    } catch (error) {
      message.error('Lỗi khi đăng xuất');
    }
  };

  const toggleMockMode = () => {
    const currentMode = localStorage.getItem('useMockAuth') === 'true';
    localStorage.setItem('useMockAuth', (!currentMode).toString());
    message.info(`Mock mode ${!currentMode ? 'enabled' : 'disabled'}. Reload page to apply.`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>🧪 Auth System Test</Title>
      
      {/* Current Status */}
      <Card title="Trạng thái hiện tại" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Đăng nhập: </Text>
            <Text type={isAuthenticated ? 'success' : 'danger'}>
              {isAuthenticated ? 'Đã đăng nhập' : 'Chưa đăng nhập'}
            </Text>
          </div>
          {user && (
            <div>
              <Text strong>User: </Text>
              <Text>{user.name} ({user.email})</Text>
            </div>
          )}
          {user && (
            <div>
              <Text strong>Role: </Text>
              <Text type="secondary">{user.role}</Text>
            </div>
          )}
          <div>
            <Text strong>Mock Mode: </Text>
            <Text type="secondary">
              {localStorage.getItem('useMockAuth') === 'true' ? 'Enabled' : 'Disabled'}
            </Text>
          </div>
        </Space>
      </Card>

      {/* Quick Login Buttons */}
      <Card title="Quick Login (Test Accounts)" style={{ marginBottom: 24 }}>
        <Space wrap>
          <Button 
            type="primary" 
            onClick={() => handleQuickLogin('admin')}
            loading={loading}
          >
            Login as Admin
          </Button>
          <Button 
            type="default" 
            onClick={() => handleQuickLogin('staff')}
            loading={loading}
          >
            Login as Staff
          </Button>
          <Button 
            type="default" 
            onClick={() => handleQuickLogin('user')}
            loading={loading}
          >
            Login as User
          </Button>
        </Space>
        
        <Divider />
        
        <Alert
          message="Test Accounts"
          description={
            <div>
              <p><strong>Admin:</strong> admin@7nfashion.com / Admin123</p>
              <p><strong>Staff:</strong> staff@7nfashion.com / Staff123</p>
              <p><strong>User:</strong> user@test.com / User123</p>
            </div>
          }
          type="info"
          showIcon
        />
      </Card>

      {/* Manual Login Form */}
      <Card title="Manual Login Test" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTestLogin}
          initialValues={testCredentials.valid}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Vui lòng nhập password' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Test Login
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Register Test */}
      <Card title="Register Test" style={{ marginBottom: 24 }}>
        <Form
          layout="vertical"
          onFinish={handleTestRegister}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Vui lòng nhập password' },
              { min: 6, message: 'Password phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Test Register
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Actions */}
      <Card title="Actions">
        <Space>
          <Button 
            type="default" 
            onClick={handleLogout}
            disabled={!isAuthenticated}
          >
            Logout
          </Button>
          <Button 
            type="dashed" 
            onClick={toggleMockMode}
          >
            Toggle Mock Mode
          </Button>
          <Button 
            type="link" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default TestAuth;
