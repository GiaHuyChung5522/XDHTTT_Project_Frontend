import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Card,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Descriptions,
  Steps,
  Timeline,
  Avatar,
  Divider,
  message,
} from 'antd';
import { initializeLocalStorageData, getSafeString, getSafeNumber, getSafeArray, getSafeObject } from '../../../utils/initData';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  PrinterOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  key: string;
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Function to get real orders from localStorage
const getRealOrders = (): Order[] => {
  try {
    const orders = localStorage.getItem('orders');
    const orderData = orders ? JSON.parse(orders) : [];
    
    return orderData.map((order: any, index: number) => ({
      key: getSafeString(order.orderId) || index.toString(),
      id: getSafeString(order.orderId) || index.toString(),
      customerName: getSafeString(order.customerInfo?.name) || 'Khách hàng',
      customerEmail: getSafeString(order.customerInfo?.email) || 'Chưa có email',
      customerPhone: getSafeString(order.customerInfo?.phone) || 'Chưa có SĐT',
      shippingAddress: getSafeString(order.customerInfo?.address) || 'Chưa có địa chỉ',
      items: getSafeArray(order.items),
      subtotal: getSafeNumber(order.subtotal),
      shipping: getSafeNumber(order.shipping),
      tax: getSafeNumber(order.tax),
      total: getSafeNumber(order.total),
      status: getSafeString(order.status) || 'pending',
      paymentStatus: getSafeString(order.paymentStatus) || 'pending',
      paymentMethod: getSafeString(order.paymentMethod) || 'cash',
      notes: getSafeString(order.notes),
      createdAt: getSafeString(order.createdAt) || new Date().toISOString(),
      updatedAt: getSafeString(order.updatedAt) || new Date().toISOString(),
      timeline: [
        {
          status: 'pending',
          title: 'Đơn hàng được tạo',
          description: 'Đơn hàng đã được tạo và đang chờ xác nhận',
          time: order.createdAt || new Date().toISOString(),
        },
        ...(order.status === 'confirmed' ? [{
          status: 'confirmed',
          title: 'Đơn hàng được xác nhận',
          description: 'Đơn hàng đã được xác nhận và đang chuẩn bị',
          time: order.updatedAt || new Date().toISOString(),
        }] : []),
        ...(order.status === 'shipped' ? [{
          status: 'shipped',
          title: 'Đơn hàng đang giao',
          description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
          time: order.updatedAt || new Date().toISOString(),
        }] : []),
        ...(order.status === 'delivered' ? [{
          status: 'delivered',
          title: 'Đơn hàng đã giao',
          description: 'Đơn hàng đã được giao thành công',
          time: order.updatedAt || new Date().toISOString(),
        }] : []),
      ],
    }));
  } catch (error) {
    return [];
  }
};

// Mock data (fallback)
const mockOrders: Order[] = [
  {
    key: '1',
    id: 'ORD-001',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@email.com',
    customerPhone: '0123456789',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    items: [
      {
        id: 'PRD-001',
        name: 'Áo sơ mi nam trắng Premium',
        image: 'https://via.placeholder.com/50x50?text=Áo',
        price: 199000,
        quantity: 2,
        total: 398000,
      },
      {
        id: 'PRD-002',
        name: 'Quần jeans nữ skinny',
        image: 'https://via.placeholder.com/50x50?text=Quần',
        price: 450000,
        quantity: 1,
        total: 450000,
      },
    ],
    subtotal: 848000,
    shipping: 30000,
    total: 878000,
    status: 'confirmed',
    paymentMethod: 'Chuyển khoản',
    paymentStatus: 'paid',
    createdAt: '2024-12-09 10:30',
    updatedAt: '2024-12-09 11:00',
    notes: 'Giao hàng giờ hành chính',
  },
  {
    key: '2',
    id: 'ORD-002',
    customerName: 'Trần Thị B',
    customerEmail: 'tranthib@email.com',
    customerPhone: '0987654321',
    shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
    items: [
      {
        id: 'PRD-003',
        name: 'Váy dạ hội sang trọng',
        image: 'https://via.placeholder.com/50x50?text=Váy',
        price: 999000,
        quantity: 1,
        total: 999000,
      },
    ],
    subtotal: 999000,
    shipping: 50000,
    total: 1049000,
    status: 'shipping',
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    createdAt: '2024-12-08 14:20',
    updatedAt: '2024-12-09 09:15',
  },
  {
    key: '3',
    id: 'ORD-003',
    customerName: 'Lê Văn C',
    customerEmail: 'levanc@email.com',
    customerPhone: '0369852147',
    shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
    items: [
      {
        id: 'PRD-004',
        name: 'Áo khoác nam mùa đông',
        image: 'https://via.placeholder.com/50x50?text=Áo',
        price: 650000,
        quantity: 1,
        total: 650000,
      },
    ],
    subtotal: 650000,
    shipping: 30000,
    total: 680000,
    status: 'pending',
    paymentMethod: 'Chuyển khoản',
    paymentStatus: 'pending',
    createdAt: '2024-12-09 16:45',
    updatedAt: '2024-12-09 16:45',
  },
  {
    key: '4',
    id: 'ORD-004',
    customerName: 'Phạm Thị D',
    customerEmail: 'phamthid@email.com',
    customerPhone: '0741852963',
    shippingAddress: '321 Đường GHI, Quận 4, TP.HCM',
    items: [
      {
        id: 'PRD-005',
        name: 'Chân váy mini',
        image: 'https://via.placeholder.com/50x50?text=CV',
        price: 180000,
        quantity: 3,
        total: 540000,
      },
    ],
    subtotal: 540000,
    shipping: 30000,
    total: 570000,
    status: 'delivered',
    paymentMethod: 'COD',
    paymentStatus: 'paid',
    createdAt: '2024-12-07 11:20',
    updatedAt: '2024-12-08 17:30',
    notes: 'Khách hàng hài lòng với sản phẩm',
  },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const realOrders = getRealOrders();
    return realOrders.length > 0 ? realOrders : mockOrders;
  });

  useEffect(() => {
    // Initialize localStorage data on component mount
    initializeLocalStorageData();
  }, []);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  // Load orders from localStorage
  const loadOrders = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedOrders = localStorage.getItem('orders');
      const allOrders = savedOrders ? JSON.parse(savedOrders) : mockOrders;
      
      // Convert to proper format
      const formattedOrders = allOrders.map((order: any, index: number) => ({
        key: index.toString(),
        id: order.orderId || order.id,
        customerName: order.customerInfo?.name || order.customerName || 'Khách hàng',
        customerEmail: order.customerInfo?.email || order.customerEmail || 'N/A',
        customerPhone: order.customerInfo?.phone || order.customerPhone || 'N/A',
        shippingAddress: order.customerInfo?.address || order.shippingAddress || 'N/A',
        items: order.items || [],
        subtotal: order.subtotal || 0,
        shippingFee: order.shippingFee || 0,
        total: order.total || 0,
        paymentMethod: order.paymentMethod || 'cash',
        paymentStatus: order.paymentStatus || (order.paymentMethod === 'cash' ? 'pending' : 'paid'),
        status: order.status || 'pending',
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: order.updatedAt || new Date().toISOString(),
        notes: order.customerInfo?.note || order.notes || '',
        paymentDetails: order.paymentDetails || null
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const handleFilter = () => {
    let filtered = orders;

    if (searchText) {
      filtered = filtered.filter(order =>
        getSafeString(order.id).toLowerCase().includes(searchText.toLowerCase()) ||
        getSafeString(order.customerName).toLowerCase().includes(searchText.toLowerCase()) ||
        getSafeString(order.customerEmail).toLowerCase().includes(searchText.toLowerCase()) ||
        getSafeString(order.customerPhone).includes(searchText)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (selectedPaymentStatus) {
      filtered = filtered.filter(order => order.paymentStatus === selectedPaymentStatus);
    }

    setFilteredOrders(filtered);
  };

  React.useEffect(() => {
    loadOrders();
  }, []);

  React.useEffect(() => {
    handleFilter();
  }, [searchText, selectedStatus, selectedPaymentStatus, orders]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
          : order
      );
      
      setOrders(updatedOrders);
      
      // Update localStorage
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders);
        const updatedAllOrders = allOrders.map((order: any) =>
          (order.orderId || order.id) === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        );
        localStorage.setItem('orders', JSON.stringify(updatedAllOrders));
      }
      
      message.success(`Đã cập nhật trạng thái đơn hàng ${orderId} thành ${getStatusText(newStatus)}`);
    } catch (error) {
      message.error('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'blue';
      case 'processing':
        return 'cyan';
      case 'shipping':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      default: return 'Không xác định';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'paid':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'default';
    }
  };


  const getOrderStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipping', 'delivered'];
    return steps.indexOf(status);
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => <Text strong>{id}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: Order) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <Avatar icon={<UserOutlined />} size="small" style={{ marginRight: 8 }} />
            <Text strong>{name}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.customerEmail}
          </Text>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total: number) => (
        <Text strong style={{ color: '#3f8600' }}>
          ₫{total.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 130,
      render: (status: string, record: Order) => (
        <div>
          <Tag color={getPaymentStatusColor(status)}>
            {getPaymentStatusText(status)}
          </Tag>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.paymentMethod}
          </Text>
        </div>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (date: string) => (
        <Text style={{ fontSize: 12 }}>{date}</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record: Order) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewOrder(record)}
          />
          <Select
            size="small"
            value={record.status}
            style={{ width: 80 }}
            onChange={(value) => handleUpdateStatus(record.id, value)}
          >
            <Option value="pending">Chờ</Option>
            <Option value="confirmed">Xác nhận</Option>
            <Option value="processing">Xử lý</Option>
            <Option value="shipping">Giao</Option>
            <Option value="delivered">Hoàn thành</Option>
            <Option value="cancelled">Hủy</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* <div>
          <Title level={2}>Quản lý đơn hàng</Title>
          <Text type="secondary">Quản lý và theo dõi tất cả đơn hàng</Text>
        </div> */}

        <Card>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng, tên hoặc email"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Trạng thái đơn hàng"
                style={{ width: '100%' }}
                allowClear
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Option value="pending">Chờ xác nhận</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="shipping">Đang giao hàng</Option>
                <Option value="delivered">Đã giao hàng</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Trạng thái thanh toán"
                style={{ width: '100%' }}
                allowClear
                value={selectedPaymentStatus}
                onChange={setSelectedPaymentStatus}
              >
                <Option value="pending">Chờ thanh toán</Option>
                <Option value="paid">Đã thanh toán</Option>
                <Option value="failed">Thanh toán thất bại</Option>
              </Select>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredOrders}
            loading={loading}
            pagination={{
              total: filteredOrders.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        <Modal
          title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={[
            <Button key="print" icon={<PrinterOutlined />}>
              In đơn hàng
            </Button>,
            <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={800}
        >
          {selectedOrder && (
            <div>
              <Steps
                current={getOrderStatusStep(selectedOrder.status)}
                size="small"
                style={{ marginBottom: 24 }}
              >
                <Step title="Chờ xác nhận" />
                <Step title="Đã xác nhận" />
                <Step title="Đang xử lý" />
                <Step title="Đang giao hàng" />
                <Step title="Đã giao hàng" />
              </Steps>

              <Row gutter={24}>
                <Col span={12}>
                  <Card size="small" title="Thông tin khách hàng">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Tên">{selectedOrder.customerName}</Descriptions.Item>
                      <Descriptions.Item label="Email">{selectedOrder.customerEmail}</Descriptions.Item>
                      <Descriptions.Item label="Điện thoại">{selectedOrder.customerPhone}</Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ giao hàng">
                        {selectedOrder.shippingAddress}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card size="small" title="Thông tin đơn hàng">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Mã đơn hàng">{selectedOrder.id}</Descriptions.Item>
                      <Descriptions.Item label="Ngày đặt">{selectedOrder.createdAt}</Descriptions.Item>
                      <Descriptions.Item label="Phương thức thanh toán">
                        {selectedOrder.paymentMethod}
                      </Descriptions.Item>
                      <Descriptions.Item label="Trạng thái thanh toán">
                        <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                          {getPaymentStatusText(selectedOrder.paymentStatus)}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>

              <Divider />

              <Card size="small" title="Sản phẩm đã đặt" style={{ marginTop: 16 }}>
                <Table
                  size="small"
                  pagination={false}
                  dataSource={selectedOrder.items}
                  columns={[
                    {
                      title: 'Sản phẩm',
                      dataIndex: 'name',
                      render: (name: string, record: OrderItem) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={record.image} shape="square" style={{ marginRight: 8 }} />
                          <Text>{name}</Text>
                        </div>
                      ),
                    },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'price',
                      render: (price: number) => `₫${price.toLocaleString()}`,
                    },
                    {
                      title: 'Số lượng',
                      dataIndex: 'quantity',
                    },
                    {
                      title: 'Thành tiền',
                      dataIndex: 'total',
                      render: (total: number) => (
                        <Text strong>₫{total.toLocaleString()}</Text>
                      ),
                    },
                  ]}
                />
                
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Space direction="vertical" style={{ width: 200 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Tạm tính:</Text>
                      <Text>₫{selectedOrder.subtotal.toLocaleString()}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Phí vận chuyển:</Text>
                      <Text>₫{selectedOrder.shipping.toLocaleString()}</Text>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                      <Text strong style={{ color: '#3f8600', fontSize: 16 }}>
                        ₫{selectedOrder.total.toLocaleString()}
                      </Text>
                    </div>
                  </Space>
                </div>
              </Card>

              {selectedOrder.notes && (
                <Card size="small" title="Ghi chú" style={{ marginTop: 16 }}>
                  <Text>{selectedOrder.notes}</Text>
                </Card>
              )}
            </div>
          )}
        </Modal>
      </Space>
    </div>
  );
};

export default Orders; 