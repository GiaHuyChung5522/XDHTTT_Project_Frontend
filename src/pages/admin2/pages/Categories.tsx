import React, { useState } from 'react';
import {
  Card, Table, Button, Space, Typography, Modal, Form, Input, Select,
  Switch, Tag, /* Avatar, */ Popconfirm, Row, Col, Statistic, message, Image,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  AppstoreOutlined, TagOutlined, ShopOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';

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

// Mock data: DANH MỤC LAPTOP
const mockCategories: Category[] = [
  {
    key: '1',
    id: 'cat-001',
    name: 'Laptop',
    slug: 'laptop',
    description: 'Tất cả các dòng laptop',
    image: ph('Laptop'),
    productCount: 420,
    status: 'active',
    sortOrder: 1,
    createdAt: '2024-01-15',
    updatedAt: '2025-08-20',
  },
  {
    key: '2',
    id: 'cat-002',
    name: 'Laptop Gaming',
    slug: 'laptop-gaming',
    description: 'Laptop chơi game hiệu năng cao (RTX, màn 144/240Hz)',
    image: ph('Gaming'),
    parentId: 'cat-001',
    parentName: 'Laptop',
    productCount: 155,
    status: 'active',
    sortOrder: 2,
    createdAt: '2024-01-20',
    updatedAt: '2025-08-19',
  },
  {
    key: '3',
    id: 'cat-003',
    name: 'Ultrabook',
    slug: 'ultrabook',
    description: 'Mỏng nhẹ, pin trâu, làm việc văn phòng',
    image: ph('Ultra'),
    parentId: 'cat-001',
    parentName: 'Laptop',
    productCount: 180,
    status: 'active',
    sortOrder: 3,
    createdAt: '2024-01-25',
    updatedAt: '2025-08-18',
  },
  {
    key: '4',
    id: 'cat-004',
    name: 'Màn hình',
    slug: 'man-hinh',
    description: 'Màn hình rời cho làm việc và gaming',
    image: ph('Monitor'),
    productCount: 96,
    status: 'active',
    sortOrder: 4,
    createdAt: '2024-02-01',
    updatedAt: '2025-08-17',
  },
  {
    key: '5',
    id: 'cat-005',
    name: 'Phụ kiện',
    slug: 'phu-kien',
    description: 'Chuột, bàn phím, tai nghe, balo, đế tản nhiệt,…',
    image: ph('Accessory'),
    productCount: 210,
    status: 'inactive',
    sortOrder: 5,
    createdAt: '2024-02-05',
    updatedAt: '2025-08-16',
  },
];

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

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

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    message.success('Xóa danh mục thành công!');
  };

  const handleSubmit = (values: any) => {
    const baseName = values.name?.trim() || 'Danh mục';
    const newSlug = values.slug?.trim() || toSlug(baseName);

    const newCategory: Category = {
      key: editingCategory ? editingCategory.key : String(categories.length + 1),
      id: editingCategory ? editingCategory.id : `cat-${String(categories.length + 1).padStart(3, '0')}`,
      name: baseName,
      slug: newSlug,
      description: values.description || '',
      image: ph(baseName), // ảnh placeholder Unicode OK
      parentId: values.parentId,
      parentName: values.parentId ? categories.find(c => c.id === values.parentId)?.name : undefined,
      productCount: editingCategory ? editingCategory.productCount : 0,
      status: values.status ? 'active' : 'inactive',
      sortOrder: values.sortOrder || 1,
      createdAt: editingCategory ? editingCategory.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (editingCategory) {
      setCategories(categories.map(cat => (cat.id === editingCategory.id ? newCategory : cat)));
      message.success('Cập nhật danh mục thành công!');
    } else {
      setCategories([...categories, newCategory]);
      message.success('Thêm danh mục thành công!');
    }

    setModalVisible(false);
    form.resetFields();
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
                <Button type="primary" htmlType="submit">
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
    </motion.div>
  );
};

export default Categories;
