import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Table, List, Avatar, Progress, Button, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Column, Line, Pie } from '@ant-design/charts';
import { motion, type Variants } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TagOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  EyeOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { adminService } from '../../../services/adminService';

const { Title, Text } = Typography;

// Function to get real stats from backend API
const getRealStats = async () => {
  try {
    console.log('🔄 Loading dashboard stats from backend...');
    
    // Get dashboard stats from backend
    const dashboardStats = await adminService.getDashboardStats();
    
    // Get recent orders
    const ordersResponse = await adminService.getRecentOrders(50);
    const orderData = ordersResponse.data || [];
    
    // Get users data
    const usersResponse = await adminService.getUsers();
    const userData = usersResponse.data?.users || [];
    
    console.log('📊 Dashboard stats loaded:', {
      dashboardStats,
      ordersCount: orderData.length,
      usersCount: userData.length
    });
    
    // Calculate metrics from real data
    const totalRevenue = dashboardStats.data?.totalRevenue || 0;
    const totalOrders = dashboardStats.data?.totalOrders || orderData.length;
    const totalUsers = dashboardStats.data?.totalUsers || userData.length;
    
    // Calculate pending orders
    const pendingOrders = orderData.filter((order: any) => 
      order.status === 'pending' || order.status === 'Chờ xác nhận'
    ).length;
    
    // Calculate unique customers from orders
    const uniqueCustomers = new Set(
      orderData.map((order: any) => order.customerPhone || order.customerName)
    ).size;
    
    // Mock data for products in cart (active users)
    const totalProductsInCart = Math.floor(totalUsers * 0.3); // 30% of users have items in cart
    
    return {
      totalRevenue,
      pendingOrders,
      totalOrders,
      uniqueCustomers,
      totalProductsInCart,
      totalUsers
    };
  } catch (error) {
    console.error('❌ Error loading dashboard stats:', error);
    return {
      totalRevenue: 0,
      pendingOrders: 0,
      totalOrders: 0,
      uniqueCustomers: 0,
      totalProductsInCart: 0,
      totalUsers: 0
    };
  }
};

// Function to get real orders from backend API
const getRealOrders = async () => {
  try {
    const ordersResponse = await adminService.getRecentOrders(5);
    const orderData = ordersResponse.data || [];
    
    return orderData.map((order: any, index: number) => ({
      key: index + 1,
      orderNumber: order.id || order._id || `ORD-${index + 1}`,
      customer: order.customerName || order.name || 'Khách hàng',
      amount: order.total || order.price || order.totalAmount || 0,
      status: order.status === 'pending' ? 'Chờ xác nhận' :
              order.status === 'confirmed' ? 'Đã xác nhận' :
              order.status === 'shipped' ? 'Đang giao hàng' :
              order.status === 'delivered' ? 'Đã giao hàng' : 
              order.status === 'Chờ xác nhận' ? 'Chờ xác nhận' :
              order.status === 'Đã giao' ? 'Đã giao hàng' : 'Đã hủy',
      paymentStatus: order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                    order.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                    order.paymentStatus === 'failed' ? 'Thanh toán thất bại' : 'Chờ thanh toán',
      paymentMethod: order.paymentMethod === 'cash' ? 'Tiền mặt' :
                    order.paymentMethod === 'bank' ? 'Chuyển khoản' :
                    order.paymentMethod === 'card' ? 'Thẻ tín dụng' : 
                    order.paymentMethod === 'Tiền mặt' ? 'Tiền mặt' : 'Tiền mặt',
      date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
      statusColor: order.status === 'pending' || order.status === 'Chờ xác nhận' ? '#f59e0b' :
                   order.status === 'confirmed' ? '#3b82f6' :
                   order.status === 'shipped' ? '#8b5cf6' :
                   order.status === 'delivered' || order.status === 'Đã giao' ? '#10b981' : '#ef4444',
      statusBg: order.status === 'pending' || order.status === 'Chờ xác nhận' ? '#fffbeb' :
                order.status === 'confirmed' ? '#eff6ff' :
                order.status === 'shipped' ? '#f5f3ff' :
                order.status === 'delivered' || order.status === 'Đã giao' ? '#ecfdf5' : '#fef2f2',
      paymentStatusColor: order.paymentStatus === 'paid' ? '#10b981' :
                         order.paymentStatus === 'pending' ? '#f59e0b' :
                         order.paymentStatus === 'failed' ? '#ef4444' : '#f59e0b',
    }));
  } catch (error) {
    console.error('❌ Error loading orders:', error);
    return [];
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    totalOrders: 0,
    uniqueCustomers: 0,
    totalProductsInCart: 0,
    totalUsers: 0
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, ordersData] = await Promise.all([
          getRealStats(),
          getRealOrders()
        ]);
        setStats(statsData);
        setOrders(ordersData);
      } catch (err) {
        setError('Không thể tải dữ liệu dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Real stats with actual data
  const realStatsData = [
    {
      title: 'Tổng doanh thu',
      value: stats.totalRevenue,
      prefix: '₫',
      suffix: '',
      precision: 0,
      trend: 'up',
      trendValue: 12.5,
      icon: <DollarOutlined />,
      color: '#6366f1', // Indigo
      bgColor: '#eef2ff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Đơn hàng chờ xử lý',
      value: stats.pendingOrders,
      prefix: '',
      suffix: '',
      precision: 0,
      trend: 'up',
      trendValue: 8.3,
      icon: <ClockCircleOutlined />,
      color: '#f59e0b', // Amber
      bgColor: '#fffbeb',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      prefix: '',
      suffix: '',
      precision: 0,
      trend: 'up',
      trendValue: 15.7,
      icon: <ShoppingCartOutlined />,
      color: '#10b981', // Emerald
      bgColor: '#ecfdf5',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      title: 'Khách hàng',
      value: stats.uniqueCustomers,
      prefix: '',
      suffix: '',
      precision: 0,
      trend: 'up',
      trendValue: 20.1,
      icon: <UserOutlined />,
      color: '#8b5cf6', // Violet
      bgColor: '#f5f3ff',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    {
      title: 'Sản phẩm trong giỏ',
      value: stats.totalProductsInCart,
      prefix: '',
      suffix: '',
      precision: 0,
      trend: 'up',
      trendValue: 5.2,
      icon: <TagOutlined />,
      color: '#ef4444', // Red
      bgColor: '#fef2f2',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      prefix: '',
      suffix: '',
      precision: 0,
      trend: 'up',
      trendValue: 18.9,
      icon: <TeamOutlined />,
      color: '#06b6d4', // Cyan
      bgColor: '#ecfeff',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    },
  ];

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => (
        <Text strong style={{ color: '#6366f1', fontSize: '14px' }}>{text}</Text>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (text: string) => (
        <Text style={{ fontSize: '14px' }}>{text}</Text>
      ),
    },
    {
      title: 'Giá trị',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#059669', fontSize: '14px' }}>
          ₫{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: record.statusBg,
          color: record.statusColor,
        }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => (
        <Text style={{ fontSize: '14px', color: '#6b7280' }}>{text}</Text>
      ),
    },
  ];

  // Mock data for charts (can be replaced with real data later)
  const mockTopProducts = [
    {
      name: 'Laptop Acer Aspire',
      sales: 156,
      revenue: 15600000,
      image: 'https://via.placeholder.com/40x40?text=Laptop',
      growth: 12,
      color: '#6366f1',
    },
    {
      name: 'Laptop Dell Inspiron',
      sales: 134,
      revenue: 13400000,
      image: 'https://via.placeholder.com/40x40?text=Laptop',
      growth: 8,
      color: '#10b981',
    },
    {
      name: 'Laptop HP Pavilion',
      sales: 89,
      revenue: 22250000,
      image: 'https://via.placeholder.com/40x40?text=Laptop',
      growth: -3,
      color: '#8b5cf6',
    },
    {
      name: 'Laptop Lenovo ThinkPad',
      sales: 76,
      revenue: 19000000,
      image: 'https://via.placeholder.com/40x40?text=Laptop',
      growth: 15,
      color: '#f59e0b',
    },
  ];

  // Chart data (mock data for now)
  const revenueData = [
    { month: 'T1', revenue: stats.totalRevenue * 0.8 },
    { month: 'T2', revenue: stats.totalRevenue * 0.9 },
    { month: 'T3', revenue: stats.totalRevenue * 1.1 },
    { month: 'T4', revenue: stats.totalRevenue * 0.95 },
    { month: 'T5', revenue: stats.totalRevenue * 1.2 },
    { month: 'T6', revenue: stats.totalRevenue },
  ];

  const orderStatusData = [
    { type: 'Hoàn thành', value: Math.floor(stats.totalOrders * 0.7), color: '#10b981' },
    { type: 'Đang xử lý', value: stats.pendingOrders, color: '#f59e0b' },
    { type: 'Đang giao', value: Math.floor(stats.totalOrders * 0.1), color: '#3b82f6' },
    { type: 'Đã hủy', value: Math.floor(stats.totalOrders * 0.05), color: '#ef4444' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const chartConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: '#6366f1',
    areaStyle: {
      fill: 'linear-gradient(180deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)',
    },
    yAxis: {
      label: {
        formatter: (value: string) => `${(parseInt(value) / 1000000).toFixed(0)}M`,
      },
    },
  };

  const pieConfig = {
    data: orderStatusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Đang tải dữ liệu dashboard...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        style={{ margin: '24px' }}
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1f2937', fontWeight: '700' }}>
                  Dashboard
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Tổng quan về hoạt động kinh doanh
                </Text>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/admin/products')}
                  style={{ borderRadius: '8px' }}
                >
                  Thêm sản phẩm
                </Button>
                <Button 
                  icon={<SettingOutlined />}
                  onClick={() => navigate('/admin/settings')}
                  style={{ borderRadius: '8px' }}
                >
                  Cài đặt
                </Button>
              </Space>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]}>
          {realStatsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={8} xl={4} key={index}>
              <motion.div variants={itemVariants}>
                <Card
                  style={{
                    background: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    height: '160px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                  }}
                  bodyStyle={{ padding: '24px', height: '100%' }}
                >
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <Text style={{ 
                          color: '#6b7280', 
                          fontSize: '14px', 
                          fontWeight: '600',
                          marginBottom: '12px',
                          display: 'block',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          {stat.title}
                        </Text>
                        <div>
                          <Text style={{ 
                            color: '#111827', 
                            fontSize: '28px', 
                            fontWeight: '800',
                            lineHeight: 1,
                          }}>
                            {stat.prefix}
                            <CountUp 
                              end={stat.value} 
                              duration={2}
                              separator=","
                            />
                          </Text>
                        </div>
                      </div>
                      <div style={{ 
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${stat.color}20`,
                      }}>
                        <div style={{ fontSize: '20px', color: stat.color }}>
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                      {stat.trend === 'up' ? (
                        <RiseOutlined style={{ 
                          color: '#10b981', 
                          marginRight: 8, 
                          fontSize: '16px' 
                        }} />
                      ) : (
                        <FallOutlined style={{ 
                          color: '#ef4444', 
                          marginRight: 8, 
                          fontSize: '16px' 
                        }} />
                      )}
                      <Text style={{ 
                        color: stat.trend === 'up' ? '#10b981' : '#ef4444', 
                        fontSize: '14px', 
                        fontWeight: '600' 
                      }}>
                        {Math.abs(stat.trendValue)}%
                      </Text>
                      <Text style={{ 
                        color: '#6b7280', 
                        fontSize: '13px',
                        marginLeft: '6px',
                      }}>
                        so với kỳ trước
                      </Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Charts and Tables */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <motion.div variants={itemVariants}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BarChartOutlined style={{ marginRight: 8, color: '#6366f1' }} />
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>Doanh thu theo tháng</span>
                  </div>
                }
                style={{ 
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Column {...chartConfig} height={300} />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} lg={8}>
            <motion.div variants={itemVariants}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingOutlined style={{ marginRight: 8, color: '#10b981' }} />
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>Trạng thái đơn hàng</span>
                  </div>
                }
                style={{ 
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Pie {...pieConfig} height={300} />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Recent Orders */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <motion.div variants={itemVariants}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FileTextOutlined style={{ marginRight: 8, color: '#8b5cf6' }} />
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>Đơn hàng gần đây</span>
                    </div>
                    <Button 
                      type="link" 
                      onClick={() => navigate('/admin/orders')}
                      style={{ padding: 0 }}
                    >
                      Xem tất cả
                    </Button>
                  </div>
                }
                style={{ 
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Table
                  columns={orderColumns}
                  dataSource={orders}
                  pagination={false}
                  size="small"
                  showHeader={false}
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} lg={8}>
            <motion.div variants={itemVariants}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TagOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>Sản phẩm bán chạy</span>
                  </div>
                }
                style={{ 
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <List
                  dataSource={mockTopProducts}
                  renderItem={(item, index) => (
                    <List.Item key={index} style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <List.Item.Meta
                        avatar={<Avatar src={item.image} size={40} />}
                        title={
                          <Text strong style={{ fontSize: '14px', color: '#1f2937' }}>
                            {item.name}
                          </Text>
                        }
                        description={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: '12px', color: '#6b7280' }}>
                              {item.sales} bán • ₫{item.revenue.toLocaleString()}
                            </Text>
                            <Text style={{ 
                              fontSize: '12px', 
                              color: item.growth > 0 ? '#10b981' : '#ef4444',
                              fontWeight: '600'
                            }}>
                              {item.growth > 0 ? '+' : ''}{item.growth}%
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Space>
    </motion.div>
  );
};

export default Dashboard;