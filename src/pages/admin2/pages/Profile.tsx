import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Avatar,
  Upload,
  message,
  Divider,
  Typography,
  Space,
  Tag,
  Descriptions,
  Tabs,
  Table,
  List,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ActivityType {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'login' | 'create' | 'update' | 'delete';
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Mock user data
  const [userInfo, setUserInfo] = useState({
    id: 'admin001',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@7nfashion.com',
    phone: '0123456789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    position: 'Quản trị viên hệ thống',
    department: 'Công nghệ thông tin',
    joinDate: '2023-01-15',
    lastLogin: '2024-12-09 08:30',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    bio: 'Quản trị viên hệ thống với 5 năm kinh nghiệm trong lĩnh vực e-commerce và thời trang.',
    permissions: ['admin', 'user_management', 'content_management', 'system_config'],
    stats: {
      totalLogins: 1247,
      tasksCompleted: 892,
      projectsManaged: 15,
      teamSize: 8,
    }
  });

  // Recent activities
  const [activities] = useState<ActivityType[]>([
    {
      id: '1',
      action: 'Đăng nhập hệ thống',
      description: 'Đăng nhập từ IP: 192.168.1.100',
      timestamp: '2024-12-09 08:30',
      type: 'login',
    },
    {
      id: '2',
      action: 'Cập nhật sản phẩm',
      description: 'Cập nhật thông tin sản phẩm "Áo thun basic"',
      timestamp: '2024-12-08 16:45',
      type: 'update',
    },
    {
      id: '3',
      action: 'Tạo thương hiệu mới',
      description: 'Thêm thương hiệu "New Brand"',
      timestamp: '2024-12-08 14:20',
      type: 'create',
    },
    {
      id: '4',
      action: 'Xóa bài viết',
      description: 'Xóa bài viết "Bài viết test"',
      timestamp: '2024-12-08 10:15',
      type: 'delete',
    },
    {
      id: '5',
      action: 'Đăng nhập hệ thống',
      description: 'Đăng nhập từ IP: 192.168.1.100',
      timestamp: '2024-12-08 08:00',
      type: 'login',
    },
  ]);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(userInfo);
  };

  const handleSave = (values: any) => {
    setUserInfo({ ...userInfo, ...values });
    setIsEditing(false);
    message.success('Cập nhật thông tin thành công!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success('Cập nhật ảnh đại diện thành công!');
    }
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      login: <UserOutlined style={{ color: '#3b82f6' }} />,
      create: <EditOutlined style={{ color: '#10b981' }} />,
      update: <EditOutlined style={{ color: '#f59e0b' }} />,
      delete: <EditOutlined style={{ color: '#ef4444' }} />,
    };
    return icons[type as keyof typeof icons];
  };

  const activityColumns: ColumnsType<ActivityType> = [
    {
      title: 'Hoạt động',
      key: 'activity',
      render: (_, record) => (
        <div>
          <Space>
            {getActivityIcon(record.type)}
            <div>
              <div style={{ fontWeight: '600', color: '#111827' }}>{record.action}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{record.description}</div>
            </div>
          </Space>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {dayjs(timestamp).format('DD/MM/YYYY HH:mm')}
        </div>
      ),
    },
  ];

  const uploadButton = (
    <div style={{ 
      width: 120, 
      height: 120, 
      border: '2px dashed #d1d5db', 
      borderRadius: '50%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      cursor: 'pointer',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ textAlign: 'center' }}>
        <CameraOutlined style={{ fontSize: '24px', color: '#6b7280' }} />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
          Thay đổi
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Row gutter={[24, 24]}>
        {/* Left Column - Profile Info */}
        <Col xs={24} md={8}>
          <Card 
            style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}
          >
            <div style={{ marginBottom: '24px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={userInfo.avatar}
                  icon={<UserOutlined />}
                  style={{ border: '4px solid #f3f4f6' }}
                />
                <Upload
                  showUploadList={false}
                  onChange={handleAvatarChange}
                  style={{ position: 'absolute', bottom: 0, right: 0 }}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: -8,
                    right: -8,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px solid white'
                  }}>
                    <CameraOutlined style={{ color: 'white', fontSize: '16px' }} />
                  </div>
                </Upload>
              </div>
              
              <Title level={4} style={{ marginTop: '16px', marginBottom: '4px', color: '#111827' }}>
                {userInfo.fullName}
              </Title>
              <Text style={{ color: '#6b7280' }}>{userInfo.position}</Text>
              
              <div style={{ marginTop: '16px' }}>
                <Tag color="blue" style={{ marginBottom: '8px' }}>{userInfo.department}</Tag>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  <CalendarOutlined style={{ marginRight: '6px' }} />
                  Tham gia từ {dayjs(userInfo.joinDate).format('DD/MM/YYYY')}
                </div>
              </div>
            </div>

            <Divider />

            {/* Quick Stats */}
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>
                    {userInfo.stats.totalLogins}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Lần đăng nhập</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                    {userInfo.stats.tasksCompleted}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Tác vụ hoàn thành</div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Permissions Card */}
          <Card 
            title="Quyền hạn"
            style={{ borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '16px' }}
          >
            <Space wrap>
              <Tag color="red" icon={<SafetyCertificateOutlined />}>Quản trị viên</Tag>
              <Tag color="blue" icon={<TeamOutlined />}>Quản lý người dùng</Tag>
              <Tag color="green" icon={<EditOutlined />}>Quản lý nội dung</Tag>
              <Tag color="orange" icon={<TrophyOutlined />}>Cấu hình hệ thống</Tag>
            </Space>
          </Card>
        </Col>

        {/* Right Column - Details & Activities */}
        <Col xs={24} md={16}>
          <Tabs defaultActiveKey="info">
            <TabPane tab="Thông tin cá nhân" key="info">
              <Card 
                title="Thông tin chi tiết"
                extra={
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ borderRadius: '6px' }}
                  >
                    Chỉnh sửa
                  </Button>
                }
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              >
                {isEditing ? (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    initialValues={userInfo}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Họ và tên" name="fullName">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Email" name="email">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Số điện thoại" name="phone">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Chức vụ" name="position">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="Địa chỉ" name="address">
                      <Input />
                    </Form.Item>

                    <Form.Item label="Giới thiệu" name="bio">
                      <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item>
                      <Space>
                        <Button type="primary" htmlType="submit" style={{ borderRadius: '6px' }}>
                          Lưu thay đổi
                        </Button>
                        <Button onClick={handleCancel} style={{ borderRadius: '6px' }}>
                          Hủy
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                ) : (
                  <Descriptions column={1} labelStyle={{ width: '150px', fontWeight: '600' }}>
                    <Descriptions.Item 
                      label={<><MailOutlined style={{ marginRight: '8px' }} />Email</>}
                    >
                      {userInfo.email}
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<><PhoneOutlined style={{ marginRight: '8px' }} />Điện thoại</>}
                    >
                      {userInfo.phone}
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<><EnvironmentOutlined style={{ marginRight: '8px' }} />Địa chỉ</>}
                    >
                      {userInfo.address}
                    </Descriptions.Item>
                    <Descriptions.Item 
                      label={<><ClockCircleOutlined style={{ marginRight: '8px' }} />Đăng nhập cuối</>}
                    >
                      {dayjs(userInfo.lastLogin).format('DD/MM/YYYY HH:mm')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giới thiệu">
                      {userInfo.bio}
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Card>
            </TabPane>

            <TabPane tab="Lịch sử hoạt động" key="activity">
              <Card 
                title="Hoạt động gần đây"
                style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              >
                <Table
                  columns={activityColumns}
                  dataSource={activities}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showQuickJumper: false,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hoạt động`,
                  }}
                />
              </Card>
            </TabPane>

            <TabPane tab="Thống kê" key="stats">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                      {userInfo.stats.projectsManaged}
                    </div>
                    <div style={{ color: '#6b7280' }}>Dự án quản lý</div>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                      {userInfo.stats.teamSize}
                    </div>
                    <div style={{ color: '#6b7280' }}>Thành viên nhóm</div>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
                      {userInfo.stats.totalLogins}
                    </div>
                    <div style={{ color: '#6b7280' }}>Tổng lần đăng nhập</div>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px' }}>
                      {userInfo.stats.tasksCompleted}
                    </div>
                    <div style={{ color: '#6b7280' }}>Tác vụ hoàn thành</div>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Profile; 