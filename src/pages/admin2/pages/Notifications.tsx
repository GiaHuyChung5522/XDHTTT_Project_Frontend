import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Row,
  Col,
  Statistic,
  Avatar,
  Badge,
  Typography,
  DatePicker,
  List,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  NotificationOutlined,
  BellOutlined,
  UserOutlined,
  CalendarOutlined,
  SendOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface NotificationType {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'published' | 'sent' | 'scheduled';
  recipients: string;
  sendAt?: string;
  readCount: number;
  totalRecipients: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: '1',
      title: 'Thông báo bảo trì hệ thống',
      content: 'Hệ thống sẽ được bảo trì vào ngày 15/12/2024 từ 23:00 - 01:00. Trong thời gian này, website có thể tạm thời không truy cập được.',
      type: 'warning',
      priority: 'high',
      status: 'published',
      recipients: 'all_users',
      readCount: 156,
      totalRecipients: 2430,
      createdBy: 'Admin User',
      createdAt: '2024-12-09 09:00',
      updatedAt: '2024-12-09 09:00',
    },
    {
      id: '2',
      title: 'Flash Sale 12.12 - Giảm giá tới 50%',
      content: 'Sự kiện Flash Sale 12.12 sắp diễn ra! Hàng ngàn sản phẩm thời trang giảm giá tới 50%. Đừng bỏ lỡ cơ hội mua sắm tuyệt vời này!',
      type: 'success',
      priority: 'medium',
      status: 'scheduled',
      recipients: 'all_customers',
      sendAt: '2024-12-12 08:00',
      readCount: 0,
      totalRecipients: 1850,
      createdBy: 'Marketing Team',
      createdAt: '2024-12-08 14:30',
      updatedAt: '2024-12-08 14:30',
    },
    {
      id: '3',
      title: 'Cập nhật chính sách đổi trả',
      content: 'Chính sách đổi trả sản phẩm đã được cập nhật. Thời gian đổi trả được gia hạn từ 7 ngày lên 14 ngày.',
      type: 'info',
      priority: 'medium',
      status: 'sent',
      recipients: 'all_customers',
      readCount: 892,
      totalRecipients: 1850,
      createdBy: 'Customer Service',
      createdAt: '2024-12-05 10:15',
      updatedAt: '2024-12-05 10:15',
    },
    {
      id: '4',
      title: 'Cảnh báo: Phát hiện đăng nhập bất thường',
      content: 'Hệ thống phát hiện một số tài khoản có hoạt động đăng nhập bất thường. Vui lòng kiểm tra và thay đổi mật khẩu nếu cần thiết.',
      type: 'error',
      priority: 'urgent',
      status: 'draft',
      recipients: 'affected_users',
      readCount: 0,
      totalRecipients: 23,
      createdBy: 'Security Team',
      createdAt: '2024-12-09 16:45',
      updatedAt: '2024-12-09 16:45',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNotification, setEditingNotification] = useState<NotificationType | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingNotification, setViewingNotification] = useState<NotificationType | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingNotification(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (notification: NotificationType) => {
    setEditingNotification(notification);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...notification,
      sendAt: notification.sendAt ? dayjs(notification.sendAt, 'YYYY-MM-DD HH:mm') : undefined,
    });
  };

  const handleView = (notification: NotificationType) => {
    setViewingNotification(notification);
    setViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    message.success('Xóa thông báo thành công!');
  };

  const handleSubmit = (values: any) => {
    const notificationData = {
      ...values,
      sendAt: values.sendAt ? values.sendAt.format('YYYY-MM-DD HH:mm') : undefined,
      id: editingNotification ? editingNotification.id : Date.now().toString(),
      readCount: editingNotification?.readCount || 0,
      totalRecipients: getRecipientCount(values.recipients),
      createdBy: editingNotification?.createdBy || 'Admin User',
      createdAt: editingNotification?.createdAt || dayjs().format('YYYY-MM-DD HH:mm'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm'),
    };

    if (editingNotification) {
      setNotifications(notifications.map(notification => 
        notification.id === editingNotification.id ? notificationData : notification
      ));
      message.success('Cập nhật thông báo thành công!');
    } else {
      setNotifications([...notifications, notificationData]);
      message.success('Thêm thông báo thành công!');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSend = (notification: NotificationType) => {
    setNotifications(notifications.map(n => 
      n.id === notification.id 
        ? { ...n, status: 'sent', updatedAt: dayjs().format('YYYY-MM-DD HH:mm') }
        : n
    ));
    message.success('Gửi thông báo thành công!');
  };

  const getRecipientCount = (recipients: string) => {
    const counts = {
      'all_users': 2430,
      'all_customers': 1850,
      'vip_customers': 345,
      'new_customers': 156,
      'affected_users': 23,
    };
    return counts[recipients as keyof typeof counts] || 0;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      info: <InfoCircleOutlined style={{ color: '#3b82f6' }} />,
      warning: <WarningOutlined style={{ color: '#f59e0b' }} />,
      success: <CheckOutlined style={{ color: '#10b981' }} />,
      error: <ExclamationCircleOutlined style={{ color: '#ef4444' }} />,
    };
    return icons[type as keyof typeof icons];
  };

  const getTypeTag = (type: string) => {
    const typeConfig = {
      info: { color: 'blue', text: 'Thông tin' },
      warning: { color: 'orange', text: 'Cảnh báo' },
      success: { color: 'green', text: 'Thành công' },
      error: { color: 'red', text: 'Lỗi' },
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPriorityTag = (priority: string) => {
    const priorityConfig = {
      low: { color: 'green', text: 'Thấp' },
      medium: { color: 'blue', text: 'Trung bình' },
      high: { color: 'orange', text: 'Cao' },
      urgent: { color: 'red', text: 'Khẩn cấp' },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      draft: { color: 'gray', text: 'Bản nháp' },
      published: { color: 'blue', text: 'Đã xuất bản' },
      sent: { color: 'green', text: 'Đã gửi' },
      scheduled: { color: 'purple', text: 'Đã lên lịch' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ColumnsType<NotificationType> = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 60,
      render: (type: string) => getTypeIcon(type),
    },
    {
      title: 'Tiêu đề & Nội dung',
      key: 'content',
      render: (_, record: NotificationType) => (
        <div>
          <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            {record.title}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {record.content}
          </div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'typeTag',
      width: 100,
      render: (type: string) => getTypeTag(type),
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => getPriorityTag(priority),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Tỷ lệ đọc',
      key: 'readRate',
      width: 120,
      render: (_, record: NotificationType) => {
        const rate = record.totalRecipients > 0 ? (record.readCount / record.totalRecipients * 100).toFixed(1) : '0';
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#111827' }}>{rate}%</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              {record.readCount}/{record.totalRecipients}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 130,
      render: (_, record: NotificationType) => (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {record.sendAt ? (
            <>
              <div>Gửi: {dayjs(record.sendAt).format('DD/MM HH:mm')}</div>
              <div>Tạo: {dayjs(record.createdAt).format('DD/MM HH:mm')}</div>
            </>
          ) : (
            dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')
          )}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record: NotificationType) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ color: '#3b82f6' }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#10b981' }}
          />
          {record.status === 'draft' && (
            <Button
              type="text"
              icon={<SendOutlined />}
              onClick={() => handleSend(record)}
              style={{ color: '#8b5cf6' }}
            />
          )}
          <Popconfirm
            title="Xóa thông báo"
            description="Bạn có chắc chắn muốn xóa thông báo này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              style={{ color: '#ef4444' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Stats data
  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    draft: notifications.filter(n => n.status === 'draft').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Stats Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Tổng thông báo"
                value={stats.total}
                prefix={<NotificationOutlined style={{ color: '#3b82f6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Đã gửi"
                value={stats.sent}
                prefix={<CheckOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Đã lên lịch"
                value={stats.scheduled}
                prefix={<CalendarOutlined style={{ color: '#8b5cf6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Bản nháp"
                value={stats.draft}
                prefix={<EditOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Notifications Table */}
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Danh sách thông báo
              </span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{ borderRadius: '6px' }}
              >
                Tạo thông báo
              </Button>
            </div>
          }
          style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        >
          <Table
            columns={columns}
            dataSource={notifications}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thông báo`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingNotification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: '20px' }}
          >
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
              <Input placeholder="Nhập tiêu đề thông báo" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Loại thông báo"
                  name="type"
                  rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
                >
                  <Select placeholder="Chọn loại">
                    <Option value="info">Thông tin</Option>
                    <Option value="warning">Cảnh báo</Option>
                    <Option value="success">Thành công</Option>
                    <Option value="error">Lỗi</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Độ ưu tiên"
                  name="priority"
                  rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
                >
                  <Select placeholder="Chọn độ ưu tiên">
                    <Option value="low">Thấp</Option>
                    <Option value="medium">Trung bình</Option>
                    <Option value="high">Cao</Option>
                    <Option value="urgent">Khẩn cấp</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="draft">Bản nháp</Option>
                    <Option value="published">Xuất bản</Option>
                    <Option value="scheduled">Lên lịch</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Đối tượng nhận"
                  name="recipients"
                  rules={[{ required: true, message: 'Vui lòng chọn đối tượng!' }]}
                >
                  <Select placeholder="Chọn đối tượng nhận">
                    <Option value="all_users">Tất cả người dùng (2,430)</Option>
                    <Option value="all_customers">Tất cả khách hàng (1,850)</Option>
                    <Option value="vip_customers">Khách hàng VIP (345)</Option>
                    <Option value="new_customers">Khách hàng mới (156)</Option>
                    <Option value="affected_users">Người dùng được chỉ định</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Thời gian gửi"
                  name="sendAt"
                  tooltip="Để trống nếu gửi ngay lập tức"
                >
                  <DatePicker 
                    showTime 
                    placeholder="Chọn thời gian gửi"
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY HH:mm"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
            >
              <TextArea 
                rows={5} 
                placeholder="Nhập nội dung thông báo..."
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ borderRadius: '6px' }}
                >
                  {editingNotification ? 'Cập nhật' : 'Tạo thông báo'}
                </Button>
                <Button
                  onClick={() => setIsModalVisible(false)}
                  style={{ borderRadius: '6px' }}
                >
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Modal */}
        <Modal
          title="Chi tiết thông báo"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={600}
        >
          {viewingNotification && (
            <div style={{ padding: '20px 0' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                  {getTypeIcon(viewingNotification.type)}
                </div>
                <Title level={4} style={{ color: '#111827', margin: 0 }}>
                  {viewingNotification.title}
                </Title>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Space wrap>
                  {getTypeTag(viewingNotification.type)}
                  {getPriorityTag(viewingNotification.priority)}
                  {getStatusTag(viewingNotification.status)}
                </Space>
              </div>

              <div style={{ 
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                lineHeight: '1.6',
                color: '#374151'
              }}>
                {viewingNotification.content}
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" style={{ backgroundColor: '#f0f9ff' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>
                        {viewingNotification.readCount}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>Đã đọc</div>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ backgroundColor: '#f0fdf4' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                        {viewingNotification.totalRecipients}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>Tổng số nhận</div>
                    </div>
                  </Card>
                </Col>
              </Row>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Người tạo:</Text> {viewingNotification.createdBy}
                  </div>
                  <div>
                    <Text strong>Ngày tạo:</Text> {dayjs(viewingNotification.createdAt).format('DD/MM/YYYY HH:mm')}
                  </div>
                  {viewingNotification.sendAt && (
                    <div>
                      <Text strong>Thời gian gửi:</Text> {dayjs(viewingNotification.sendAt).format('DD/MM/YYYY HH:mm')}
                    </div>
                  )}
                </Space>
              </div>
            </div>
          )}
        </Modal>
      </Space>
    </motion.div>
  );
};

export default Notifications; 