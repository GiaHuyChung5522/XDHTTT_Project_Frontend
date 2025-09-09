import React, { useState, useEffect } from 'react';
import { initializeLocalStorageData, getSafeString, getSafeNumber, getSafeArray } from '../../../utils/initData';
import { adminService } from '../../../services/adminService';
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
  Avatar,
  Statistic,
  Descriptions,
  List,
  message,
  Spin,
  Pagination,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  status: string;
}

interface Customer {
  key: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  gender: string;
  birth?: Date;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
  // Computed fields for display
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  orders?: CustomerOrder[];
}

// Function to get real customers from localStorage
const getRealCustomers = (): Customer[] => {
  try {
    const users = localStorage.getItem('users');
    const userData = users ? JSON.parse(users) : [];
    
    const orders = localStorage.getItem('orders');
    const orderData = orders ? JSON.parse(orders) : [];
    
    return userData.map((user: any, index: number) => {
      const userOrders = orderData.filter((order: any) => 
        order.customerInfo?.email === user.email || order.customerInfo?.phone === user.telephone
      );
      
      const totalSpent = userOrders
        .filter((order: any) => order.status === 'delivered')
        .reduce((sum: number, order: any) => sum + order.total, 0);
      
      const lastOrder = userOrders.length > 0 
        ? userOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        : null;
      
      return {
        key: getSafeString(user.id) || index.toString(),
        id: getSafeString(user.id) || index.toString(),
        name: `${getSafeString(user.firstName)} ${getSafeString(user.lastName)}`.trim() || getSafeString(user.email) || 'Khách hàng',
        email: getSafeString(user.email) || 'Chưa có email',
        phone: getSafeString(user.telephone) || 'Chưa cập nhật',
        address: getSafeString(user.address) || 'Chưa cập nhật',
        totalOrders: userOrders.length,
        totalSpent: totalSpent,
        lastOrderDate: lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString('vi-VN') : 'Chưa có đơn hàng',
        status: userOrders.length > 0 ? 'active' : 'inactive',
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
        orders: userOrders.map((order: any) => ({
          id: getSafeString(order.orderId) || 'N/A',
          date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
          total: getSafeNumber(order.total),
          status: order.status === 'pending' ? 'Chờ xác nhận' :
                  order.status === 'confirmed' ? 'Đã xác nhận' :
                  order.status === 'shipped' ? 'Đang giao hàng' :
                  order.status === 'delivered' ? 'Đã giao hàng' : 'Đã hủy',
        })),
      };
    });
  } catch (error) {
    return [];
  }
};

// Mock data (fallback)
const mockCustomers: Customer[] = [
  {
    key: '1',
    id: 'CUST-001',
    email: 'nguyenvana@email.com',
    firstName: 'Nguyễn Văn',
    lastName: 'A',
    fullName: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    role: 'USER',
    gender: 'MALE',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    status: 'active' as const,
    totalOrders: 15,
    totalSpent: 12500000,
    lastOrderDate: '2024-12-09',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nguyen',
    orders: [
      { id: 'ORD-001', date: '2024-12-09', total: 878000, status: 'confirmed' },
      { id: 'ORD-015', date: '2024-12-05', total: 1200000, status: 'delivered' },
      { id: 'ORD-025', date: '2024-11-28', total: 650000, status: 'delivered' },
    ],
  },
  {
    key: '2',
    id: 'CUST-002',
    email: 'tranthib@email.com',
    firstName: 'Trần Thị',
    lastName: 'B',
    fullName: 'Trần Thị B',
    phone: '0987654321',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    role: 'USER',
    gender: 'FEMALE',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    status: 'active' as const,
    totalOrders: 8,
    totalSpent: 6800000,
    lastOrderDate: '2024-12-08',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tran',
    orders: [
      { id: 'ORD-002', date: '2024-12-08', total: 1049000, status: 'shipping' },
      { id: 'ORD-018', date: '2024-11-30', total: 850000, status: 'delivered' },
    ],
  },
  {
    key: '3',
    id: 'CUST-003',
    email: 'levanc@email.com',
    firstName: 'Lê Văn',
    lastName: 'C',
    fullName: 'Lê Văn C',
    phone: '0369852147',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    role: 'USER',
    gender: 'MALE',
    createdAt: '2024-10-05',
    updatedAt: '2024-10-05',
    status: 'active' as const,
    totalOrders: 3,
    totalSpent: 1950000,
    lastOrderDate: '2024-12-09',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=le',
    orders: [
      { id: 'ORD-003', date: '2024-12-09', total: 680000, status: 'pending' },
      { id: 'ORD-030', date: '2024-11-15', total: 520000, status: 'delivered' },
    ],
  },
  {
    key: '4',
    id: 'CUST-004',
    email: 'phamthid@email.com',
    firstName: 'Phạm Thị',
    lastName: 'D',
    fullName: 'Phạm Thị D',
    phone: '0741852963',
    address: '321 Đường GHI, Quận 4, TP.HCM',
    role: 'USER',
    gender: 'FEMALE',
    createdAt: '2023-11-10',
    updatedAt: '2023-11-10',
    status: 'active' as const,
    totalOrders: 22,
    totalSpent: 18750000,
    lastOrderDate: '2024-12-07',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pham',
    orders: [
      { id: 'ORD-004', date: '2024-12-07', total: 570000, status: 'delivered' },
      { id: 'ORD-020', date: '2024-12-01', total: 1100000, status: 'delivered' },
      { id: 'ORD-035', date: '2024-11-25', total: 890000, status: 'delivered' },
    ],
  },
  {
    key: '5',
    id: 'CUST-005',
    email: 'hoangvane@email.com',
    firstName: 'Hoàng Văn',
    lastName: 'E',
    fullName: 'Hoàng Văn E',
    phone: '0456789123',
    address: '654 Đường JKL, Quận 5, TP.HCM',
    role: 'USER',
    gender: 'MALE',
    createdAt: '2024-09-10',
    updatedAt: '2024-09-10',
    status: 'inactive' as const,
    totalOrders: 1,
    totalSpent: 320000,
    lastOrderDate: '2024-09-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoang',
    orders: [
      { id: 'ORD-040', date: '2024-09-15', total: 320000, status: 'delivered' },
    ],
  },
];

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
  });
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Load customers from API
  const loadCustomers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await adminService.getUsers({
        page,
        limit: pageSize,
        search: filters.search,
        role: filters.role,
        status: filters.status,
      });

      if (result.success) {
        // Add computed fields for display
        const customersWithStats = result.data.users.map(customer => ({
          ...customer,
          totalOrders: Math.floor(Math.random() * 20) + 1, // Mock data for now
          totalSpent: Math.floor(Math.random() * 10000000) + 1000000, // Mock data for now
          lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
          orders: [], // Mock empty orders for now
          status: customer.status as 'active' | 'inactive',
        }));
        
        setCustomers(customersWithStats);
        setPagination({
          current: result.data.pagination.page,
          pageSize: result.data.pagination.limit,
          total: result.data.pagination.total,
        });
      } else {
        message.error('Không thể tải danh sách khách hàng');
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      message.error('Lỗi khi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    loadCustomers(pagination.current, pagination.pageSize);
  }, [filters]);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalVisible(true);
  };

  const handleUpdateStatus = async (customerId: string, newStatus: string) => {
    try {
      const result = await adminService.updateUser(customerId, { status: newStatus });
      if (result.success) {
        message.success('Đã cập nhật trạng thái khách hàng');
        loadCustomers(pagination.current, pagination.pageSize);
      } else {
        message.error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleTableChange = (pagination: any) => {
    loadCustomers(pagination.current, pagination.pageSize);
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
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  const getCustomerLevel = (totalSpent: number) => {
    if (totalSpent >= 15000000) return { level: 'VIP', color: '#722ed1' };
    if (totalSpent >= 5000000) return { level: 'Gold', color: '#fa8c16' };
    if (totalSpent >= 1000000) return { level: 'Silver', color: '#13c2c2' };
    return { level: 'Bronze', color: '#52c41a' };
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Khách hàng',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Customer) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />} 
            style={{ marginRight: 12 }} 
          />
          <div>
            <Text strong>{record.fullName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.id}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin liên hệ',
      dataIndex: 'email',
      key: 'contact',
      render: (email: string, record: Customer) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <MailOutlined style={{ marginRight: 4, fontSize: 12, color: '#8c8c8c' }} />
            <Text style={{ fontSize: 12 }}>{email}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PhoneOutlined style={{ marginRight: 4, fontSize: 12, color: '#8c8c8c' }} />
            <Text style={{ fontSize: 12 }}>{record.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Cấp độ',
      dataIndex: 'totalSpent',
      key: 'level',
      width: 100,
      render: (totalSpent: number) => {
        const { level, color } = getCustomerLevel(totalSpent);
        return (
          <Tag color={color}>
            {level}
          </Tag>
        );
      },
    },
    {
      title: 'Đơn hàng',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: 80,
      render: (orders: number) => (
        <div style={{ textAlign: 'center' }}>
          <ShoppingCartOutlined style={{ marginRight: 4 }} />
          <Text strong>{orders}</Text>
        </div>
      ),
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      width: 130,
      render: (amount: number) => (
        <Text strong style={{ color: '#3f8600' }}>
          ₫{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Đơn hàng cuối',
      dataIndex: 'lastOrderDate',
      key: 'lastOrderDate',
      width: 110,
      render: (date: string) => (
        <Text style={{ fontSize: 12 }}>{date}</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record: Customer) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewCustomer(record)}
          />
          <Select
            size="small"
            value={record.status}
            style={{ width: 80 }}
            onChange={(value) => handleUpdateStatus(record.id, value)}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Tạm khóa</Option>
          </Select>
        </Space>
      ),
    },
  ];

  const getOrderStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'cancelled': 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const getOrderStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'orange',
      'confirmed': 'blue',
      'processing': 'cyan',
      'shipping': 'purple',
      'delivered': 'green',
      'cancelled': 'red',
    };
    return colorMap[status] || 'default';
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* <div>
          <Title level={2}>Quản lý khách hàng</Title>
          <Text type="secondary">Quản lý thông tin và hoạt động của khách hàng</Text>
        </div> */}

        <Card>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12}>
              <Input
                placeholder="Tìm kiếm theo tên, email, điện thoại hoặc mã khách hàng"
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Vai trò"
                style={{ width: '100%' }}
                allowClear
                value={filters.role}
                onChange={(value) => handleFilterChange('role', value)}
              >
                <Option value="USER">Người dùng</Option>
                <Option value="ADMIN">Quản trị viên</Option>
              </Select>
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Trạng thái"
                style={{ width: '100%' }}
                allowClear
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
              >
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={customers}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} khách hàng`,
                onChange: handleTableChange,
              }}
              scroll={{ x: 900 }}
            />
          </Spin>
        </Card>

        <Modal
          title={`Chi tiết khách hàng ${selectedCustomer?.fullName}`}
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={800}
        >
          {selectedCustomer && (
            <div>
              <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <Avatar 
                      src={selectedCustomer.avatar} 
                      icon={<UserOutlined />} 
                      size={80}
                      style={{ marginBottom: 16 }}
                    />
                    <div>
                      <Title level={4} style={{ margin: 0 }}>
                        {selectedCustomer.fullName}
                      </Title>
                      <Text type="secondary">{selectedCustomer.id}</Text>
                      <br />
                      <Tag color={getCustomerLevel(selectedCustomer.totalSpent || 0).color} style={{ marginTop: 8 }}>
                        {getCustomerLevel(selectedCustomer.totalSpent || 0).level}
                      </Tag>
                    </div>
                  </div>
                </Col>
                
                <Col span={18}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="Tổng đơn hàng"
                        value={selectedCustomer.totalOrders || 0}
                        prefix={<ShoppingCartOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Tổng chi tiêu"
                        value={selectedCustomer.totalSpent || 0}
                        formatter={(value) => `₫${Number(value).toLocaleString()}`}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Trung bình/đơn"
                        value={selectedCustomer.totalOrders ? (selectedCustomer.totalSpent || 0) / selectedCustomer.totalOrders : 0}
                        formatter={(value) => `₫${Number(value).toLocaleString()}`}
                        precision={0}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Card size="small" title="Thông tin cá nhân">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Email">{selectedCustomer.email}</Descriptions.Item>
                      <Descriptions.Item label="Điện thoại">{selectedCustomer.phone}</Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ">{selectedCustomer.address}</Descriptions.Item>
                      <Descriptions.Item label="Vai trò">
                        <Tag color={selectedCustomer.role === 'ADMIN' ? 'red' : 'blue'}>
                          {selectedCustomer.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Giới tính">{selectedCustomer.gender}</Descriptions.Item>
                      <Descriptions.Item label="Ngày tham gia">{new Date(selectedCustomer.createdAt).toLocaleDateString('vi-VN')}</Descriptions.Item>
                      <Descriptions.Item label="Đơn hàng cuối">{selectedCustomer.lastOrderDate || 'Chưa có'}</Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(selectedCustomer.status)}>
                          {getStatusText(selectedCustomer.status)}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card size="small" title="Lịch sử đơn hàng gần đây">
                    {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                      <List
                        size="small"
                        dataSource={selectedCustomer.orders}
                        renderItem={(order) => (
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Text strong>{order.id}</Text>
                                  <Tag color={getOrderStatusColor(order.status)} style={{ fontSize: 12, lineHeight: '16px', padding: '0 6px' }}>
                                    {getOrderStatusText(order.status)}
                                  </Tag>
                                </div>
                              }
                              description={
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Text type="secondary" style={{ fontSize: 12 }}>{order.date}</Text>
                                  <Text strong style={{ color: '#3f8600' }}>
                                    ₫{order.total.toLocaleString()}
                                  </Text>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#8c8c8c' }}>
                        <Text type="secondary">Chưa có đơn hàng nào</Text>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </Space>
    </div>
  );
};

export default Customers; 