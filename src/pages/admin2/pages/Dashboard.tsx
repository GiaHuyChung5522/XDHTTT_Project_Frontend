import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Table, List, Avatar, Progress, Button } from 'antd';
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

const { Title, Text } = Typography;

// Function to get real stats from localStorage
const getRealStats = () => {
  try {
    const orders = localStorage.getItem('orders');
    const orderData = orders ? JSON.parse(orders) : [];
    
    const cart = localStorage.getItem('cart');
    const cartData = cart ? JSON.parse(cart) : [];
    
    const users = localStorage.getItem('users');
    const userData = users ? JSON.parse(users) : [];
    
    const totalRevenue = orderData
      .filter((order: any) => order.status === 'delivered')
      .reduce((sum: number, order: any) => sum + order.total, 0);
    
    const pendingOrders = orderData.filter((order: any) => order.status === 'pending').length;
    const totalOrders = orderData.length;
    const uniqueCustomers = new Set(orderData.map((order: any) => order.customerInfo?.phone)).size;
    
    // Calculate total products in cart (active users)
    const totalProductsInCart = cartData.reduce((sum: number, item: any) => sum + item.quantity, 0);
    
    return {
      totalRevenue,
      pendingOrders,
      totalOrders,
      uniqueCustomers,
      totalProductsInCart,
      totalUsers: userData.length
    };
  } catch (error) {
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

const realStats = getRealStats();

// Real stats with actual data
const realStatsData = [
  {
    title: 'Tổng doanh thu',
    value: realStats.totalRevenue,
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
    value: realStats.pendingOrders,
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
    value: realStats.totalOrders,
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
    title: 'Tổng người dùng',
    value: realStats.totalUsers,
    prefix: '',
    suffix: '',
    precision: 0,
    trend: 'up',
    trendValue: 15.7,
    icon: <UserOutlined />,
    color: '#8b5cf6', // Violet
    bgColor: '#f5f3ff',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
];

// Function to get real orders from localStorage
const getRealOrders = () => {
  try {
    const orders = localStorage.getItem('orders');
    const orderData = orders ? JSON.parse(orders) : [];
    
    return orderData.slice(0, 5).map((order: any, index: number) => ({
      key: index + 1,
      orderNumber: order.orderId,
      customer: order.customerInfo?.name || 'Khách hàng',
      amount: order.total,
      status: order.status === 'pending' ? 'Chờ xác nhận' :
              order.status === 'confirmed' ? 'Đã xác nhận' :
              order.status === 'shipped' ? 'Đang giao hàng' :
              order.status === 'delivered' ? 'Đã giao hàng' : 'Đã hủy',
      paymentStatus: order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                    order.paymentStatus === 'pending' ? 'Chờ thanh toán' :
                    order.paymentStatus === 'failed' ? 'Thanh toán thất bại' : 'Chờ thanh toán',
      paymentMethod: order.paymentMethod === 'cash' ? 'Tiền mặt' :
                    order.paymentMethod === 'bank' ? 'Chuyển khoản' :
                    order.paymentMethod === 'card' ? 'Thẻ tín dụng' : 'Tiền mặt',
      date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
      statusColor: order.status === 'pending' ? '#f59e0b' :
                   order.status === 'confirmed' ? '#3b82f6' :
                   order.status === 'shipped' ? '#8b5cf6' :
                   order.status === 'delivered' ? '#10b981' : '#ef4444',
      statusBg: order.status === 'pending' ? '#fffbeb' :
                order.status === 'confirmed' ? '#eff6ff' :
                order.status === 'shipped' ? '#f5f3ff' :
                order.status === 'delivered' ? '#ecfdf5' : '#fef2f2',
      paymentStatusColor: order.paymentStatus === 'paid' ? '#10b981' :
                         order.paymentStatus === 'pending' ? '#f59e0b' :
                         order.paymentStatus === 'failed' ? '#ef4444' : '#f59e0b',
    }));
  } catch (error) {
    return [];
  }
};

const mockOrders = getRealOrders();

const mockTopProducts = [
  {
    name: 'Áo sơ mi nam trắng',
    sales: 156,
    revenue: 15600000,
    image: 'https://via.placeholder.com/40x40?text=Áo',
    growth: 12,
    color: '#6366f1',
  },
  {
    name: 'Quần jeans nữ',
    sales: 134,
    revenue: 13400000,
    image: 'https://via.placeholder.com/40x40?text=Quần',
    growth: 8,
    color: '#10b981',
  },
  {
    name: 'Váy dạ hội',
    sales: 89,
    revenue: 22250000,
    image: 'https://via.placeholder.com/40x40?text=Váy',
    growth: -3,
    color: '#8b5cf6',
  },
  {
    name: 'Áo khoác nam',
    sales: 76,
    revenue: 19000000,
    image: 'https://via.placeholder.com/40x40?text=Áo',
    growth: 15,
    color: '#f59e0b',
  },
];

// Chart data
const revenueData = [
  { month: 'T1', revenue: 45000000 },
  { month: 'T2', revenue: 52000000 },
  { month: 'T3', revenue: 48000000 },
  { month: 'T4', revenue: 61000000 },
  { month: 'T5', revenue: 55000000 },
  { month: 'T6', revenue: 67000000 },
  { month: 'T7', revenue: 72000000 },
  { month: 'T8', revenue: 68000000 },
  { month: 'T9', revenue: 74000000 },
  { month: 'T10', revenue: 78000000 },
  { month: 'T11', revenue: 82000000 },
  { month: 'T12', revenue: 89000000 },
];

const categoryData = [
  { category: 'Áo sơ mi', sales: 4500000, type: 'sales' },
  { category: 'Quần jeans', sales: 3800000, type: 'sales' },
  { category: 'Váy', sales: 5200000, type: 'sales' },
  { category: 'Áo khoác', sales: 2900000, type: 'sales' },
  { category: 'Phụ kiện', sales: 1600000, type: 'sales' },
];

const orderStatusData = [
  { type: 'Hoàn thành', value: 68, color: '#10b981' },
  { type: 'Đang xử lý', value: 18, color: '#f59e0b' },
  { type: 'Đang giao', value: 10, color: '#3b82f6' },
  { type: 'Đã hủy', value: 4, color: '#ef4444' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus: string, record: any) => (
        <div>
          <span style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '500',
            backgroundColor: record.paymentStatusColor + '20',
            color: record.paymentStatusColor,
            display: 'inline-block',
            marginBottom: '2px',
          }}>
            {paymentStatus}
          </span>
          <br />
          <Text type="secondary" style={{ fontSize: '10px' }}>
            {record.paymentMethod}
          </Text>
        </div>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: '13px' }}>{date}</Text>
      ),
    },
  ];

  // Chart configs with modern colors
  const revenueChartConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: '#6366f1',
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#6366f1',
        stroke: '#ffffff',
        lineWidth: 2,
      },
    },
    areaStyle: {
      fill: 'linear-gradient(180deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)',
    },
    lineStyle: {
      lineWidth: 3,
    },
    yAxis: {
      label: {
        formatter: (value: string) => `${(parseInt(value) / 1000000).toFixed(0)}M`,
      },
    },
  };

  const categoryChartConfig = {
    data: categoryData,
    xField: 'sales',
    yField: 'category',
    color: '#10b981',
    label: {
      position: 'right' as const,
      style: {
        fill: '#374151',
        opacity: 0.9,
        fontWeight: '600',
        fontSize: 12,
      },
    },
    barStyle: {
      borderRadius: [0, 4, 4, 0],
    },
  };

  const pieChartConfig = {
    data: orderStatusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
      style: {
        fontSize: 12,
        fontWeight: '500',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

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
                  Chào mừng trở lại! Đây là tổng quan về hoạt động kinh doanh của bạn.
                </Text>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/admin2/products')}
                  style={{ borderRadius: '8px' }}
                >
                  Thêm sản phẩm
                </Button>
                <Button 
                  icon={<SettingOutlined />}
                  onClick={() => navigate('/admin2/settings')}
                  style={{ borderRadius: '8px' }}
                >
                  Cài đặt
                </Button>
              </Space>
            </div>
            
            {/* Quick Actions */}
            <Card 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="text" 
                    icon={<TeamOutlined />}
                    onClick={() => navigate('/admin2/customers')}
                    style={{ 
                      color: 'white', 
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      width: '100%',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>Quản lý khách hàng</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Xem và quản lý người dùng</div>
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="text" 
                    icon={<ShoppingCartOutlined />}
                    onClick={() => navigate('/admin2/orders')}
                    style={{ 
                      color: 'white', 
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      width: '100%',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>Quản lý đơn hàng</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Xử lý và theo dõi đơn hàng</div>
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="text" 
                    icon={<TagOutlined />}
                    onClick={() => navigate('/admin2/products')}
                    style={{ 
                      color: 'white', 
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      width: '100%',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>Quản lý sản phẩm</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Thêm, sửa, xóa sản phẩm</div>
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="text" 
                    icon={<FileTextOutlined />}
                    onClick={() => navigate('/admin2/analytics')}
                    style={{ 
                      color: 'white', 
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      width: '100%',
                      height: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>Báo cáo & Phân tích</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Xem báo cáo chi tiết</div>
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]}>
          {realStatsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
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
                            background: stat.gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            {stat.prefix}
                            <CountUp 
                              end={stat.value} 
                              duration={2}
                              separator=","
                            />
                            {stat.suffix}
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
                        so với tháng trước
                      </Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Charts Row */}
        <Row gutter={[24, 24]}>
          {/* Revenue Chart */}
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
                <Line {...revenueChartConfig} height={300} />
              </Card>
            </motion.div>
          </Col>

          {/* Order Status */}
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
                <Pie {...pieChartConfig} height={300} />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Bottom Row */}
        <Row gutter={[24, 24]}>
          {/* Recent Orders */}
          <Col xs={24} lg={16}>
            <motion.div variants={itemVariants}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ClockCircleOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>Đơn hàng gần đây</span>
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
                  dataSource={mockOrders}
                  pagination={false}
                  size="middle"
                />
              </Card>
            </motion.div>
          </Col>

          {/* Top Products */}
          <Col xs={24} lg={8}>
            <motion.div variants={itemVariants}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TagOutlined style={{ marginRight: 8, color: '#8b5cf6' }} />
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
                    <List.Item style={{ padding: '12px 0', borderBottom: index === mockTopProducts.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            size={40} 
                            style={{ 
                              background: item.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {item.name.charAt(0)}
                          </Avatar>
                        }
                        title={
                          <Text strong style={{ fontSize: '14px', color: '#1f2937' }}>
                            {item.name}
                          </Text>
                        }
                        description={
                          <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {item.sales} đã bán • ₫{item.revenue.toLocaleString()}
                            </Text>
                            <div style={{ marginTop: '4px' }}>
                              <Text style={{ 
                                color: item.growth >= 0 ? '#10b981' : '#ef4444',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}>
                                {item.growth >= 0 ? '+' : ''}{item.growth}%
                              </Text>
                            </div>
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