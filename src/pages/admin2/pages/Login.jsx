import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Form, Input, Button, message, Card, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authService } from '../auth/auth.service';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Sử dụng authService để đăng nhập
      await authService.login(values);
      message.success('Đăng nhập thành công!');
      
      // Chuyển hướng đến dashboard admin
      navigate('/admin2', { replace: true });
    } catch (error) {
      message.error(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 200,
                delay: 0.2 
              }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div 
                  className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center"
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <span className="text-white text-3xl font-bold">7N</span>
                </div>
              </div>
            </motion.div>
            
            <Title level={2} className="mb-2">
              7N Fashion Admin
            </Title>
            
            <Text type="secondary" style={{ 
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Đăng nhập vào hệ thống quản trị
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email!',
                },
                {
                  type: 'email',
                  message: 'Email không hợp lệ!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="admin@gmail.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-base font-medium"
                style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6' }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary" className="text-xs">
              Thông tin đăng nhập demo
            </Text>
          </Divider>

          <div className="text-center">
            <Space direction="vertical" size={2}>
              <Text type="secondary" className="text-sm">
                <strong>Email:</strong> admin@gmail.com
              </Text>
              <Text type="secondary" className="text-sm">
                <strong>Mật khẩu:</strong> admin123
              </Text>
            </Space>
          </div>

          <div className="text-center mt-6">
            <Button
              type="link"
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Về trang chủ
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
