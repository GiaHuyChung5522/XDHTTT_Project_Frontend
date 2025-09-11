import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Alert,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { Option } = Select;

// Enhanced Product interface with better type safety
interface Product {
  key: string;
  id: string;
  name: string;
  category: string;
  categories?: string; // For form compatibility
  price: number;
  salePrice?: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image?: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  brand: string;
  model: string;
  isActive: boolean;
  isOnPromotion: boolean;
}

// Form data interface for better type safety
interface ProductFormData {
  name: string;
  categories: string;
  brand: string;
  model: string;
  price: number;
  salePrice?: number;
  stock: number;
  description?: string;
  isActive: boolean;
  isOnPromotion: boolean;
  status: string;
  image?: {
    fileList: UploadFile[];
  };
}

// API response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const Products: React.FC = () => {
  // State management with better organization
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm<ProductFormData>();
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    searchText: '',
    selectedBrand: '',
    selectedCategory: '',
  });
  
  // Error handling state
  const [error, setError] = useState<string | null>(null);

  // Utility function to transform API product data
  const transformProductData = useCallback((product: any): Product => {
    console.log('🔄 Transforming product:', product);
    
    return {
      key: product._id || product.id || Math.random().toString(),
      id: product._id || product.id || Math.random().toString(),
      name: getSafeString(product.name) || 'Sản phẩm không tên',
      category: getSafeString(product.category || product.categories) || 'Không phân loại',
      price: getSafeNumber(product.price) || 0,
      salePrice: product.salePrice ? getSafeNumber(product.salePrice) : undefined,
      stock: getSafeNumber(product.stock) || 0,
      status: product.status || 'active',
      image: product.image,
      imageUrl: product.imageUrl,
      description: getSafeString(product.description) || 'Không có mô tả',
      createdAt: product.createdAt || new Date().toISOString(),
      brand: getSafeString(product.brand) || 'Không xác định',
      model: getSafeString(product.model) || 'Không xác định',
      isActive: product.isActive !== undefined ? Boolean(product.isActive) : true,
      isOnPromotion: product.isOnPromotion !== undefined ? Boolean(product.isOnPromotion) : false,
    };
  }, []);

  // Enhanced load products function with better error handling
  const loadProducts = useCallback(async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading products...');
      const result = await adminService.getProducts({
        page: page,
        limit: pageSize,
        brand: filters.selectedBrand,
        category: filters.selectedCategory,
        q: filters.searchText
      });
      
      if (result.success && result.data) {
        console.log('📦 Raw API response:', result.data);
        
        // Handle different response structures
        let productsArray = [];
        const responseData = result.data as any;
        
        if (Array.isArray(responseData)) {
          productsArray = responseData;
        } else if (responseData.products && Array.isArray(responseData.products)) {
          productsArray = responseData.products;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          productsArray = responseData.data;
        } else {
          console.warn('⚠️ Unexpected data structure:', responseData);
          productsArray = [];
        }
        
        const transformedProducts = productsArray.map(transformProductData);
        
        setProducts(transformedProducts);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize,
          total: transformedProducts.length,
        }));
        
        console.log(`✅ Loaded ${transformedProducts.length} products`);
        
        // If no products loaded, show mock data as fallback
        if (transformedProducts.length === 0) {
          console.log('⚠️ No products from API, using mock data');
          const mockProducts = [
            {
              key: 'mock-1',
              id: 'mock-1',
              name: 'Laptop Gaming ASUS ROG',
              category: 'Laptop gaming',
              price: 25000000,
              stock: 15,
              status: 'active' as const,
              imageUrl: 'https://via.placeholder.com/100x100?text=ASUS+ROG',
              description: 'Laptop gaming cao cấp',
              createdAt: new Date().toISOString(),
              brand: 'Asus',
              model: 'ROG Strix',
              isActive: true,
              isOnPromotion: false,
            },
            {
              key: 'mock-2',
              id: 'mock-2',
              name: 'Laptop Văn phòng Dell',
              category: 'Laptop văn phòng',
              price: 15000000,
              stock: 8,
              status: 'active' as const,
              imageUrl: 'https://via.placeholder.com/100x100?text=Dell',
              description: 'Laptop văn phòng chuyên nghiệp',
              createdAt: new Date().toISOString(),
              brand: 'Dell',
              model: 'Inspiron',
              isActive: true,
              isOnPromotion: true,
            }
          ];
          setProducts(mockProducts);
          setPagination(prev => ({
            ...prev,
            current: page,
            pageSize,
            total: mockProducts.length,
          }));
          console.log(`✅ Using ${mockProducts.length} mock products`);
        }
      } else {
        const errorMsg = (result as any).error || 'Unknown error occurred';
        console.error('❌ Failed to load products:', errorMsg);
        setError(`Không thể tải danh sách sản phẩm: ${errorMsg}`);
        message.error('Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error loading products:', errorMsg);
      setError(`Lỗi khi tải danh sách sản phẩm: ${errorMsg}`);
      message.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [transformProductData, filters]);

  // Enhanced edit product function with better data mapping
  const handleEditProduct = useCallback((product: Product) => {
    console.log('✏️ Editing product:', product);
    
    setEditingProduct(product);
    setError(null);
    
    // Create form data with proper type safety
    const formData: ProductFormData = {
      name: product.name,
      categories: product.category, // Map category to categories for form
      brand: product.brand,
      model: product.model || '',
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
      description: product.description || '',
      status: product.status,
      isActive: product.isActive,
      isOnPromotion: product.isOnPromotion,
      // Set current image for editing with proper UploadFile format
      image: (product.imageUrl || product.image) ? {
        fileList: [{
          uid: `existing-${product.id}`,
          name: 'current-image.jpg',
          status: 'done' as const,
          url: product.imageUrl || product.image,
          thumbUrl: product.imageUrl || product.image,
        }]
      } : undefined,
    };
    
    form.setFieldsValue(formData);
    setIsModalVisible(true);
  }, [form]);

  // Utility function to create FormData for file upload
  const createFormDataForUpload = useCallback((productData: any, imageFiles: UploadFile[]) => {
    const formData = new FormData();
    
    // Add all product fields as strings (FormData requires strings)
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    
    // Add only NEW image files (not existing ones)
    imageFiles.forEach((file) => {
      if (file.originFileObj && !file.url) {
        formData.append('imageUrl', file.originFileObj);
      }
    });
    
    return formData;
  }, []);

  // Enhanced submit handler with better error handling and type safety
  const handleSubmit = useCallback(async (values: ProductFormData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      console.log('📝 Form values:', values);
      
      // Transform form data to match Backend API format with validation
      const productData = {
        name: values.name?.trim(),
        categories: values.categories,
        brand: values.brand,
        model: values.model?.trim() || '',
        price: Number(values.price),
        salePrice: values.salePrice ? Number(values.salePrice) : null,
        stock: Number(values.stock),
        description: values.description?.trim() || '',
        isActive: Boolean(values.isActive),
        isOnPromotion: Boolean(values.isOnPromotion),
        status: values.status || 'active'
      };

      // Validate required fields
      if (!productData.name || !productData.brand || !productData.categories) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      if (productData.price <= 0 || productData.stock < 0) {
        throw new Error('Giá và số lượng phải lớn hơn 0');
      }

      console.log('📦 Sending product data to backend:', productData);

      // Check if there are NEW images to upload
      const hasNewImages = values.image?.fileList?.some(
        (file) => file.originFileObj && !file.url
      ) || false;

      console.log('🖼️ Image data:', values.image);
      console.log('🆕 Has new images:', hasNewImages);

      let result: ApiResponse;

      if (hasNewImages) {
        // Create FormData for file upload
        const formData = createFormDataForUpload(productData, values.image?.fileList || []);

        console.log('📤 FormData contents:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        if (editingProduct) {
          console.log('🔄 Updating product with image...');
          result = await adminService.updateProductWithImage(editingProduct.id, formData);
        } else {
          console.log('➕ Creating product with image...');
          result = await adminService.createProductWithImage(formData);
        }
      } else {
        // No new image upload, use regular JSON API
        if (editingProduct) {
          console.log('🔄 Updating product without image...');
          result = await adminService.updateProduct(editingProduct.id, productData);
        } else {
          console.log('➕ Creating product without image...');
          result = await adminService.createProduct(productData);
        }
      }

      if (result.success) {
        const successMessage = editingProduct 
          ? 'Đã cập nhật sản phẩm thành công' 
          : 'Đã thêm sản phẩm thành công';
        
        message.success(successMessage);
        setIsModalVisible(false);
        form.resetFields();
        setEditingProduct(null);
        
        // Reload products list
        await loadProducts(pagination.current, pagination.pageSize);
      } else {
        const errorMessage = result.error || 'Không thể lưu sản phẩm';
        setError(errorMessage);
        message.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      console.error('❌ Error submitting form:', errorMessage);
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [editingProduct, pagination, form, createFormDataForUpload, loadProducts]);

  // Enhanced delete product function with better confirmation
  const handleDeleteProduct = useCallback(async (productId: string) => {
    const product = products.find(p => p.id === productId);
    const productName = product?.name || 'sản phẩm này';
    
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>"{productName}"</strong>?</p>
          <Alert
            message="Cảnh báo"
            description="Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn."
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
          />
        </div>
      ),
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          console.log('🗑️ Deleting product:', productId);
          const result = await adminService.deleteProduct(productId);
          
          if (result.success) {
            message.success(`Đã xóa sản phẩm "${productName}" thành công`);
            await loadProducts(pagination.current, pagination.pageSize);
          } else {
            const errorMessage = result.error || 'Không thể xóa sản phẩm';
            setError(errorMessage);
            message.error(errorMessage);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
          console.error('❌ Error deleting product:', errorMessage);
          setError(errorMessage);
          message.error(`Lỗi khi xóa sản phẩm: ${errorMessage}`);
        }
      },
    });
  }, [products, pagination, loadProducts]);

  // Enhanced add product function
  const handleAddProduct = useCallback(() => {
    console.log('➕ Adding new product');
    setEditingProduct(null);
    setError(null);
    form.resetFields();
    setIsModalVisible(true);
  }, [form]);

  // Enhanced cancel function
  const handleCancel = useCallback(() => {
    console.log('❌ Cancelling form');
    setIsModalVisible(false);
    setEditingProduct(null);
    setError(null);
    form.resetFields();
  }, [form]);

  // Enhanced filter handlers with better state management
  const handleSearch = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, searchText: value }));
  }, []);

  const handleBrandFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, selectedBrand: value }));
  }, []);

  const handleCategoryFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, selectedCategory: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ searchText: '', selectedBrand: '', selectedCategory: '' });
  }, []);

  // Enhanced filtering with better performance
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const { searchText, selectedBrand, selectedCategory } = filters;
      
      const matchesSearch = !searchText || 
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
        product.model.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [products, filters]);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reload products when filters change
  useEffect(() => {
    if (filters.searchText || filters.selectedBrand || filters.selectedCategory) {
      loadProducts(1, pagination.pageSize);
    }
  }, [filters, loadProducts, pagination.pageSize]);

  // Clear error when modal opens/closes
  useEffect(() => {
    if (!isModalVisible) {
      setError(null);
    }
  }, [isModalVisible]);

  // Enhanced table columns with better formatting
  const columns: ColumnsType<Product> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'image',
      width: 80,
      render: (imageUrl: string, record: Product) => (
        <Image
          width={50}
          height={50}
          src={imageUrl || record.image}
          alt={record.name}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text: string) => (
        <Text strong style={{ fontSize: '14px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
      render: (brand: string) => (
        <Tag color="blue">{brand}</Tag>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color="green">{category}</Tag>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number, record: Product) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>
            {price.toLocaleString('vi-VN')} ₫
          </Text>
          {record.salePrice && (
            <div>
              <Text delete style={{ color: '#999', fontSize: '12px' }}>
                {record.salePrice.toLocaleString('vi-VN')} ₫
              </Text>
            </div>
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
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: 'Hoạt động' },
          inactive: { color: 'red', text: 'Ngừng bán' },
          out_of_stock: { color: 'orange', text: 'Hết hàng' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record: Product) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProduct(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Title level={2} style={{ margin: 0 }}>
            Quản lý sản phẩm
          </Title>
          <Text type="secondary">
            Quản lý danh sách sản phẩm, thêm mới, chỉnh sửa và xóa sản phẩm
          </Text>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* Search and Filter Controls */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={6}>
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                value={filters.searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Select
                placeholder="Chọn thương hiệu"
                value={filters.selectedBrand}
                onChange={handleBrandFilter}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="Acer">Acer</Option>
                <Option value="Asus">Asus</Option>
                <Option value="Msi">Msi</Option>
                <Option value="Dell">Dell</Option>
                <Option value="Apple">Apple</Option>
                <Option value="Hp">Hp</Option>
                <Option value="Lenovo">Lenovo</Option>
                <Option value="Gigabyte">Gigabyte</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Select
                placeholder="Chọn danh mục"
                value={filters.selectedCategory}
                onChange={handleCategoryFilter}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="Laptop văn phòng">Laptop văn phòng</Option>
                <Option value="Laptop gaming">Laptop gaming</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={6}>
              <Space>
                <Button onClick={clearFilters}>Xóa bộ lọc</Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddProduct}
                >
                  Thêm sản phẩm
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Products Table */}
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredProducts}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} sản phẩm`,
              onChange: (page, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || prev.pageSize,
                }));
              },
            }}
            scroll={{ x: 800 }}
            size="middle"
          />
        </Spin>

        {/* Add/Edit Product Modal */}
        <Modal
          title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isActive: true,
              isOnPromotion: false,
              status: 'active',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên sản phẩm"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên sản phẩm' },
                    { min: 2, message: 'Tên sản phẩm phải có ít nhất 2 ký tự' },
                  ]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="brand"
                  label="Thương hiệu"
                  rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
                >
                  <Select placeholder="Chọn thương hiệu">
                    <Option value="Acer">Acer</Option>
                    <Option value="Asus">Asus</Option>
                    <Option value="Msi">Msi</Option>
                    <Option value="Dell">Dell</Option>
                    <Option value="Apple">Apple</Option>
                    <Option value="Hp">Hp</Option>
                    <Option value="Lenovo">Lenovo</Option>
                    <Option value="Gigabyte">Gigabyte</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="categories"
                  label="Danh mục"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                >
                  <Select placeholder="Chọn danh mục">
                    <Option value="Laptop văn phòng">Laptop văn phòng</Option>
                    <Option value="Laptop gaming">Laptop gaming</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="model"
                  label="Model"
                  rules={[{ required: true, message: 'Vui lòng nhập model' }]}
                >
                  <Input placeholder="Nhập model sản phẩm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="price"
                  label="Giá sản phẩm"
                  rules={[
                    { required: true, message: 'Vui lòng nhập giá sản phẩm' },
                    { type: 'number', min: 1, message: 'Giá phải lớn hơn 0' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập giá"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="salePrice"
                  label="Giá khuyến mãi"
                  rules={[
                    { type: 'number', min: 1, message: 'Giá khuyến mãi phải lớn hơn 0' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập giá khuyến mãi"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="stock"
                  label="Số lượng tồn kho"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số lượng tồn kho' },
                    { type: 'number', min: 0, message: 'Số lượng không được âm' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập số lượng"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Mô tả sản phẩm"
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập mô tả sản phẩm"
              />
            </Form.Item>

            <Form.Item
              name="image"
              label="Hình ảnh sản phẩm"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                }}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="isActive"
                  label="Trạng thái hoạt động"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="isOnPromotion"
                  label="Đang khuyến mãi"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                >
                  <Select>
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Ngừng bán</Option>
                    <Option value="out_of_stock">Hết hàng</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={editingProduct ? <EditOutlined /> : <PlusOutlined />}
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Products;