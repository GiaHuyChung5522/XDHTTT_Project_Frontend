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
  Avatar,
  Image,
  DatePicker,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface PostType {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'scheduled';
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  publishDate: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: '1',
      title: 'Xu hướng thời trang Thu Đông 2024',
      slug: 'xu-huong-thoi-trang-thu-dong-2024',
      content: 'Nội dung chi tiết về xu hướng thời trang Thu Đông 2024...',
      excerpt: 'Khám phá những xu hướng thời trang nổi bật trong mùa Thu Đông 2024',
      status: 'published',
      featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      author: 'Nguyễn Văn A',
      category: 'Xu hướng',
      tags: ['thời trang', 'thu đông', '2024'],
      publishDate: '2024-12-01',
      views: 1234,
      likes: 89,
      createdAt: '2024-11-25',
      updatedAt: '2024-12-01',
    },
    {
      id: '2',
      title: 'Cách phối đồ công sở chuyên nghiệp',
      slug: 'cach-phoi-do-cong-so-chuyen-nghiep',
      content: 'Hướng dẫn chi tiết cách phối đồ công sở...',
      excerpt: 'Bí quyết phối đồ công sở thanh lịch và chuyên nghiệp',
      status: 'published',
      featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      author: 'Trần Thị B',
      category: 'Hướng dẫn',
      tags: ['công sở', 'phối đồ', 'chuyên nghiệp'],
      publishDate: '2024-11-28',
      views: 892,
      likes: 67,
      createdAt: '2024-11-20',
      updatedAt: '2024-11-28',
    },
    {
      id: '3',
      title: 'BST mùa hè 2025 - Tự do và năng động',
      slug: 'bst-mua-he-2025-tu-do-va-nang-dong',
      content: 'Giới thiệu bộ sưu tập mùa hè 2025...',
      excerpt: 'Khám phá bộ sưu tập mùa hè 2025 với phong cách tự do và năng động',
      status: 'draft',
      featuredImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
      author: 'Lê Văn C',
      category: 'Bộ sưu tập',
      tags: ['mùa hè', '2025', 'năng động'],
      publishDate: '2025-01-15',
      views: 0,
      likes: 0,
      createdAt: '2024-12-01',
      updatedAt: '2024-12-01',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingPost, setViewingPost] = useState<PostType | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingPost(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (post: PostType) => {
    setEditingPost(post);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...post,
      publishDate: post.publishDate ? dayjs(post.publishDate, 'YYYY-MM-DD') : null,
      tags: post.tags,
    });
  };

  const handleView = (post: PostType) => {
    setViewingPost(post);
    setViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
    message.success('Xóa bài viết thành công!');
  };

  const handleSubmit = (values: any) => {
    const postData = {
      ...values,
      publishDate: values.publishDate ? values.publishDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      id: editingPost ? editingPost.id : Date.now().toString(),
      author: editingPost?.author || 'Admin User',
      views: editingPost?.views || 0,
      likes: editingPost?.likes || 0,
      createdAt: editingPost?.createdAt || dayjs().format('YYYY-MM-DD'),
      updatedAt: dayjs().format('YYYY-MM-DD'),
      slug: (values.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    };

    if (editingPost) {
      setPosts(posts.map(post => post.id === editingPost.id ? postData : post));
      message.success('Cập nhật bài viết thành công!');
    } else {
      setPosts([...posts, postData]);
      message.success('Thêm bài viết thành công!');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      published: { color: 'green', text: 'Đã xuất bản' },
      draft: { color: 'orange', text: 'Bản nháp' },
      scheduled: { color: 'blue', text: 'Đã lên lịch' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ColumnsType<PostType> = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'featuredImage',
      key: 'featuredImage',
      width: 80,
      render: (image: string) => (
        <Image
          src={image}
          alt="Featured"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FmuFHwCDUCgx+AUeAp8CJNQIcAU4Ah4AjwBHgCHAISAJYgEHgBXAdOLJBoMHAkqhRqLXed76W53SdPm86u9+1z1s/qKpX3bXf+/3Wftv9/g="
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: PostType) => (
        <div>
          <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{title}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{record.excerpt}</div>
        </div>
      ),
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      width: 120,
      render: (author: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span style={{ fontSize: '14px' }}>{author}</span>
        </Space>
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      width: 80,
      render: (views: number) => (
        <span style={{ color: '#6b7280' }}>{views.toLocaleString()}</span>
      ),
    },
    {
      title: 'Ngày xuất bản',
      dataIndex: 'publishDate',
      key: 'publishDate',
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
      render: (_, record: PostType) => (
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
            title="Xóa bài viết"
            description="Bạn có chắc chắn muốn xóa bài viết này?"
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
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
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
                title="Tổng bài viết"
                value={stats.total}
                prefix={<FileTextOutlined style={{ color: '#3b82f6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Đã xuất bản"
                value={stats.published}
                prefix={<BookOutlined style={{ color: '#10b981' }} />}
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
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Tổng lượt xem"
                value={stats.totalViews}
                prefix={<EyeOutlined style={{ color: '#8b5cf6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Posts Table */}
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Danh sách bài viết
              </span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{ borderRadius: '6px' }}
              >
                Thêm bài viết
              </Button>
            </div>
          }
          style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        >
          <Table
            columns={columns}
            dataSource={posts}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
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
                  label="Tiêu đề"
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                  <Input placeholder="Nhập tiêu đề bài viết" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Danh mục"
                  name="category"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                  <Select placeholder="Chọn danh mục">
                    <Option value="Xu hướng">Xu hướng</Option>
                    <Option value="Hướng dẫn">Hướng dẫn</Option>
                    <Option value="Bộ sưu tập">Bộ sưu tập</Option>
                    <Option value="Tin tức">Tin tức</Option>
                    <Option value="Khuyến mãi">Khuyến mãi</Option>
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
                  label="Ảnh đại diện"
                  name="featuredImage"
                >
                  <Input placeholder="URL ảnh đại diện" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày xuất bản"
                  name="publishDate"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày xuất bản!' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày xuất bản"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Tóm tắt"
              name="excerpt"
              rules={[{ required: true, message: 'Vui lòng nhập tóm tắt!' }]}
            >
              <TextArea rows={2} placeholder="Nhập tóm tắt bài viết" />
            </Form.Item>

            <Form.Item
              label="Tags"
              name="tags"
            >
              <Select
                mode="tags"
                placeholder="Nhập tags (Enter để thêm)"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
            >
              <TextArea rows={8} placeholder="Nhập nội dung bài viết" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ borderRadius: '6px' }}
                >
                  {editingPost ? 'Cập nhật' : 'Thêm mới'}
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
          title="Chi tiết bài viết"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
        >
          {viewingPost && (
            <div style={{ padding: '20px 0' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Image
                  src={viewingPost.featuredImage}
                  alt={viewingPost.title}
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
              
              <h2 style={{ color: '#111827', marginBottom: '16px' }}>{viewingPost.title}</h2>
              
              <div style={{ marginBottom: '16px' }}>
                <Space wrap>
                  <Space>
                    <UserOutlined style={{ color: '#6b7280' }} />
                    <span style={{ color: '#6b7280' }}>{viewingPost.author}</span>
                  </Space>
                  <Space>
                    <CalendarOutlined style={{ color: '#6b7280' }} />
                    <span style={{ color: '#6b7280' }}>
                      {dayjs(viewingPost.publishDate).format('DD/MM/YYYY')}
                    </span>
                  </Space>
                  <Space>
                    <EyeOutlined style={{ color: '#6b7280' }} />
                    <span style={{ color: '#6b7280' }}>{viewingPost.views} lượt xem</span>
                  </Space>
                  {getStatusTag(viewingPost.status)}
                </Space>
              </div>

              <p style={{ color: '#6b7280', fontSize: '16px', fontStyle: 'italic', marginBottom: '24px' }}>
                {viewingPost.excerpt}
              </p>

              <div style={{ lineHeight: '1.6', color: '#374151' }}>
                {viewingPost.content}
              </div>

              {viewingPost.tags.length > 0 && (
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <Space wrap>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Tags:</span>
                    {viewingPost.tags.map(tag => (
                      <Tag key={tag} color="blue">{tag}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </div>
          )}
        </Modal>
      </Space>
    </motion.div>
  );
};

export default Posts; 