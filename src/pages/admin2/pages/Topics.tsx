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
  Popconfirm,
  Row,
  Col,
  Statistic,
  ColorPicker,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BulbOutlined,
  FileTextOutlined,
  BookOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface TopicType {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  status: 'active' | 'inactive';
  parentId?: string;
  parentName?: string;
  postCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const Topics: React.FC = () => {
  const [topics, setTopics] = useState<TopicType[]>([
    {
      id: '1',
      name: 'Thời trang nam',
      slug: 'thoi-trang-nam',
      description: 'Các chủ đề liên quan đến thời trang nam giới',
      color: '#3b82f6',
      status: 'active',
      postCount: 25,
      order: 1,
      createdAt: '2024-01-15',
      updatedAt: '2024-12-01',
    },
    {
      id: '2',
      name: 'Thời trang nữ',
      slug: 'thoi-trang-nu',
      description: 'Các chủ đề liên quan đến thời trang nữ giới',
      color: '#ec4899',
      status: 'active',
      postCount: 45,
      order: 2,
      createdAt: '2024-01-15',
      updatedAt: '2024-12-01',
    },
    {
      id: '3',
      name: 'Xu hướng 2024',
      slug: 'xu-huong-2024',
      description: 'Những xu hướng thời trang nổi bật trong năm 2024',
      color: '#10b981',
      status: 'active',
      parentId: '1',
      parentName: 'Thời trang nam',
      postCount: 12,
      order: 3,
      createdAt: '2024-02-01',
      updatedAt: '2024-11-30',
    },
    {
      id: '4',
      name: 'Phụ kiện',
      slug: 'phu-kien',
      description: 'Chủ đề về phụ kiện thời trang',
      color: '#f59e0b',
      status: 'active',
      postCount: 18,
      order: 4,
      createdAt: '2024-01-20',
      updatedAt: '2024-12-01',
    },
    {
      id: '5',
      name: 'Giày dép',
      slug: 'giay-dep',
      description: 'Các bài viết về giày dép và footwear',
      color: '#8b5cf6',
      status: 'inactive',
      parentId: '4',
      parentName: 'Phụ kiện',
      postCount: 8,
      order: 5,
      createdAt: '2024-03-01',
      updatedAt: '2024-11-15',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicType | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingTopic, setViewingTopic] = useState<TopicType | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingTopic(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (topic: TopicType) => {
    setEditingTopic(topic);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...topic,
      color: topic.color,
    });
  };

  const handleView = (topic: TopicType) => {
    setViewingTopic(topic);
    setViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
    message.success('Xóa chủ đề thành công!');
  };

  const handleSubmit = (values: any) => {
    const topicData = {
      ...values,
      id: editingTopic ? editingTopic.id : Date.now().toString(),
      postCount: editingTopic?.postCount || 0,
      createdAt: editingTopic?.createdAt || dayjs().format('YYYY-MM-DD'),
      updatedAt: dayjs().format('YYYY-MM-DD'),
      slug: values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      parentName: values.parentId ? topics.find(t => t.id === values.parentId)?.name : undefined,
    };

    if (editingTopic) {
      setTopics(topics.map(topic => topic.id === editingTopic.id ? topicData : topic));
      message.success('Cập nhật chủ đề thành công!');
    } else {
      setTopics([...topics, topicData]);
      message.success('Thêm chủ đề thành công!');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: 'Hoạt động' },
      inactive: { color: 'red', text: 'Không hoạt động' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ColumnsType<TopicType> = [
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div
          style={{
            width: 40,
            height: 40,
            backgroundColor: color,
            borderRadius: '50%',
            border: '2px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TagOutlined style={{ color: 'white', fontSize: '16px' }} />
        </div>
      ),
    },
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TopicType) => (
        <div>
          <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            {record.parentName && (
              <span style={{ color: '#6b7280', fontSize: '12px' }}>
                {record.parentName} / 
              </span>
            )}
            {name}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 150,
      render: (slug: string) => (
        <code style={{ 
          background: '#f3f4f6', 
          padding: '2px 6px', 
          borderRadius: '4px',
          fontSize: '12px',
          color: '#374151'
        }}>
          {slug}
        </code>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Số bài viết',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 100,
      render: (count: number) => (
        <Tag color="blue">{count}</Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (order: number) => (
        <span style={{ color: '#6b7280' }}>{order}</span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => (
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {dayjs(date).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record: TopicType) => (
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
          <Popconfirm
            title="Xóa chủ đề"
            description="Bạn có chắc chắn muốn xóa chủ đề này?"
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
    total: topics.length,
    active: topics.filter(t => t.status === 'active').length,
    inactive: topics.filter(t => t.status === 'inactive').length,
    totalPosts: topics.reduce((sum, t) => sum + t.postCount, 0),
  };

  // Get parent topics for dropdown
  const parentTopics = topics.filter(topic => !topic.parentId);

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
                title="Tổng chủ đề"
                value={stats.total}
                prefix={<BulbOutlined style={{ color: '#3b82f6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Đang hoạt động"
                value={stats.active}
                prefix={<TagOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Không hoạt động"
                value={stats.inactive}
                prefix={<EditOutlined style={{ color: '#ef4444' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Tổng bài viết"
                value={stats.totalPosts}
                prefix={<FileTextOutlined style={{ color: '#8b5cf6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Topics Table */}
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Danh sách chủ đề
              </span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{ borderRadius: '6px' }}
              >
                Thêm chủ đề
              </Button>
            </div>
          }
          style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        >
          <Table
            columns={columns}
            dataSource={topics}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chủ đề`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingTopic ? 'Chỉnh sửa chủ đề' : 'Thêm chủ đề mới'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: '20px' }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Tên chủ đề"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chủ đề!' }]}
                >
                  <Input placeholder="Nhập tên chủ đề" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Chủ đề cha"
                  name="parentId"
                >
                  <Select placeholder="Chọn chủ đề cha (nếu có)" allowClear>
                    {parentTopics.map(topic => (
                      <Option key={topic.id} value={topic.id}>
                        {topic.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Không hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Màu sắc"
                  name="color"
                  rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
                >
                  <ColorPicker 
                    showText 
                    style={{ width: '100%' }}
                    presets={[
                      { label: 'Blue', colors: ['#3b82f6', '#1d4ed8'] },
                      { label: 'Green', colors: ['#10b981', '#059669'] },
                      { label: 'Pink', colors: ['#ec4899', '#db2777'] },
                      { label: 'Purple', colors: ['#8b5cf6', '#7c3aed'] },
                      { label: 'Orange', colors: ['#f59e0b', '#d97706'] },
                      { label: 'Red', colors: ['#ef4444', '#dc2626'] },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Thứ tự hiển thị"
                  name="order"
                  rules={[{ required: true, message: 'Vui lòng nhập thứ tự!' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={100} 
                    placeholder="Thứ tự"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea rows={3} placeholder="Nhập mô tả chủ đề" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ borderRadius: '6px' }}
                >
                  {editingTopic ? 'Cập nhật' : 'Thêm mới'}
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
          title="Chi tiết chủ đề"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={600}
        >
          {viewingTopic && (
            <div style={{ padding: '20px 0' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: viewingTopic.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    border: '4px solid #f3f4f6',
                  }}
                >
                  <BulbOutlined style={{ color: 'white', fontSize: '32px' }} />
                </div>
                <h2 style={{ color: '#111827', margin: 0 }}>{viewingTopic.name}</h2>
                {viewingTopic.parentName && (
                  <div style={{ color: '#6b7280', marginTop: '8px' }}>
                    Thuộc: {viewingTopic.parentName}
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Space wrap>
                  {getStatusTag(viewingTopic.status)}
                  <Tag color="blue">{viewingTopic.postCount} bài viết</Tag>
                  <Tag color="green">Thứ tự: {viewingTopic.order}</Tag>
                </Space>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#111827' }}>Slug:</strong>
                <code style={{ 
                  background: '#f3f4f6', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  marginLeft: '8px',
                  color: '#374151'
                }}>
                  {viewingTopic.slug}
                </code>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#111827' }}>Mô tả:</strong>
                <p style={{ color: '#6b7280', marginTop: '8px', lineHeight: '1.6' }}>
                  {viewingTopic.description}
                </p>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>Ngày tạo</div>
                      <div style={{ color: '#111827', fontWeight: '500' }}>
                        {dayjs(viewingTopic.createdAt).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#6b7280', fontSize: '12px' }}>Cập nhật lần cuối</div>
                      <div style={{ color: '#111827', fontWeight: '500' }}>
                        {dayjs(viewingTopic.updatedAt).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal>
      </Space>
    </motion.div>
  );
};

export default Topics; 