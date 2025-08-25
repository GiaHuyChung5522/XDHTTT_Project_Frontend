import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Form, Input, Button, message, Card, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authService } from '../auth/auth.service';
import { useLanguage } from '../contexts/LanguageContext';
import type { LoginRequest } from '../auth/auth.service';
import logo from '@/assets/img/logoUTH.png'; 
const { Title, Text } = Typography; 

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const from = (location.state as any)?.from?.pathname || '/admin2';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      await authService.login(values);
      message.success(t('login.success'));
      const from = (location.state as any)?.from?.pathname || '/admin2';
      navigate(from, { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={logo} // 
                  alt="Logo"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    boxShadow: '0 8px 32px rgba(59,130,246,.25), 0 4px 12px rgba(0,0,0,.1)',
                    border: '2px solid rgba(59,130,246,.2)',
                    display: 'block'
                  }}
                />
              </div>
            </motion.div>

            <Text type="secondary" style={{ fontSize: 14, color: '#6b7280' }}>
              {t('login.subtitle')}
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ email: 'admin@7nfashion.com', password: 'admin123' }}
          >
            <Form.Item
              name="email"
              label={t('login.email') || 'Email'}
              rules={[{ required: true, message: t('login.email_required') || 'Vui lòng nhập email' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder=""
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t('login.password') || 'Mật khẩu'}
              rules={[{ required: true, message: t('login.password_required') || 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                {t('login.sign_in') || 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mt-6">
          <Text type="secondary" className="text-sm">
            {t('common.copyright')}
          </Text>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
