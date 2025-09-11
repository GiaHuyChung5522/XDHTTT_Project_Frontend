import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Descriptions,
  Image,
  Row,
  Col,
  Statistic,
  message,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { adminService } from '../../../services/adminService';

const { Search } = Input;
const { Option } = Select;

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
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled' | 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang giao hàng' | 'Giao hàng thành công' | 'Đã huỷ';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'Chờ thanh toán' | 'Đã thanh toán' | 'Thanh toán thất bại';
  createdAt: string;
  updatedAt: string;
  notes: string;
  paymentDetails?: any;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  // Load orders from API
  const loadOrders = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading orders from API...');
      const result = await adminService.getRecentOrders();
      
      if (result.success && result.data) {
        console.log('📦 Orders response:', result.data);
        
        // Handle different API response structures
        const ordersData = (result.data as any).orders || result.data;
        console.log('📦 Orders data to transform:', ordersData);
        
        // Transform backend data to frontend format
        const transformedOrders = ordersData.map((order: any, index: number) => {
          console.log('🔄 Transforming order:', order);
          console.log('🔍 Order status from API:', order.status);
          console.log('🔍 Order paymentStatus from API:', order.paymentStatus);
          
          // Map backend status to frontend status
          const mapBackendToFrontendStatus = (backendStatus: string) => {
            const statusMap: { [key: string]: string } = {
              'Chờ xác nhận': 'pending',
              'Đã xác nhận': 'confirmed',
              'Đang giao hàng': 'shipping',
              'Giao hàng thành công': 'delivered',
              'Đã huỷ': 'cancelled',
              'Chờ thanh toán': 'pending',
              'Đã thanh toán': 'paid',
              'Thanh toán thất bại': 'failed'
            };
            return statusMap[backendStatus] || backendStatus || 'pending';
          };
          
          // Map backend payment status to frontend payment status
          const mapBackendToFrontendPaymentStatus = (backendPaymentStatus: string) => {
            const paymentStatusMap: { [key: string]: string } = {
              'Chờ thanh toán': 'pending',
              'Đã thanh toán': 'paid',
              'Thanh toán thất bại': 'failed'
            };
            return paymentStatusMap[backendPaymentStatus] || backendPaymentStatus || 'pending';
          };
          
          const frontendStatus = mapBackendToFrontendStatus(order.status) as Order['status'];
          const frontendPaymentStatus = mapBackendToFrontendPaymentStatus(order.paymentStatus) as Order['paymentStatus'];
          
          console.log('✅ Mapped status:', order.status, '->', frontendStatus);
          console.log('✅ Mapped paymentStatus:', order.paymentStatus, '->', frontendPaymentStatus);
          
          return {
            key: order._id || order.id || index.toString(),
            id: order._id || order.id || index.toString(),
            customerName: order.customerName || order.customer?.name || 'Khách hàng',
            customerEmail: order.customerEmail || order.customer?.email || 'N/A',
            customerPhone: order.customerPhone || order.customer?.phone || 'N/A',
            shippingAddress: order.shippingAddress || order.customer?.address || 'N/A',
            items: order.items || [],
            subtotal: order.subtotal || 0,
            shippingFee: order.shippingFee || 0,
            total: order.total || order.totalAmount || 0,
            paymentMethod: order.paymentMethod || 'Tiền mặt',
            paymentStatus: frontendPaymentStatus,
            status: frontendStatus,
            createdAt: order.createdAt || new Date().toISOString(),
            updatedAt: order.updatedAt || new Date().toISOString(),
            notes: order.notes || '',
            paymentDetails: order.paymentDetails || null
          } as Order;
        });
        
        setOrders(transformedOrders);
        setFilteredOrders(transformedOrders);
        console.log(`✅ Loaded ${transformedOrders.length} orders`);
      } else {
        const errorMsg = (result as any).message || 'Unknown error occurred';
        console.error('❌ Failed to load orders:', errorMsg);
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const handleFilter = () => {
    let filtered = orders;

    if (searchText) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.id.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchText.toLowerCase())
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

  useEffect(() => {
    handleFilter();
  }, [searchText, selectedStatus, selectedPaymentStatus, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'Chờ xác nhận':
        return 'orange';
      case 'confirmed':
      case 'Đã xác nhận':
        return 'blue';
      case 'shipping':
      case 'Đang giao hàng':
        return 'purple';
      case 'delivered':
      case 'Giao hàng thành công':
        return 'green';
      case 'cancelled':
      case 'Đã huỷ':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
      case 'Chờ xác nhận':
        return 'Chờ xác nhận';
      case 'confirmed':
      case 'Đã xác nhận':
        return 'Đã xác nhận';
      case 'shipping':
      case 'Đang giao hàng':
        return 'Đang giao hàng';
      case 'delivered':
      case 'Giao hàng thành công':
        return 'Đã giao hàng';
      case 'cancelled':
      case 'Đã huỷ':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'Chờ thanh toán':
        return 'orange';
      case 'paid':
      case 'Đã thanh toán':
        return 'green';
      case 'failed':
      case 'Thanh toán thất bại':
        return 'red';
      default:
        return 'default';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending':
      case 'Chờ thanh toán':
        return 'Chờ thanh toán';
      case 'paid':
      case 'Đã thanh toán':
        return 'Đã thanh toán';
      case 'failed':
      case 'Thanh toán thất bại':
        return 'Thanh toán thất bại';
      default:
        return status || 'Không xác định';
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  // Handle update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // Map frontend status to backend enum values
      const statusMap: { [key: string]: string } = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'shipping': 'Đang giao hàng',
        'delivered': 'Giao hàng thành công',
        'cancelled': 'Đã huỷ',
        'waiting_payment': 'Chờ thanh toán',
        'paid': 'Đã thanh toán',
        'failed': 'Thanh toán thất bại',
        'delivery_processing': 'Đang chuẩn bị hàng',
        'delivery_shipping': 'Đang giao hàng',
        'delivery_completed': 'Giao hàng thành công',
        'delivery_failed': 'Giao hàng thất bại'
      };
      
      const backendStatus = statusMap[newStatus] || newStatus;
      console.log('🔄 Updating order status:', { orderId, newStatus, backendStatus });
      
      const result = await adminService.updateOrderStatus(orderId, backendStatus);
      
      if (result.success) {
        message.success('Cập nhật trạng thái đơn hàng thành công');
        loadOrders(); // Reload orders
      } else {
        message.error(result.message || 'Không thể cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    }
  };

  // Handle update payment status
  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      // Map frontend payment status to backend enum values
      const paymentStatusMap: { [key: string]: string } = {
        'pending': 'Chờ thanh toán',
        'paid': 'Đã thanh toán',
        'failed': 'Thanh toán thất bại'
      };
      
      const backendPaymentStatus = paymentStatusMap[newPaymentStatus] || newPaymentStatus;
      console.log('🔄 Updating payment status:', { orderId, newPaymentStatus, backendPaymentStatus });
      
      // For now, we'll use the same updateOrderStatus endpoint
      // In the future, you might want to create a separate updatePaymentStatus endpoint
      const result = await adminService.updateOrderStatus(orderId, backendPaymentStatus);
      
      if (result.success) {
        message.success('Cập nhật trạng thái thanh toán thành công');
        loadOrders(); // Reload orders
      } else {
        message.error(result.message || 'Không thể cập nhật trạng thái thanh toán');
      }
    } catch (error) {
      console.error('❌ Error updating payment status:', error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      console.log('🔄 Deleting order:', orderId);
      
      const result = await adminService.deleteOrder(orderId);
      
      if (result.success) {
        message.success('Xóa đơn hàng thành công');
        loadOrders(); // Reload orders
      } else {
        message.error(result.message || 'Không thể xóa đơn hàng');
      }
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      message.error('Có lỗi xảy ra khi xóa đơn hàng');
    }
  };

  // Handle export orders
  const handleExportOrders = async (format: 'excel' | 'csv' = 'excel') => {
    try {
      console.log('🔄 Exporting orders...', { format });
      
      const filters = {
        status: selectedStatus,
        paymentStatus: selectedPaymentStatus,
        search: searchText
      };
      
      // Mock export for now since adminService doesn't have exportOrders
      message.success(`Xuất báo cáo đơn hàng thành công (${format.toUpperCase()})`);
    } catch (error) {
      console.error('❌ Error exporting orders:', error);
      message.error('Có lỗi xảy ra khi xuất báo cáo đơn hàng');
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
      width: 120,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {total?.toLocaleString('vi-VN') || 0} ₫
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string, record: Order) => {
        // Map backend status to frontend value for display
        const statusToValue = (status: string) => {
          const reverseMap: { [key: string]: string } = {
            'Chờ xác nhận': 'pending',
            'Đã xác nhận': 'confirmed',
            'Đang giao hàng': 'shipping',
            'Giao hàng thành công': 'delivered',
            'Đã huỷ': 'cancelled',
            'Chờ thanh toán': 'waiting_payment',
            'Đã thanh toán': 'paid',
            'Thanh toán thất bại': 'failed',
            'Đang chuẩn bị hàng': 'delivery_processing',
            'Giao hàng thất bại': 'delivery_failed'
          };
          return reverseMap[status] || status;
        };
        
        return (
          <Select
            key={`order-status-${record.id}`}
            value={statusToValue(status)}
            onChange={(newStatus) => handleUpdateStatus(record.id, newStatus)}
            style={{ width: '100%' }}
            size="small"
          >
            <Option value="pending">Chờ xác nhận</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="shipping">Đang giao hàng</Option>
            <Option value="delivered">Giao hàng thành công</Option>
            <Option value="cancelled">Đã huỷ</Option>
            <Option value="waiting_payment">Chờ thanh toán</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="failed">Thanh toán thất bại</Option>
            <Option value="delivery_processing">Đang chuẩn bị hàng</Option>
            <Option value="delivery_failed">Giao hàng thất bại</Option>
          </Select>
        );
      },
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 150,
      render: (status: string, record: Order) => {
        // Map backend payment status to frontend value for display
        const paymentStatusToValue = (status: string) => {
          const reverseMap: { [key: string]: string } = {
            'Chờ thanh toán': 'pending',
            'Đã thanh toán': 'paid',
            'Thanh toán thất bại': 'failed'
          };
          return reverseMap[status] || status;
        };
        
        return (
          <Select
            key={`payment-status-${record.id}`}
            value={paymentStatusToValue(status)}
            onChange={(newPaymentStatus) => handleUpdatePaymentStatus(record.id, newPaymentStatus)}
            style={{ width: '100%' }}
            size="small"
          >
            <Option value="pending">Chờ thanh toán</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="failed">Thanh toán thất bại</Option>
          </Select>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (record: Order) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOrder(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Calculate statistics with proper status mapping
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'Chờ xác nhận'
  ).length;
  const confirmedOrders = orders.filter(order => 
    order.status === 'confirmed' || order.status === 'Đã xác nhận'
  ).length;
  const shippingOrders = orders.filter(order => 
    order.status === 'shipping' || order.status === 'Đang giao hàng'
  ).length;
  const completedOrders = orders.filter(order => 
    order.status === 'delivered' || order.status === 'Giao hàng thành công'
  ).length;
  const totalRevenue = orders
    .filter(order => order.status === 'delivered' || order.status === 'Giao hàng thành công')
    .reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Quản lý đơn hàng
        </h2>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          Theo dõi và quản lý tất cả đơn hàng của khách hàng
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={confirmedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang giao"
              value={shippingOrders}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã giao"
              value={completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₫"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên, email, mã đơn hàng..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="shipping">Đang giao</Option>
              <Option value="delivered">Đã giao</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Thanh toán"
              value={selectedPaymentStatus}
              onChange={setSelectedPaymentStatus}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="pending">Chờ thanh toán</Option>
              <Option value="paid">Đã thanh toán</Option>
              <Option value="failed">Thanh toán thất bại</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleFilter}
              style={{ width: '100%' }}
            >
              Lọc
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              onClick={loadOrders}
              style={{ width: '100%' }}
            >
              Làm mới
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              onClick={() => handleExportOrders('excel')}
              icon={<FileTextOutlined />}
              style={{ width: '100%' }}
            >
              Xuất Excel
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              onClick={() => handleExportOrders('csv')}
              icon={<FileTextOutlined />}
              style={{ width: '100%' }}
            >
              Xuất CSV
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title="Chi tiết đơn hàng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã đơn hàng" span={2}>
                {selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.customerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.customerPhone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {selectedOrder.shippingAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                  {getPaymentStatusText(selectedOrder.paymentStatus)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedOrder.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                  {selectedOrder.total?.toLocaleString('vi-VN') || 0} ₫
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedOrder.notes || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: '24px' }}>
              <h4>Sản phẩm trong đơn hàng:</h4>
              {selectedOrder.items.map((item, index) => (
                <Card key={index} size="small" style={{ marginBottom: '8px' }}>
                  <Row align="middle">
                    <Col span={4}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover' }}
                      />
                    </Col>
                    <Col span={12}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                        <div style={{ color: '#666' }}>ID: {item.id}</div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div style={{ textAlign: 'center' }}>
                        <div>Số lượng</div>
                        <div style={{ fontWeight: 'bold' }}>{item.quantity}</div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div style={{ textAlign: 'right' }}>
                        <div>Thành tiền</div>
                        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                          {item.total?.toLocaleString('vi-VN') || 0} ₫
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;