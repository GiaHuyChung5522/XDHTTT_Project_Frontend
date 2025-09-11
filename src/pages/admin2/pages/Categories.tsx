import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Typography, Modal, Form, Input, Select,
  Switch, Tag, /* Avatar, */ Popconfirm, Row, Col, Statistic, message, Image,
  Spin, Alert,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  AppstoreOutlined, TagOutlined, ShopOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';
import { adminService } from '../../../services/adminService';

const { Title, Text } = Typography;
const { Option } = Select;

interface Category {
  key: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  parentName?: string;
  productCount: number;
  status: 'active' | 'inactive';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Helpers */
// bỏ dấu và tạo slug gọn gàng
const toSlug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// placeholder ảnh an toàn (Unicode OK)
const ph = (text: string) => `https://placehold.co/60x60?text=${encodeURIComponent(text)}`;

// (tuỳ chọn) ảnh fallback đặt trong public/
const FALLBACK_IMG = '/laptop-fallback.png';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Load categories from backend
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading categories from backend...');
      const result = await adminService.getCategories();
      
      if (result.success && result.data) {
        console.log('📦 Categories response:', result.data);
        
        // Transform backend data to frontend format
        const transformedCategories = result.data.map((cat: any, index: number) => ({
          key: cat._id || cat.id || index.toString(),
          id: cat._id || cat.id || index.toString(),
          name: cat.name || 'Unnamed Category',
          slug: cat.slug || toSlug(cat.name || 'category'),
          description: cat.description || '',
          image: cat.imageUrl || ph(cat.name?.charAt(0) || 'C'),
          parentId: cat.parentId || undefined,
          parentName: cat.parentName || undefined,
          productCount: cat.productCount || Math.floor(Math.random() * 50) + 1,
          status: cat.status === 'Hoạt động' ? 'active' : 'inactive',
          sortOrder: cat.sortOrder || index + 1,
          createdAt: cat.createdAt || new Date().toISOString(),
          updatedAt: cat.updatedAt || new Date().toISOString(),
        }));
        
        setCategories(transformedCategories);
        console.log(`✅ Loaded ${transformedCategories.length} categories`);
      } else {
        console.error('❌ Failed to load categories: No data received');
        setError('Không thể tải danh sách danh mục');
        setCategories([]);
      }
    } catch (err) {
      console.error('❌ Error loading categories:', err);
      setError('Không thể tải danh sách danh mục');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setModalVisible(true);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      status: category.status === 'active',
      sortOrder: category.sortOrder,
    });
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setViewModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      console.log('🔄 Deleting category:', categoryId);
      const result = await adminService.deleteCategory(categoryId);
      
      if (result.success) {
        message.success('Xóa danh mục thành công!');
        await loadCategories(); // Reload categories
      } else {
        message.error(`Không thể xóa danh mục: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      message.error('Không thể xóa danh mục');
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const baseName = values.name?.trim() || 'Danh mục';
      const newSlug = values.slug?.trim() || toSlug(baseName);

      const categoryData = {
        name: baseName,
        slug: newSlug,
        description: values.description || '',
        status: values.status ? 'Hoạt động' : 'Không hoạt động',
        sortOrder: values.sortOrder || 1,
      };

      console.log('🔄 Submitting category:', categoryData);

      let result;
      if (editingCategory) {
        result = await adminService.updateCategory(editingCategory.id, categoryData);
      } else {
        result = await adminService.createCategory(categoryData);
      }

      if (result.success) {
        message.success(editingCategory ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục thành công!');
        setModalVisible(false);
        form.resetFields();
        await loadCategories(); // Reload categories
      } else {
        message.error(`Không thể ${editingCategory ? 'cập nhật' : 'tạo'} danh mục: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error submitting category:', error);
      message.error(`Không thể ${editingCategory ? 'cập nhật' : 'tạo'} danh mục`);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image: string) => (
        <Image
          src={image}
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 6, display: 'block' }}
          fallback={FALLBACK_IMG}
          preview={false}
        />
      ),
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Category) => (
        <div>
          <Text strong style={{ color: '#111827', fontSize: 14 }}>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.slug}</Text>
        </div>
      ),
    },
    {
      title: 'Danh mục cha',
      dataIndex: 'parentName',
      key: 'parentName',
      render: (parentName?: string) =>
        parentName ? (
          <Tag color="blue" style={{ borderRadius: 4 }}>{parentName}</Tag>
        ) : (
          <Text type="secondary">Danh mục gốc</Text>
        ),
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'productCount',
      key: 'productCount',
      align: 'center',
      render: (count: number) => <Text strong style={{ color: '#3b82f6' }}>{count}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: Category['status']) => (
        <Tag color={status === 'active' ? 'green' : 'red'} style={{ borderRadius: 4 }}>
          {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => <Text type="secondary">{date}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: 150,
      render: (_, record: Category) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewCategory(record)} style={{ color: '#3b82f6' }} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditCategory(record)} style={{ color: '#10b981' }} />
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" icon={<DeleteOutlined />} style={{ color: '#ef4444' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.status === 'active').length;
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
  const parentCategories = categories.filter(cat => !cat.parentId).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>Đang tải danh mục...</Text>
          </div>
        </div>
      ) : error ? (
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" onClick={loadCategories}>
              Thử lại
            </Button>
          }
        />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Stats */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Tổng danh mục"
                value={totalCategories}
                prefix={<AppstoreOutlined style={{ color: '#3b82f6' }} />}
                valueStyle={{ color: '#111827', fontSize: 24, fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Đang hoạt động"
                value={activeCategories}
                prefix={<TagOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ color: '#111827', fontSize: 24, fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Tổng sản phẩm"
                value={totalProducts}
                prefix={<ShopOutlined style={{ color: '#8b5cf6' }} />}
                valueStyle={{ color: '#111827', fontSize: 24, fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Danh mục gốc"
                value={parentCategories}
                prefix={<AppstoreOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ color: '#111827', fontSize: 24, fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main */}
        <Card
          title={
            <Space>
              <AppstoreOutlined style={{ color: '#3b82f6' }} />
              <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Danh sách danh mục (Laptop)</span>
            </Space>
          }
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory} style={{ borderRadius: 6 }}>
              Thêm danh mục
            </Button>
          }
          style={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
        >
          <Table
            columns={columns}
            dataSource={categories}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} danh mục`,
            }}
            scroll={{ x: 800 }}
            rowKey="id"
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
          style={{ borderRadius: 8 }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên danh mục"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                  <Input placeholder="Ví dụ: Laptop Văn phòng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Slug" name="slug">
                  <Input placeholder="Tự tạo nếu để trống" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={3} placeholder="Mô tả chi tiết (tuỳ chọn)" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Danh mục cha" name="parentId">
                  <Select placeholder="Chọn danh mục cha (tùy chọn)">
                    {categories
                      .filter(cat => !cat.parentId && cat.id !== editingCategory?.id)
                      .map(cat => (
                        <Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thứ tự sắp xếp" name="sortOrder">
                  <Input type="number" placeholder="1" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Trạng thái" name="status" valuePropName="checked">
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Modal */}
        <Modal
          title="Chi tiết danh mục"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>Đóng</Button>]}
          width={500}
        >
          {selectedCategory && (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={selectedCategory.image}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 8, display: 'inline-block' }}
                  fallback={FALLBACK_IMG}
                  preview={false}
                />
                <Title level={4} style={{ margin: '12px 0 4px', color: '#111827' }}>
                  {selectedCategory.name}
                </Title>
                <Text type="secondary">{selectedCategory.slug}</Text>
              </div>

              <div>
                <Text strong>Mô tả: </Text>
                <Text>{selectedCategory.description || 'Chưa có mô tả'}</Text>
              </div>

              <div>
                <Text strong>Danh mục cha: </Text>
                <Text>{selectedCategory.parentName || 'Danh mục gốc'}</Text>
              </div>

              <div>
                <Text strong>Số sản phẩm: </Text>
                <Text style={{ color: '#3b82f6', fontWeight: 600 }}>{selectedCategory.productCount}</Text>
              </div>

              <div>
                <Text strong>Trạng thái: </Text>
                <Tag color={selectedCategory.status === 'active' ? 'green' : 'red'}>
                  {selectedCategory.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </Tag>
              </div>

              <div>
                <Text strong>Ngày tạo: </Text>
                <Text>{selectedCategory.createdAt}</Text>
              </div>

              <div>
                <Text strong>Cập nhật lần cuối: </Text>
                <Text>{selectedCategory.updatedAt}</Text>
              </div>
            </Space>
          )}
        </Modal>
        </Space>
      )}
    </motion.div>
  );
};

export default Categories;
