import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  Modal, 
  message, 
  Card, 
  Statistic, 
  Row, 
  Col,
  Select,
  Input,
  DatePicker,
  Badge,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// Mock data cho đơn hàng
const mockOrders = [
  {
    id: 'DH1234567',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0123456789',
    customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
    items: [
      { id: 1, name: 'Lenovo IdeaPad 5 Pro 14 GT', price: 26190000, quantity: 1 },
      { id: 2, name: 'Gigabyte Gaming A16', price: 22990000, quantity: 1 }
    ],
    subtotal: 49180000,
    shippingFee: 0,
    total: 49180000,
    paymentMethod: 'bank',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    note: 'Giao hàng giờ hành chính'
  },
  {
    id: 'DH1234568',
    customerName: 'Trần Thị B',
    customerPhone: '0987654321',
    customerAddress: '456 Đường XYZ, Quận 3, TP.HCM',
    items: [
      { id: 3, name: 'Lenovo Legion R7000', price: 22990000, quantity: 1 }
    ],
    subtotal: 22990000,
    shippingFee: 30000,
    total: 23020000,
    paymentMethod: 'cash',
    status: 'confirmed',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    note: ''
  },
  {
    id: 'DH1234569',
    customerName: 'Lê Văn C',
    customerPhone: '0555666777',
    customerAddress: '789 Đường DEF, Quận 7, TP.HCM',
    items: [
      { id: 4, name: 'ASUS ROG Strix G16', price: 28990000, quantity: 1 },
      { id: 5, name: 'MSI Katana 15', price: 24990000, quantity: 1 }
    ],
    subtotal: 53980000,
    shippingFee: 0,
    total: 53980000,
    paymentMethod: 'card',
    status: 'shipped',
    createdAt: '2024-01-13T08:45:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    note: 'Giao hàng trước 17h'
  },
  {
    id: 'DH1234570',
    customerName: 'Phạm Thị D',
    customerPhone: '0333444555',
    customerAddress: '321 Đường GHI, Quận 10, TP.HCM',
    items: [
      { id: 6, name: 'Dell Inspiron 15', price: 19990000, quantity: 2 }
    ],
    subtotal: 39980000,
    shippingFee: 0,
    total: 39980000,
    paymentMethod: 'bank',
    status: 'delivered',
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    note: 'Đã giao thành công'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'orange';
    case 'confirmed': return 'blue';
    case 'shipped': return 'purple';
    case 'delivered': return 'green';
    case 'cancelled': return 'red';
    default: return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'shipped': return 'Đang giao';
    case 'delivered': return 'Đã giao';
    case 'cancelled': return 'Đã hủy';
    default: return 'Không xác định';
  }
};

const getPaymentMethodText = (method) => {
  switch (method) {
    case 'cash': return 'Tiền mặt';
    case 'bank': return 'Chuyển khoản';
    case 'card': return 'Thẻ tín dụng';
    default: return 'Không xác định';
  }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Lấy từ localStorage nếu có
      const savedOrders = localStorage.getItem('orders');
      const allOrders = savedOrders ? JSON.parse(savedOrders) : mockOrders;
      
      setOrders(allOrders);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      );
      
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      message.success(`Cập nhật trạng thái đơn hàng ${orderId} thành công`);
    } catch (error) {
      message.error('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      message.success('Xóa đơn hàng thành công');
    } catch (error) {
      message.error('Không thể xóa đơn hàng');
    }
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = (order.id || '').toLowerCase().includes(searchText.toLowerCase()) ||
                         (order.customerName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                         (order.customerPhone || '').includes(searchText);
    const matchesDate = !dateRange || (
      dayjs(order.createdAt).isAfter(dateRange[0]) && 
      dayjs(order.createdAt).isBefore(dateRange[1])
    );
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatistics = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);

    return { total, pending, confirmed, shipped, delivered, totalRevenue };
  };

  const stats = getStatistics();

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => <strong>{id}</strong>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      render: (name, record) => (
        <div>
          <div><strong>{name}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.customerPhone}</div>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          ₫{total.toLocaleString()}
        </span>
      )
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 120,
      render: (method) => getPaymentMethodText(method)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => showOrderDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Select
              size="small"
              value={record.status}
              style={{ width: 100 }}
              onChange={(value) => updateOrderStatus(record.id, value)}
            >
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="shipped">Đang giao</Option>
              <Option value="delivered">Đã giao</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => deleteOrder(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa đơn hàng">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, marginBottom: '16px' }}>Quản lý đơn hàng</h2>
        
        {/* Thống kê */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={stats.total}
                prefix={<Badge count={stats.total} style={{ backgroundColor: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Chờ xác nhận"
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Đã xác nhận"
                value={stats.confirmed}
                valueStyle={{ color: '#1890ff' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Đang giao"
                value={stats.shipped}
                valueStyle={{ color: '#722ed1' }}
                prefix={<CarOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Đã giao"
                value={stats.delivered}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={stats.totalRevenue}
                precision={0}
                valueStyle={{ color: '#52c41a' }}
                prefix="₫"
                suffix={stats.totalRevenue.toLocaleString()}
              />
            </Card>
          </Col>
        </Row>

        {/* Bộ lọc */}
        <Card style={{ marginBottom: '16px' }}>
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Search
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="pending">Chờ xác nhận</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="shipped">Đang giao</Option>
                <Option value="delivered">Đã giao</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={4}>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => {
                  setSearchText('');
                  setStatusFilter('all');
                  setDateRange(null);
                }}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Bảng đơn hàng */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} đơn hàng`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <h4>Thông tin khách hàng</h4>
                <p><strong>Tên:</strong> {selectedOrder.customerName}</p>
                <p><strong>SĐT:</strong> {selectedOrder.customerPhone}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.customerAddress}</p>
              </Col>
              <Col span={12}>
                <h4>Thông tin đơn hàng</h4>
                <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
                <p><strong>Ngày tạo:</strong> {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Trạng thái:</strong> 
                  <Tag color={getStatusColor(selectedOrder.status)} style={{ marginLeft: '8px' }}>
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                </p>
                <p><strong>Thanh toán:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <h4>Sản phẩm đã đặt</h4>
              <Table
                dataSource={selectedOrder.items}
                columns={[
                  { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
                  { title: 'Đơn giá', dataIndex: 'price', key: 'price', 
                    render: (price) => `₫${price.toLocaleString()}` },
                  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
                  { title: 'Thành tiền', key: 'total',
                    render: (_, record) => `₫${(record.price * record.quantity).toLocaleString()}` }
                ]}
                pagination={false}
                size="small"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4>Tổng cộng</h4>
              <Row gutter={16}>
                <Col span={8}>
                  <p>Tạm tính: <strong>₫{selectedOrder.subtotal.toLocaleString()}</strong></p>
                </Col>
                <Col span={8}>
                  <p>Phí vận chuyển: <strong>₫{selectedOrder.shippingFee.toLocaleString()}</strong></p>
                </Col>
                <Col span={8}>
                  <p>Tổng tiền: <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                    ₫{selectedOrder.total.toLocaleString()}
                  </strong></p>
                </Col>
              </Row>
            </div>

            {selectedOrder.note && (
              <div>
                <h4>Ghi chú</h4>
                <p>{selectedOrder.note}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
