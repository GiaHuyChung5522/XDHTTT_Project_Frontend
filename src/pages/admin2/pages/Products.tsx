import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Image,
  Card,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Form,
  InputNumber,
  Upload,
  Switch,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface Product {
  key: string;
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: string;
  description: string;
  createdAt: string;
}

// Mock data
const mockProducts: Product[] = [
  {
    key: '1',
    id: 'PRD-001',
    name: 'Áo sơ mi nam trắng Premium',
    category: 'Áo sơ mi',
    price: 299000,
    salePrice: 199000,
    stock: 150,
    status: 'active',
    image: 'https://via.placeholder.com/100x100?text=Áo+SM',
    description: 'Áo sơ mi nam chất liệu cotton cao cấp',
    createdAt: '2024-12-01',
  },
  {
    key: '2',
    id: 'PRD-002',
    name: 'Quần jeans nữ skinny',
    category: 'Quần',
    price: 450000,
    stock: 89,
    status: 'active',
    image: 'https://via.placeholder.com/100x100?text=Quần',
    description: 'Quần jeans nữ form skinny thời trang',
    createdAt: '2024-12-02',
  },
  {
    key: '3',
    id: 'PRD-003',
    name: 'Váy dạ hội sang trọng',
    category: 'Váy',
    price: 1200000,
    salePrice: 999000,
    stock: 25,
    status: 'active',
    image: 'https://via.placeholder.com/100x100?text=Váy',
    description: 'Váy dạ hội thiết kế sang trọng cho các sự kiện',
    createdAt: '2024-12-03',
  },
  {
    key: '4',
    id: 'PRD-004',
    name: 'Áo khoác nam mùa đông',
    category: 'Áo khoác',
    price: 650000,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://via.placeholder.com/100x100?text=Áo+K',
    description: 'Áo khoác nam ấm áp cho mùa đông',
    createdAt: '2024-12-04',
  },
  {
    key: '5',
    id: 'PRD-005',
    name: 'Chân váy mini',
    category: 'Váy',
    price: 180000,
    stock: 67,
    status: 'inactive',
    image: 'https://via.placeholder.com/100x100?text=CV',
    description: 'Chân váy mini trẻ trung, năng động',
    createdAt: '2024-12-05',
  },
];

const mockCategories = [
  'Áo sơ mi',
  'Quần',
  'Váy',
  'Áo khoác',
  'Phụ kiện',
  'Giày dép',
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Filter products
  const handleFilter = () => {
    let filtered = products;

    if (searchText) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    setFilteredProducts(filtered);
  };

  React.useEffect(() => {
    handleFilter();
  }, [searchText, selectedCategory, selectedStatus, products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (productId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        setProducts(products.filter(p => p.id !== productId));
        message.success('Đã xóa sản phẩm thành công');
      },
    });
  };

  const handleSubmit = (values: any) => {
    if (editingProduct) {
      // Update product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...values }
          : p
      ));
      message.success('Đã cập nhật sản phẩm thành công');
    } else {
      // Add new product
      const newProduct: Product = {
        ...values,
        key: Date.now().toString(),
        id: `PRD-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        image: 'https://via.placeholder.com/100x100?text=New',
      };
      setProducts([...products, newProduct]);
      message.success('Đã thêm sản phẩm thành công');
    }
    setIsModalVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'orange';
      case 'out_of_stock':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang bán';
      case 'inactive':
        return 'Tạm dừng';
      case 'out_of_stock':
        return 'Hết hàng';
      default:
        return status;
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image: string) => (
        <Image
          src={image}
          alt="Product"
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Mã SP',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Product) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.category}
          </Text>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number, record: Product) => (
        <div>
          {record.salePrice ? (
            <>
              <Text delete type="secondary">₫{price.toLocaleString()}</Text>
              <br />
              <Text strong style={{ color: '#f5222d' }}>₫{record.salePrice.toLocaleString()}</Text>
            </>
          ) : (
            <Text strong>₫{price.toLocaleString()}</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      render: (stock: number) => (
        <Text style={{ color: stock > 20 ? '#52c41a' : stock > 0 ? '#faad14' : '#f5222d' }}>
          {stock}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => message.info('Xem chi tiết sản phẩm')}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditProduct(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDeleteProduct(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* <div>
          <Title level={2}>Quản lý sản phẩm</Title>
          <Text type="secondary">Quản lý toàn bộ sản phẩm trong cửa hàng</Text>
        </div> */}

        <Card>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Chọn danh mục"
                style={{ width: '100%' }}
                allowClear
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                {mockCategories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Chọn trạng thái"
                style={{ width: '100%' }}
                allowClear
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Option value="active">Đang bán</Option>
                <Option value="inactive">Tạm dừng</Option>
                <Option value="out_of_stock">Hết hàng</Option>
              </Select>
            </Col>
            <Col xs={24} sm={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddProduct}
                style={{ width: '100%' }}
              >
                Thêm sản phẩm
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredProducts}
            pagination={{
              total: filteredProducts.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} sản phẩm`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        <Modal
          title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Danh mục"
                  name="category"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                >
                  <Select placeholder="Chọn danh mục">
                    {mockCategories.map(category => (
                      <Option key={category} value={category}>{category}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Giá gốc"
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/₫\s?|(,*)/g, '')}
                    placeholder="Nhập giá sản phẩm"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giá khuyến mãi"
                  name="salePrice"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/₫\s?|(,*)/g, '')}
                    placeholder="Nhập giá khuyến mãi"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số lượng tồn kho"
                  name="stock"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="Nhập số lượng"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="active">Đang bán</Option>
                    <Option value="inactive">Tạm dừng</Option>
                    <Option value="out_of_stock">Hết hàng</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Mô tả sản phẩm"
              name="description"
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập mô tả sản phẩm"
              />
            </Form.Item>

            <Form.Item
              label="Hình ảnh sản phẩm"
              name="image"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  );
};

export default Products; 