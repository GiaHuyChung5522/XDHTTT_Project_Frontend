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
  message,
  Row,
  Col,
  Statistic,
  Avatar,
  Badge,
  List,
  Typography,
  Divider,
  Popconfirm,
} from 'antd';
import {
  MessageOutlined,
  UserOutlined,
  EyeOutlined,
  ReloadOutlined,
  SendOutlined,
  DeleteOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface MessageType {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  content: string;
  status: 'unread' | 'read' | 'replied' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@gmail.com',
      customerPhone: '0901234567',
      subject: 'Hỏi về chính sách đổi trả sản phẩm',
      content: 'Xin chào, tôi muốn hỏi về chính sách đổi trả sản phẩm của shop. Tôi đã mua 1 chiếc áo nhưng size không vừa, có thể đổi được không ạ?',
      status: 'unread',
      priority: 'medium',
      category: 'Chính sách',
      createdAt: '2024-12-09 14:30',
      updatedAt: '2024-12-09 14:30',
    },
    {
      id: '2',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@gmail.com',
      customerPhone: '0912345678',
      subject: 'Khiếu nại về chất lượng sản phẩm',
      content: 'Tôi vừa nhận được đơn hàng #12345 nhưng sản phẩm bị lỗi. Áo bị rách ở phần vai. Mong shop hỗ trợ.',
      status: 'replied',
      priority: 'high',
      category: 'Khiếu nại',
      reply: 'Chúng tôi rất xin lỗi về sự cố này. Shop sẽ đổi sản phẩm mới cho bạn ngay lập tức. Vui lòng cung cấp hình ảnh sản phẩm lỗi.',
      repliedAt: '2024-12-08 10:15',
      repliedBy: 'Admin User',
      createdAt: '2024-12-08 09:30',
      updatedAt: '2024-12-08 10:15',
    },
    {
      id: '3',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@gmail.com',
      subject: 'Tư vấn chọn size áo',
      content: 'Chào shop, tôi cao 1m70, nặng 65kg, nên chọn size nào cho áo polo nam ạ?',
      status: 'read',
      priority: 'low',
      category: 'Tư vấn',
      createdAt: '2024-12-07 16:45',
      updatedAt: '2024-12-07 17:00',
    },
    {
      id: '4',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@gmail.com',
      customerPhone: '0934567890',
      subject: 'Cần hỗ trợ gấp - Đơn hàng chậm trễ',
      content: 'Đơn hàng #67890 của tôi đã 5 ngày rồi mà vẫn chưa nhận được. Ngày mai tôi cần dùng gấp, mong shop kiểm tra giúp.',
      status: 'replied',
      priority: 'urgent',
      category: 'Vận chuyển',
      reply: 'Chúng tôi đã kiểm tra và đơn hàng của bạn đang trong quá trình vận chuyển. Dự kiến sẽ đến trong hôm nay.',
      repliedAt: '2024-12-06 11:30',
      repliedBy: 'Support Team',
      createdAt: '2024-12-06 08:15',
      updatedAt: '2024-12-06 11:30',
    },
  ]);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingMessage, setViewingMessage] = useState<MessageType | null>(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyingMessage, setReplyingMessage] = useState<MessageType | null>(null);
  const [form] = Form.useForm();

  const handleView = (messageRecord: MessageType) => {
    setViewingMessage(messageRecord);
    setViewModalVisible(true);

    // Mark as read if unread
    if (messageRecord.status === 'unread') {
      setMessages(messages.map(msg =>
        msg.id === messageRecord.id
          ? { ...msg, status: 'read', updatedAt: dayjs().format('YYYY-MM-DD HH:mm') }
          : msg
      ));
    }
  };

  const handleReply = (messageRecord: MessageType) => {
    setReplyingMessage(messageRecord);
    setReplyModalVisible(true);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
    message.success('Xóa tin nhắn thành công!');
  };

  const handleSubmitReply = (values: any) => {
    if (!replyingMessage) return;

    const updatedMessage = {
      ...replyingMessage,
      reply: values.reply,
      status: 'replied' as const,
      repliedAt: dayjs().format('YYYY-MM-DD HH:mm'),
      repliedBy: 'Admin User',
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm'),
    };

    setMessages(messages.map(msg =>
      msg.id === replyingMessage.id ? updatedMessage : msg
    ));

    message.success('Gửi phản hồi thành công!');
    setReplyModalVisible(false);
    form.resetFields();
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
      unread: { color: 'red', text: 'Chưa đọc', icon: <ClockCircleOutlined /> },
      read: { color: 'blue', text: 'Đã đọc', icon: <EyeOutlined /> },
      replied: { color: 'green', text: 'Đã trả lời', icon: <CheckOutlined /> },
      closed: { color: 'gray', text: 'Đã đóng', icon: <CheckOutlined /> },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns: ColumnsType<MessageType> = [
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record: MessageType) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px' }} />
            <span style={{ fontWeight: '600', color: '#111827' }}>{record.customerName}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{record.customerEmail}</div>
          {record.customerPhone && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              <PhoneOutlined style={{ marginRight: '4px' }} />
              {record.customerPhone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Tiêu đề & Nội dung',
      key: 'content',
      render: (_, record: MessageType) => (
        <div>
          <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            {record.subject}
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
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
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
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (date: string) => (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {dayjs(date).format('DD/MM/YYYY HH:mm')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record: MessageType) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ color: '#3b82f6' }}
          />
          <Button
            type="text"
            icon={<SendOutlined />}
            onClick={() => handleReply(record)}
            style={{ color: '#10b981' }}
          />
          <Popconfirm
            title="Xóa tin nhắn"
            description="Bạn có chắc chắn muốn xóa tin nhắn này?"
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
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    replied: messages.filter(m => m.status === 'replied').length,
    urgent: messages.filter(m => m.priority === 'urgent').length,
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
                title="Tổng tin nhắn"
                value={stats.total}
                prefix={<MessageOutlined style={{ color: '#3b82f6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Chưa đọc"
                value={stats.unread}
                prefix={<Badge dot style={{ marginRight: '8px' }}><ClockCircleOutlined style={{ color: '#ef4444' }} /></Badge>}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Đã trả lời"
                value={stats.replied}
                prefix={<CheckOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Khẩn cấp"
                value={stats.urgent}
                prefix={<Badge status="error"><ClockCircleOutlined style={{ color: '#f59e0b' }} /></Badge>}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Messages Table */}
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Danh sách tin nhắn
              </span>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => message.success('Đã làm mới danh sách!')}
                style={{ borderRadius: '6px' }}
              >
                Làm mới
              </Button>
            </div>
          }
          style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        >
          <Table
            columns={columns}
            dataSource={messages}
            rowKey="id"
            rowClassName={(record) => record.status === 'unread' ? 'unread-row' : ''}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tin nhắn`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* View Message Modal */}
        <Modal
          title="Chi tiết tin nhắn"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={
            viewingMessage && [
              <Button key="close" onClick={() => setViewModalVisible(false)}>
                Đóng
              </Button>,
              <Button
                key="reply"
                type="primary"
                icon={<SendOutlined />}
                onClick={() => {
                  setViewModalVisible(false);
                  handleReply(viewingMessage);
                }}
                style={{ borderRadius: '6px' }}
              >
                Trả lời
              </Button>,
            ]
          }
          width={700}
        >
          {viewingMessage && (
            <div style={{ padding: '20px 0' }}>
              {/* Customer Info */}
              <Card style={{ marginBottom: '16px', backgroundColor: '#f9fafb' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <div>
                        <UserOutlined style={{ marginRight: '8px', color: '#6b7280' }} />
                        <strong>Khách hàng:</strong> {viewingMessage.customerName}
                      </div>
                      <div>
                        <MailOutlined style={{ marginRight: '8px', color: '#6b7280' }} />
                        <strong>Email:</strong> {viewingMessage.customerEmail}
                      </div>
                      {viewingMessage.customerPhone && (
                        <div>
                          <PhoneOutlined style={{ marginRight: '8px', color: '#6b7280' }} />
                          <strong>Điện thoại:</strong> {viewingMessage.customerPhone}
                        </div>
                      )}
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <div>
                        <strong>Danh mục:</strong> <Tag color="blue">{viewingMessage.category}</Tag>
                      </div>
                      <div>
                        <strong>Độ ưu tiên:</strong> {getPriorityTag(viewingMessage.priority)}
                      </div>
                      <div>
                        <strong>Trạng thái:</strong> {getStatusTag(viewingMessage.status)}
                      </div>
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* Message Content */}
              <div style={{ marginBottom: '16px' }}>
                <Title level={5} style={{ color: '#111827', marginBottom: '8px' }}>
                  {viewingMessage.subject}
                </Title>
                <Text style={{ color: '#6b7280', fontSize: '12px' }}>
                  {dayjs(viewingMessage.createdAt).format('DD/MM/YYYY HH:mm')}
                </Text>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '12px',
                  lineHeight: '1.6',
                  color: '#374151'
                }}>
                  {viewingMessage.content}
                </div>
              </div>

              {/* Reply (if exists) */}
              {viewingMessage.reply && (
                <div>
                  <Divider />
                  <Title level={5} style={{ color: '#111827', marginBottom: '8px' }}>
                    Phản hồi từ {viewingMessage.repliedBy}
                  </Title>
                  <Text style={{ color: '#6b7280', fontSize: '12px' }}>
                    {dayjs(viewingMessage.repliedAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                  <div style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '12px',
                    lineHeight: '1.6',
                    color: '#374151'
                  }}>
                    {viewingMessage.reply}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Reply Modal */}
        <Modal
          title={`Trả lời tin nhắn: ${replyingMessage?.subject}`}
          open={replyModalVisible}
          onCancel={() => setReplyModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitReply}
            style={{ marginTop: '20px' }}
          >
            {replyingMessage && (
              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <Text strong>Tin nhắn gốc:</Text>
                <div style={{ marginTop: '8px', color: '#6b7280' }}>
                  {replyingMessage.content}
                </div>
              </div>
            )}

            <Form.Item
              label="Nội dung phản hồi"
              name="reply"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi!' }]}
            >
              <TextArea
                rows={6}
                placeholder="Nhập nội dung phản hồi cho khách hàng..."
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  style={{ borderRadius: '6px' }}
                >
                  Gửi phản hồi
                </Button>
                <Button
                  onClick={() => setReplyModalVisible(false)}
                  style={{ borderRadius: '6px' }}
                >
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>

      <style>{`
  .unread-row {
    background-color: #fef3cd !important;
  }
  .unread-row:hover {
    background-color: #fef3cd !important;
  }
`}</style>

    </motion.div>
  );
};

export default Messages; 