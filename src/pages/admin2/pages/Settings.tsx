import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  InputNumber,
  message,
  Divider,
  Typography,
  Space,
  Tabs,
  Row,
  Col,
  Upload,
  ColorPicker,
  TimePicker,
  Alert,
  List,
  Popconfirm,
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  MailOutlined,
  BellOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  LockOutlined,
  EyeOutlined,
  DeleteOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    autoBackup: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
    };
    twoFactorAuth: boolean;
    loginAttempts: number;
    ipWhitelist: string[];
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpEncryption: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    notificationSound: boolean;
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number;
    compressionEnabled: boolean;
    minifyAssets: boolean;
    cdnEnabled: boolean;
    cdnUrl: string;
  };
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'Gr7 UTH',
      siteDescription: 'Cửa hàng thời trang trực tuyến hàng đầu Việt Nam',
      adminEmail: 'admin@7nfashion.com',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      maintenanceMode: false,
      autoBackup: true,
    },
    security: {
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
      },
      twoFactorAuth: true,
      loginAttempts: 5,
      ipWhitelist: ['192.168.1.1', '10.0.0.1'],
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@7nfashion.com',
      smtpPassword: '••••••••',
      smtpEncryption: 'TLS',
      fromEmail: 'noreply@7nfashion.com',
      fromName: 'Gr7 UTH',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      notificationSound: true,
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00',
      },
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      compressionEnabled: true,
      minifyAssets: true,
      cdnEnabled: false,
      cdnUrl: '',
    },
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Update settings based on active tab
      const updatedSettings = {
        ...settings,
        [activeTab]: { ...settings[activeTab as keyof SystemSettings], ...values },
      };
      
      setSettings(updatedSettings);
      message.success('Cài đặt đã được lưu thành công!');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu cài đặt!');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(settings[activeTab as keyof SystemSettings]);
    message.info('Đã khôi phục giá trị ban đầu');
  };

  const handleTestEmail = () => {
    message.loading('Đang gửi email test...', 2.5)
      .then(() => message.success('Email test đã được gửi thành công!'));
  };

  const handleAddIP = (ip: string) => {
    if (ip && !settings.security.ipWhitelist.includes(ip)) {
      const newSettings = {
        ...settings,
        security: {
          ...settings.security,
          ipWhitelist: [...settings.security.ipWhitelist, ip],
        },
      };
      setSettings(newSettings);
      message.success('Đã thêm IP vào whitelist');
    }
  };

  const handleRemoveIP = (ip: string) => {
    const newSettings = {
      ...settings,
      security: {
        ...settings.security,
        ipWhitelist: settings.security.ipWhitelist.filter(item => item !== ip),
      },
    };
    setSettings(newSettings);
    message.success('Đã xóa IP khỏi whitelist');
  };

  const renderGeneralSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.general}
      onValuesChange={(changedValues, allValues) => {
        setSettings({
          ...settings,
          general: { ...settings.general, ...allValues },
        });
      }}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            label="Tên website"
            name="siteName"
            rules={[{ required: true, message: 'Vui lòng nhập tên website!' }]}
          >
            <Input placeholder="Nhập tên website" />
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Form.Item
            label="Mô tả website"
            name="siteDescription"
          >
            <TextArea rows={3} placeholder="Nhập mô tả website" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Email quản trị"
            name="adminEmail"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Múi giờ" name="timezone">
            <Select placeholder="Chọn múi giờ">
              <Option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</Option>
              <Option value="Asia/Tokyo">Tokyo (GMT+9)</Option>
              <Option value="America/New_York">New York (GMT-5)</Option>
              <Option value="Europe/London">London (GMT+0)</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Ngôn ngữ" name="language">
            <Select placeholder="Chọn ngôn ngữ">
              <Option value="vi">Tiếng Việt</Option>
              <Option value="en">English</Option>
              <Option value="ja">日本語</Option>
              <Option value="ko">한국어</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
            <Form.Item name="maintenanceMode" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Chế độ bảo trì</Text>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
            <Form.Item name="autoBackup" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Tự động sao lưu</Text>
          </div>
        </Col>
      </Row>
    </Form>
  );

  const renderSecuritySettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.security}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Thời gian phiên (phút)"
            name="sessionTimeout"
            rules={[{ required: true, type: 'number', min: 5, max: 120 }]}
          >
            <InputNumber min={5} max={120} placeholder="30" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Số lần đăng nhập sai tối đa"
            name="loginAttempts"
            rules={[{ required: true, type: 'number', min: 3, max: 10 }]}
          >
            <InputNumber min={3} max={10} placeholder="5" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Title level={5}>Chính sách mật khẩu</Title>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Độ dài tối thiểu"
            name={['passwordPolicy', 'minLength']}
            rules={[{ required: true, type: 'number', min: 6, max: 32 }]}
          >
            <InputNumber min={6} max={32} placeholder="8" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
            <Form.Item name={['passwordPolicy', 'requireSpecialChars']} valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Yêu cầu ký tự đặc biệt</Text>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Form.Item name={['passwordPolicy', 'requireNumbers']} valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Yêu cầu số</Text>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Form.Item name={['passwordPolicy', 'requireUppercase']} valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Yêu cầu chữ hoa</Text>
          </div>
        </Col>

        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <Form.Item name="twoFactorAuth" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Xác thực 2 yếu tố (2FA)</Text>
          </div>
        </Col>

        <Col span={24}>
          <Divider />
          <Title level={5}>IP Whitelist</Title>
          <List
            size="small"
            dataSource={settings.security.ipWhitelist}
            renderItem={(ip) => (
              <List.Item
                actions={[
                  <Popconfirm
                    title="Xóa IP này?"
                    onConfirm={() => handleRemoveIP(ip)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button type="text" icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                ]}
              >
                <Text code>{ip}</Text>
              </List.Item>
            )}
          />
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <Input
              placeholder="192.168.1.1"
              onPressEnter={(e) => {
                handleAddIP((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }}
              style={{ flex: 1 }}
            />
            <Button type="primary">Thêm IP</Button>
          </div>
        </Col>
      </Row>
    </Form>
  );

  const renderEmailSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.email}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="SMTP Host"
            name="smtpHost"
            rules={[{ required: true, message: 'Vui lòng nhập SMTP host!' }]}
          >
            <Input placeholder="smtp.gmail.com" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="SMTP Port"
            name="smtpPort"
            rules={[{ required: true, type: 'number' }]}
          >
            <InputNumber min={1} max={65535} placeholder="587" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Username"
            name="smtpUsername"
            rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
          >
            <Input placeholder="noreply@example.com" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Password"
            name="smtpPassword"
            rules={[{ required: true, message: 'Vui lòng nhập password!' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Mã hóa" name="smtpEncryption">
            <Select placeholder="Chọn phương thức mã hóa">
              <Option value="none">Không</Option>
              <Option value="TLS">TLS</Option>
              <Option value="SSL">SSL</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Email gửi"
            name="fromEmail"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="noreply@example.com" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Tên người gửi"
            name="fromName"
            rules={[{ required: true, message: 'Vui lòng nhập tên người gửi!' }]}
          >
            <Input placeholder="Gr7 UTH" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Button
            type="dashed"
            icon={<MailOutlined />}
            onClick={handleTestEmail}
            style={{ width: '100%', marginTop: '16px' }}
          >
            Gửi email test
          </Button>
        </Col>
      </Row>
    </Form>
  );

  const renderNotificationSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.notifications}
    >
      <Row gutter={24}>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name="emailNotifications" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Thông báo qua email</Text>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name="pushNotifications" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Thông báo đẩy</Text>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name="smsNotifications" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Thông báo SMS</Text>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name="notificationSound" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Âm thanh thông báo</Text>
          </div>
        </Col>

        <Col span={24}>
          <Divider />
          <Title level={5}>Giờ yên tĩnh</Title>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name={['quietHours', 'enabled']} valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Bật giờ yên tĩnh</Text>
          </div>
        </Col>

        <Col span={12}></Col>

        <Col span={12}>
          <Form.Item label="Bắt đầu" name={['quietHours', 'startTime']}>
            <TimePicker format="HH:mm" placeholder="22:00" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Kết thúc" name={['quietHours', 'endTime']}>
            <TimePicker format="HH:mm" placeholder="08:00" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  const renderPerformanceSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.performance}
    >
      <Row gutter={24}>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name="cacheEnabled" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Bật cache</Text>
          </div>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Thời gian cache (giây)"
            name="cacheDuration"
            rules={[{ required: true, type: 'number', min: 300 }]}
          >
            <InputNumber min={300} placeholder="3600" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name="compressionEnabled" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Nén dữ liệu</Text>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name="minifyAssets" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Tối ưu assets</Text>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Form.Item name="cdnEnabled" valuePropName="checked" style={{ margin: 0 }}>
              <Switch />
            </Form.Item>
            <Text>Bật CDN</Text>
          </div>
        </Col>

        <Col span={12}>
          <Form.Item
            label="CDN URL"
            name="cdnUrl"
            dependencies={['cdnEnabled']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('cdnEnabled') && !value) {
                    return Promise.reject(new Error('Vui lòng nhập CDN URL!'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="https://cdn.example.com" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <GlobalOutlined />
          Tổng quan
        </span>
      ),
      children: renderGeneralSettings(),
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined />
          Bảo mật
        </span>
      ),
      children: renderSecuritySettings(),
    },
    {
      key: 'email',
      label: (
        <span>
          <MailOutlined />
          Email
        </span>
      ),
      children: renderEmailSettings(),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined />
          Thông báo
        </span>
      ),
      children: renderNotificationSettings(),
    },
    {
      key: 'performance',
      label: (
        <span>
          <DatabaseOutlined />
          Hiệu suất
        </span>
      ),
      children: renderPerformanceSettings(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingOutlined style={{ color: '#3b82f6' }} />
            <Title level={4} style={{ margin: 0, color: '#111827' }}>
              Cài đặt hệ thống
            </Title>
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
              style={{ borderRadius: '6px' }}
            >
              Khôi phục
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={loading}
              style={{ borderRadius: '6px' }}
            >
              Lưu thay đổi
            </Button>
          </Space>
        }
        style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
      >
        {settings.general.maintenanceMode && (
          <Alert
            message="Chế độ bảo trì đang được bật"
            description="Website hiện đang ở chế độ bảo trì. Người dùng sẽ không thể truy cập."
            type="warning"
            icon={<WarningOutlined />}
            style={{ marginBottom: '24px' }}
            showIcon
          />
        )}

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>
    </motion.div>
  );
};

export default Settings; 