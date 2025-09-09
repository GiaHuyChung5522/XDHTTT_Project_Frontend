import React, { useState, useEffect } from 'react';
import { initializeLocalStorageData, getSafeString, getSafeNumber, getSafeArray } from '../../../utils/initData';
import { adminService } from '../../../services/adminService';
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
  Pagination,
  Spin,
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
  image?: string;
  imageUrl?: string;
  description: string;
  createdAt: string;
  brand?: string;
}

// Function to get real products from localStorage
const getRealProducts = (): Product[] => {
  try {
    const products = localStorage.getItem('products');
    const productData = products ? JSON.parse(products) : [];
    
    return productData.map((product: any, index: number) => ({
      key: getSafeString(product.id) || index.toString(),
      id: getSafeString(product.id) || index.toString(),
      name: getSafeString(product.name) || 'Sản phẩm không tên',
      category: getSafeString(product.category) || 'Không phân loại',
      price: getSafeNumber(product.price),
      salePrice: getSafeNumber(product.salePrice),
      stock: getSafeNumber(product.stock),
      status: getSafeNumber(product.stock) > 0 ? 'active' : 'out_of_stock',
      image: getSafeString(product.imageUrl || product.image) || 'https://via.placeholder.com/100x100?text=No+Image',
      description: getSafeString(product.description) || 'Không có mô tả',
      createdAt: getSafeString(product.createdAt) || new Date().toISOString(),
    }));
  } catch (error) {
    return [];
  }
};

// Mock data (fallback)
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    status: '',
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Load products from API
  const loadProducts = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await adminService.getProducts({
        page,
        limit: pageSize,
        q: filters.search,
        category: filters.category,
        brand: filters.brand,
      });

      if (result.success) {
        console.log('🔍 Raw products data from backend:', result.data.products);
        
        // Transform backend data to match our Product interface
        const transformedProducts = result.data.products.map((product: any, index: number) => {
          console.log(`📦 Product ${index}:`, {
            id: product._id || product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            image: product.image,
            category: product.categories || product.category,
            brand: product.brand
          });
          
          return {
            key: product._id || product.id || index.toString(),
            id: product._id || product.id || index.toString(),
            name: product.name || 'Sản phẩm không tên',
            category: product.categories || product.category || 'Không phân loại',
            price: product.price || 0,
            salePrice: product.salePrice,
            stock: product.stock || 0,
            status: product.stock > 0 ? 'active' : 'out_of_stock',
            image: product.imageUrl || product.image || 'https://via.placeholder.com/100x100?text=No+Image',
            imageUrl: product.imageUrl || product.image,
            description: product.description || 'Không có mô tả',
            createdAt: product.createdAt || new Date().toISOString(),
            brand: product.brand || '',
          };
        });
        
        console.log('✅ Transformed products:', transformedProducts);
        
        setProducts(transformedProducts);
        setPagination({
          current: result.data.pagination.page,
          pageSize: result.data.pagination.limit,
          total: result.data.pagination.total,
        });
      } else {
        message.error('Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      message.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Load categories and brands
  const loadCategoriesAndBrands = async () => {
    try {
      const [categoriesResult, brandsResult] = await Promise.all([
        adminService.getProductCategories(),
        adminService.getProductBrands(),
      ]);

      if (categoriesResult.success) {
        const categoriesData = categoriesResult.data || [];
        // Handle both array of strings and array of objects
        const categoryNames = Array.isArray(categoriesData) 
          ? categoriesData.map(cat => typeof cat === 'string' ? cat : (cat.name || String(cat)))
          : [];
        setCategories(categoryNames.filter((cat): cat is string => typeof cat === 'string'));
      }
      if (brandsResult.success) {
        const brandsData = brandsResult.data || [];
        // Handle both array of strings and array of objects
        const brandNames = Array.isArray(brandsData) 
          ? brandsData.map(brand => typeof brand === 'string' ? brand : (brand.name || String(brand)))
          : [];
        setBrands(brandNames.filter((brand): brand is string => typeof brand === 'string'));
      }
    } catch (error) {
      console.error('Error loading categories/brands:', error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategoriesAndBrands();
  }, []);

  useEffect(() => {
    loadProducts(pagination.current, pagination.pageSize);
  }, [filters]);

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

  const handleDeleteProduct = async (productId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          const result = await adminService.deleteProduct(productId);
          if (result.success) {
            message.success('Đã xóa sản phẩm thành công');
            loadProducts(pagination.current, pagination.pageSize);
          } else {
            message.error('Không thể xóa sản phẩm');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          message.error('Lỗi khi xóa sản phẩm');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      let result;
      if (editingProduct) {
        result = await adminService.updateProduct(editingProduct.id, values);
      } else {
        result = await adminService.createProduct(values);
      }

      if (result.success) {
        message.success(editingProduct ? 'Đã cập nhật sản phẩm thành công' : 'Đã thêm sản phẩm thành công');
        setIsModalVisible(false);
        loadProducts(pagination.current, pagination.pageSize);
      } else {
        message.error('Không thể lưu sản phẩm');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('Lỗi khi lưu sản phẩm');
    }
  };

  const handleTableChange = (pagination: any) => {
    loadProducts(pagination.current, pagination.pageSize);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      render: (image: string, record: Product) => {
        const imageUrl = image || record.imageUrl || 'https://via.placeholder.com/100x100?text=No+Image';
        return (
          <Image
            src={imageUrl}
            alt="Product"
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="https://via.placeholder.com/100x100?text=No+Image"
            onError={(e) => {
              console.log('Image load error:', imageUrl);
              e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image';
            }}
          />
        );
      },
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
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Chọn danh mục"
                style={{ width: '100%' }}
                allowClear
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Chọn thương hiệu"
                style={{ width: '100%' }}
                allowClear
                value={filters.brand}
                onChange={(value) => handleFilterChange('brand', value)}
              >
                {brands.map(brand => (
                  <Option key={brand} value={brand}>{brand}</Option>
                ))}
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

          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={products}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} sản phẩm`,
                onChange: handleTableChange,
              }}
              scroll={{ x: 800 }}
            />
          </Spin>
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
                    {categories.map(category => (
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