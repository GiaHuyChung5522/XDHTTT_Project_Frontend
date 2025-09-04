import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Modal, 
  Descriptions, 
  Steps, 
  Timeline, 
  Avatar, 
  Divider, 
  message, 
  Empty,
  Badge,
  Row,
  Col,
  Typography,
  Input,
  Select
} from 'antd';
import {
  EyeOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import ShippingTracker from '../../components/ShippingTracker';
import './UserOrders.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadUserOrders();
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchText, statusFilter]);

  const loadUserOrders = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedOrders = localStorage.getItem('orders');
      const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
      
      // Filter orders by user (using phone number as identifier)
      const userOrders = allOrders.filter(order => 
        order.customerInfo?.phone === user?.phone || 
        order.customerInfo?.email === user?.email
      );
      
      // Sort by creation date (newest first)
      userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(userOrders);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchText) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

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
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      default: return 'Chờ thanh toán';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      default: return 'orange';
    }
  };

  const getOrderStep = (status) => {
    const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
      render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <Text style={{ fontSize: '13px' }}>
          {new Date(date).toLocaleDateString('vi-VN')}
        </Text>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <div>
          <Text strong>{items.length} sản phẩm</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {items[0]?.name}
            {items.length > 1 && ` và ${items.length - 1} sản phẩm khác`}
          </Text>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total) => (
        <Text strong style={{ color: '#3f8600' }}>
          ₫{total.toLocaleString()}
        </Text>
      ),
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
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 120,
      render: (paymentStatus) => (
        <Tag color={getPaymentStatusColor(paymentStatus)} size="small">
          {getPaymentStatusText(paymentStatus)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showOrderDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const renderOrderDetail = () => {
    if (!selectedOrder) return null;

    const orderSteps = [
      {
        title: 'Đặt hàng',
        description: 'Đơn hàng đã được đặt',
        icon: <CheckCircleOutlined />,
      },
      {
        title: 'Xác nhận',
        description: 'Đơn hàng đã được xác nhận',
        icon: <CheckCircleOutlined />,
      },
      {
        title: 'Giao hàng',
        description: 'Đơn hàng đang được giao',
        icon: <TruckOutlined />,
      },
      {
        title: 'Hoàn thành',
        description: 'Đơn hàng đã giao thành công',
        icon: <CheckCircleOutlined />,
      },
    ];

    return (
      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder.orderId}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className="order-detail">
          {/* Order Status Steps */}
          <Card size="small" style={{ marginBottom: 16 }}>
            <Steps
              current={getOrderStep(selectedOrder.status)}
              items={orderSteps}
              size="small"
            />
          </Card>

          {/* Order Info */}
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="Thông tin đơn hàng">
                <Descriptions size="small" column={1}>
                  <Descriptions.Item label="Mã đơn hàng">
                    <Text strong>{selectedOrder.orderId}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày đặt">
                    {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(selectedOrder.status)}>
                      {getStatusText(selectedOrder.status)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương thức thanh toán">
                    {selectedOrder.paymentMethod === 'cash' ? 'Tiền mặt (COD)' :
                     selectedOrder.paymentMethod === 'bank' ? 'Chuyển khoản' :
                     selectedOrder.paymentMethod === 'card' ? 'Thẻ tín dụng' : 'Tiền mặt'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái thanh toán">
                    <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                      {getPaymentStatusText(selectedOrder.paymentStatus)}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={12}>
              <Card size="small" title="Thông tin giao hàng">
                <Descriptions size="small" column={1}>
                  <Descriptions.Item label="Người nhận">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar icon={<UserOutlined />} size="small" style={{ marginRight: 8 }} />
                      {selectedOrder.customerInfo?.name}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      {selectedOrder.customerInfo?.phone}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <EnvironmentOutlined style={{ marginRight: 8, marginTop: 2 }} />
                      <div>
                        {selectedOrder.customerInfo?.address}
                        <br />
                        {selectedOrder.customerInfo?.ward}, {selectedOrder.customerInfo?.district}, {selectedOrder.customerInfo?.city}
                      </div>
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          {/* Order Items */}
          <Card size="small" title="Sản phẩm đã đặt" style={{ marginTop: 16 }}>
            <Table
              size="small"
              pagination={false}
              dataSource={selectedOrder.items}
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'name',
                  render: (name, record) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={record.image} 
                        shape="square" 
                        style={{ marginRight: 8, width: 40, height: 40 }} 
                      />
                      <div>
                        <Text strong>{name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          ID: {record.id}
                        </Text>
                      </div>
                    </div>
                  ),
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  render: (price) => `₫${price.toLocaleString()}`,
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  align: 'center',
                },
                {
                  title: 'Thành tiền',
                  dataIndex: 'total',
                  render: (total, record) => (
                    <Text strong>₫{(record.price * record.quantity).toLocaleString()}</Text>
                  ),
                },
              ]}
            />
          </Card>

          {/* Order Summary */}
          <Card size="small" title="Tổng kết đơn hàng" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'right' }}>
                  <Text>Tạm tính:</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text>₫{selectedOrder.subtotal.toLocaleString()}</Text>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'right' }}>
                  <Text>Phí vận chuyển:</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text>₫{selectedOrder.shippingFee.toLocaleString()}</Text>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'right' }}>
                  <Text strong>Tổng cộng:</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text strong style={{ color: '#3f8600', fontSize: '16px' }}>
                  ₫{selectedOrder.total.toLocaleString()}
                </Text>
              </Col>
            </Row>
          </Card>

          {/* Shipping Tracking */}
          {selectedOrder.status === 'shipped' && (
            <ShippingTracker 
              orderId={selectedOrder.orderId}
              orderStatus={selectedOrder.status}
              onRefresh={() => {
                // Refresh order data
                loadUserOrders();
              }}
            />
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div className="user-orders">
      <div className="orders-header">
        <Title level={2}>Đơn hàng của tôi</Title>
        <Text type="secondary">
          Theo dõi trạng thái đơn hàng và lịch sử mua sắm
        </Text>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo mã đơn hàng"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="shipped">Đang giao hàng</Option>
              <Option value="delivered">Đã giao hàng</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary">
                Tổng cộng: <Text strong>{filteredOrders.length}</Text> đơn hàng
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        {filteredOrders.length === 0 ? (
          <Empty
            description="Bạn chưa có đơn hàng nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
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
            rowKey="orderId"
          />
        )}
      </Card>

      {/* Order Detail Modal */}
      {renderOrderDetail()}
    </div>
  );
};

export default UserOrders;
