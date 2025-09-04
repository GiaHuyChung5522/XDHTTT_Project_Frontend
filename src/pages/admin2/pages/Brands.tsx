import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Switch,
  Tag,
  Avatar,
  Popconfirm,
  Row,
  Col,
  Statistic,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CrownOutlined,
  ShopOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Brand {
  key: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  website?: string;
  country: string;
  productCount: number;
  status: 'active' | 'inactive';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockBrands: Brand[] = [
  {
    key: '1',
    id: 'brand-001',
    name: 'Louis Vuitton',
    slug: 'louis-vuitton',
    description: 'Thương hiệu xa xỉ nổi tiếng thế giới từ Pháp',
    logo: 'https://via.placeholder.com/60x60?text=LV',
    website: 'https://louisvuitton.com',
    country: 'Pháp',
    productCount: 45,
    status: 'active',
    featured: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-12-09',
  },
  {
    key: '2',
    id: 'brand-002',
    name: 'Gucci',
    slug: 'gucci',
    description: 'Nhà mốt Ý sang trọng và đẳng cấp',
    logo: 'https://via.placeholder.com/60x60?text=GC',
    website: 'https://gucci.com',
    country: 'Ý',
    productCount: 38,
    status: 'active',
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-12-08',
  },
  {
    key: '3',
    id: 'brand-003',
    name: 'Zara',
    slug: 'zara',
    description: 'Thời trang nhanh từ Tây Ban Nha',
    logo: 'https://via.placeholder.com/60x60?text=ZR',
    website: 'https://zara.com',
    country: 'Tây Ban Nha',
    productCount: 156,
    status: 'active',
    featured: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-12-07',
  },
  {
    key: '4',
    id: 'brand-004',
    name: 'H&M',
    slug: 'hm',
    description: 'Thời trang bình dân chất lượng từ Thụy Điển',
    logo: 'https://via.placeholder.com/60x60?text=HM',
    website: 'https://hm.com',
    country: 'Thụy Điển',
    productCount: 89,
    status: 'active',
    featured: false,
    createdAt: '2024-01-25',
    updatedAt: '2024-12-06',
  },
  {
    key: '5',
    id: 'brand-005',
    name: 'Uniqlo',
    slug: 'uniqlo',
    description: 'Thời trang tối giản từ Nhật Bản',
    logo: 'https://via.placeholder.com/60x60?text=UQ',
    website: 'https://uniqlo.com',
    country: 'Nhật Bản',
    productCount: 67,
    status: 'inactive',
    featured: false,
    createdAt: '2024-02-01',
    updatedAt: '2024-12-05',
  },
];

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const handleAddBrand = () => {
    setEditingBrand(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setModalVisible(true);
    form.setFieldsValue({
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      website: brand.website,
      country: brand.country,
      status: brand.status === 'active',
      featured: brand.featured,
    });
  };

  const handleViewBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setViewModalVisible(true);
  };

  const handleDeleteBrand = (brandId: string) => {
    setBrands(brands.filter(brand => brand.id !== brandId));
    message.success('Xóa thương hiệu thành công!');
  };

  const handleSubmit = (values: any) => {
    const newBrand: Brand = {
      key: editingBrand ? editingBrand.key : String(brands.length + 1),
      id: editingBrand ? editingBrand.id : `brand-${String(brands.length + 1).padStart(3, '0')}`,
      name: values.name,
      slug: values.slug || (values.name || '').toLowerCase().replace(/\s+/g, '-'),
      description: values.description || '',
      logo: 'https://via.placeholder.com/60x60?text=' + values.name.slice(0, 2).toUpperCase(),
      website: values.website,
      country: values.country || '',
      productCount: editingBrand ? editingBrand.productCount : 0,
      status: values.status ? 'active' : 'inactive',
      featured: values.featured || false,
      createdAt: editingBrand ? editingBrand.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (editingBrand) {
      setBrands(brands.map(brand => brand.id === editingBrand.id ? newBrand : brand));
      message.success('Cập nhật thương hiệu thành công!');
    } else {
      setBrands([...brands, newBrand]);
      message.success('Thêm thương hiệu thành công!');
    }
    
    setModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<Brand> = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 80,
      render: (logo: string, record: Brand) => (
        <Avatar src={logo} shape="square" size={50} />
      ),
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Brand) => (
        <div>
          <Text strong style={{ color: '#111827', fontSize: '14px' }}>
            {name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.slug}
          </Text>
        </div>
      ),
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      key: 'country',
      render: (country: string) => (
        <Space>
          <GlobalOutlined style={{ color: '#6b7280' }} />
          <Text>{country}</Text>
        </Space>
      ),
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'productCount',
      key: 'productCount',
      align: 'center',
      render: (count: number) => (
        <Text strong style={{ color: '#3b82f6' }}>
          {count}
        </Text>
      ),
    },
    {
      title: 'Nổi bật',
      dataIndex: 'featured',
      key: 'featured',
      align: 'center',
      render: (featured: boolean) => (
        featured ? (
          <Tag color="gold" style={{ borderRadius: '4px' }}>
            <CrownOutlined /> Nổi bật
          </Tag>
        ) : null
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'} style={{ borderRadius: '4px' }}>
          {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string) => (
        website ? (
          <a href={website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
            {website}
          </a>
        ) : (
          <Text type="secondary">Chưa có</Text>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: 150,
      render: (_, record: Brand) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewBrand(record)}
            style={{ color: '#3b82f6' }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditBrand(record)}
            style={{ color: '#10b981' }}
          />
          <Popconfirm
            title="Xóa thương hiệu"
            description="Bạn có chắc chắn muốn xóa thương hiệu này?"
            onConfirm={() => handleDeleteBrand(record.id)}
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

  // Stats
  const totalBrands = brands.length;
  const activeBrands = brands.filter(brand => brand.status === 'active').length;
  const featuredBrands = brands.filter(brand => brand.featured).length;
  const totalProducts = brands.reduce((sum, brand) => sum + brand.productCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Stats */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Tổng thương hiệu"
                value={totalBrands}
                prefix={<CrownOutlined style={{ color: '#3b82f6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Đang hoạt động"
                value={activeBrands}
                prefix={<GlobalOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Thương hiệu nổi bật"
                value={featuredBrands}
                prefix={<CrownOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Tổng sản phẩm"
                value={totalProducts}
                prefix={<ShopOutlined style={{ color: '#8b5cf6' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card
          title={
            <Space>
              <CrownOutlined style={{ color: '#3b82f6' }} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Danh sách thương hiệu
              </span>
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddBrand}
              style={{ borderRadius: '6px' }}
            >
              Thêm thương hiệu
            </Button>
          }
          style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
        >
          <Table
            columns={columns}
            dataSource={brands}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thương hiệu`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
          style={{ borderRadius: '8px' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: '20px' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên thương hiệu"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu!' }]}
                >
                  <Input placeholder="Nhập tên thương hiệu" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Slug"
                  name="slug"
                >
                  <Input placeholder="URL slug (tự động tạo nếu để trống)" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Mô tả"
              name="description"
            >
              <Input.TextArea rows={3} placeholder="Mô tả chi tiết về thương hiệu" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Website"
                  name="website"
                >
                  <Input placeholder="https://example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Quốc gia"
                  name="country"
                  rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
                >
                  <Input placeholder="Nhập quốc gia" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Thương hiệu nổi bật"
                  name="featured"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Nổi bật" unCheckedChildren="Thường" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingBrand ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Modal */}
        <Modal
          title="Chi tiết thương hiệu"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Đóng
            </Button>
          ]}
          width={500}
        >
          {selectedBrand && (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Avatar src={selectedBrand.logo} size={80} shape="square" />
                <Title level={4} style={{ margin: '12px 0 4px', color: '#111827' }}>
                  {selectedBrand.name}
                </Title>
                <Text type="secondary">{selectedBrand.slug}</Text>
              </div>
              
              <div>
                <Text strong>Mô tả: </Text>
                <Text>{selectedBrand.description || 'Chưa có mô tả'}</Text>
              </div>
              
              <div>
                <Text strong>Quốc gia: </Text>
                <Text>{selectedBrand.country}</Text>
              </div>
              
              <div>
                <Text strong>Website: </Text>
                {selectedBrand.website ? (
                  <a href={selectedBrand.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                    {selectedBrand.website}
                  </a>
                ) : (
                  <Text type="secondary">Chưa có</Text>
                )}
              </div>
              
              <div>
                <Text strong>Số sản phẩm: </Text>
                <Text style={{ color: '#3b82f6', fontWeight: '600' }}>
                  {selectedBrand.productCount}
                </Text>
              </div>
              
              <div>
                <Text strong>Thương hiệu nổi bật: </Text>
                {selectedBrand.featured ? (
                  <Tag color="gold">
                    <CrownOutlined /> Nổi bật
                  </Tag>
                ) : (
                  <Text type="secondary">Thường</Text>
                )}
              </div>
              
              <div>
                <Text strong>Trạng thái: </Text>
                <Tag color={selectedBrand.status === 'active' ? 'green' : 'red'}>
                  {selectedBrand.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </Tag>
              </div>
              
              <div>
                <Text strong>Ngày tạo: </Text>
                <Text>{selectedBrand.createdAt}</Text>
              </div>
              
              <div>
                <Text strong>Cập nhật lần cuối: </Text>
                <Text>{selectedBrand.updatedAt}</Text>
              </div>
            </Space>
          )}
        </Modal>
      </Space>
    </motion.div>
  );
};

export default Brands; 