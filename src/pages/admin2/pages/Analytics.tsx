import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Space,
  Table,
  List,
  Avatar,
  Progress,
  Button,
  DatePicker,
  Select,
  Tabs,
  Spin,
  Alert,
} from 'antd';
import { Column, Line, Pie, Area } from '@ant-design/charts';
import { motion, type Variants } from 'framer-motion';
import CountUp from 'react-countup';
import { 
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
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../../../services/adminService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// Function to get analytics data from backend API
const getAnalyticsData = async () => {
  try {
    console.log('🔄 Loading analytics data from backend...');
    
    // Get dashboard stats
    const dashboardStats = await adminService.getDashboardStats();
    
    // Get orders data
    const ordersResponse = await adminService.getRecentOrders(100);
    const orderData = ordersResponse.data || [];
    
    // Get users data
    const usersResponse = await adminService.getUsers();
    const userData = usersResponse.data?.users || [];
    
    console.log('📊 Analytics data loaded:', {
      dashboardStats,
      ordersCount: orderData.length,
      usersCount: userData.length
    });
    
    // Calculate metrics from real data
    const totalRevenue = dashboardStats.data?.totalRevenue || 0;
    const totalOrders = dashboardStats.data?.totalOrders || orderData.length;
    const totalUsers = dashboardStats.data?.totalUsers || userData.length;
    
    // Calculate pending and delivered orders
    const pendingOrders = orderData.filter((order: any) => 
      order.status === 'pending' || order.status === 'Chờ xác nhận'
    ).length;
    const deliveredOrders = orderData.filter((order: any) => 
      order.status === 'delivered' || order.status === 'Đã giao'
    ).length;
    
    // Revenue by month (mock data for now)
    const revenueData = [
      { month: 'Th1', revenue: totalRevenue * 0.8 },
      { month: 'Th2', revenue: totalRevenue * 0.9 },
      { month: 'Th3', revenue: totalRevenue * 1.1 },
      { month: 'Th4', revenue: totalRevenue * 0.95 },
      { month: 'Th5', revenue: totalRevenue * 1.2 },
      { month: 'Th6', revenue: totalRevenue },
    ];
    
    // Orders by status
    const orderStatusData = [
      { type: 'Hoàn thành', value: deliveredOrders, color: '#10b981' },
      { type: 'Đang xử lý', value: pendingOrders, color: '#f59e0b' },
      { type: 'Đang giao', value: orderData.filter((o: any) => 
        o.status === 'shipped' || o.status === 'Đang giao'
      ).length, color: '#3b82f6' },
      { type: 'Đã hủy', value: orderData.filter((o: any) => 
        o.status === 'cancelled' || o.status === 'Đã hủy'
      ).length, color: '#ef4444' },
    ];
    
    // Top products (mock data for now)
    const topProducts = [
      { name: 'Laptop Acer Aspire', sales: 15 },
      { name: 'Laptop Dell Inspiron', sales: 12 },
      { name: 'Laptop HP Pavilion', sales: 10 },
      { name: 'Laptop Lenovo ThinkPad', sales: 8 },
      { name: 'Laptop ASUS ROG', sales: 6 },
    ];
    
    // User growth (mock data for now)
    const userGrowthData = [
      { month: 'Th1', users: Math.floor(totalUsers * 0.7) },
      { month: 'Th2', users: Math.floor(totalUsers * 0.8) },
      { month: 'Th3', users: Math.floor(totalUsers * 0.85) },
      { month: 'Th4', users: Math.floor(totalUsers * 0.9) },
      { month: 'Th5', users: Math.floor(totalUsers * 0.95) },
      { month: 'Th6', users: totalUsers },
    ];
    
    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalUsers,
      revenueData,
      orderStatusData,
      topProducts,
      userGrowthData,
    };
  } catch (error) {
    console.error('❌ Error loading analytics data:', error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      totalUsers: 0,
      revenueData: [],
      orderStatusData: [],
      topProducts: [],
      userGrowthData: [],
    };
  }
};

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalUsers: number;
  revenueData: Array<{ month: string; revenue: number }>;
  orderStatusData: Array<{ type: string; value: number; color: string }>;
  topProducts: Array<{ name: string; sales: number }>;
  userGrowthData: Array<{ month: string; users: number }>;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalUsers: 0,
    revenueData: [],
    orderStatusData: [],
    topProducts: [],
    userGrowthData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>([dayjs().subtract(30, 'day'), dayjs()]);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAnalyticsData();
        setAnalyticsData(data);
      } catch (err) {
        setError('Không thể tải dữ liệu phân tích');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  const stats = [
    {
      title: 'Tổng doanh thu',
      value: analyticsData.totalRevenue,
      prefix: '₫',
      trend: 'up',
      trendValue: 12.5,
      icon: <DollarOutlined />,
      color: '#6366f1',
      bgColor: '#eef2ff',
    },
    {
      title: 'Tổng đơn hàng',
      value: analyticsData.totalOrders,
      trend: 'up',
      trendValue: 8.3,
      icon: <ShoppingCartOutlined />,
      color: '#10b981',
      bgColor: '#ecfdf5',
    },
    {
      title: 'Đơn hàng hoàn thành',
      value: analyticsData.deliveredOrders,
      trend: 'up',
      trendValue: 15.7,
      icon: <CheckCircleOutlined />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
    },
    {
      title: 'Tổng người dùng',
      value: analyticsData.totalUsers,
      trend: 'up',
      trendValue: 20.1,
      icon: <UserOutlined />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
  ];

  // Chart configurations
  const revenueChartConfig = {
    data: analyticsData.revenueData,
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

  const orderStatusChartConfig = {
    data: analyticsData.orderStatusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
  };

  const userGrowthChartConfig = {
    data: analyticsData.userGrowthData,
    xField: 'month',
    yField: 'users',
    color: '#10b981',
    point: {
      size: 5,
      shape: 'circle',
    },
  };

  const topProductsColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Text strong style={{ color: '#1f2937' }}>{text}</Text>
      ),
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'sales',
      key: 'sales',
      render: (value: number) => (
        <Text style={{ color: '#059669', fontWeight: '600' }}>{value}</Text>
      ),
    },
    {
      title: 'Tỷ lệ',
      key: 'percentage',
      render: (record: { name: string; sales: number }) => {
        const total = analyticsData.topProducts.reduce((sum, item) => sum + item.sales, 0);
        const percentage = ((record.sales / total) * 100).toFixed(1);
        return (
          <Progress 
            percent={parseFloat(percentage)} 
            size="small" 
            strokeColor="#10b981"
            showInfo={false}
          />
        );
      },
    },
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>Đang tải dữ liệu phân tích...</Text>
          </div>
        </div>
      ) : error ? (
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1f2937', fontWeight: '700' }}>
                  Báo cáo & Phân tích
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Phân tích chi tiết về hoạt động kinh doanh và hiệu suất
                </Text>
              </div>
              <Space>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  style={{ borderRadius: '8px' }}
                />
                <Select
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  style={{ width: 120, borderRadius: '8px' }}
                >
                  <Option value="7days">7 ngày</Option>
                  <Option value="30days">30 ngày</Option>
                  <Option value="90days">90 ngày</Option>
                  <Option value="1year">1 năm</Option>
                </Select>
                <Button 
                  icon={<DownloadOutlined />}
                  style={{ borderRadius: '8px' }}
                >
                  Xuất báo cáo
                </Button>
                <Button 
                  icon={<PrinterOutlined />}
                  style={{ borderRadius: '8px' }}
                >
                  In báo cáo
                </Button>
                </Space>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]}>
          {stats.map((stat, index) => (
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

        {/* Charts */}
        <Tabs defaultActiveKey="revenue" style={{ background: 'white', borderRadius: '16px', padding: '24px' }}>
          <TabPane tab="Doanh thu" key="revenue">
        <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
            <Card
              title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <BarChartOutlined style={{ marginRight: 8, color: '#6366f1' }} />
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>Doanh thu theo tháng</span>
                    </div>
                  }
                  style={{ border: 'none', boxShadow: 'none' }}
                  bodyStyle={{ padding: 0 }}
                >
                  <Area {...revenueChartConfig} height={300} />
                </Card>
                </Col>
              <Col xs={24} lg={8}>
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ShoppingOutlined style={{ marginRight: 8, color: '#10b981' }} />
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>Trạng thái đơn hàng</span>
                    </div>
                  }
                  style={{ border: 'none', boxShadow: 'none' }}
                  bodyStyle={{ padding: 0 }}
                >
                  <Pie {...orderStatusChartConfig} height={300} />
                </Card>
                </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="Người dùng" key="users">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <UserOutlined style={{ marginRight: 8, color: '#10b981' }} />
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>Tăng trưởng người dùng</span>
                    </div>
                  }
                  style={{ border: 'none', boxShadow: 'none' }}
                  bodyStyle={{ padding: 0 }}
                >
                  <Line {...userGrowthChartConfig} height={300} />
                </Card>
                </Col>
              <Col xs={24} lg={8}>
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <TagOutlined style={{ marginRight: 8, color: '#8b5cf6' }} />
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>Sản phẩm bán chạy</span>
                    </div>
                  }
                  style={{ border: 'none', boxShadow: 'none' }}
                  bodyStyle={{ padding: 0 }}
                >
                  <Table
                    columns={topProductsColumns}
                    dataSource={analyticsData.topProducts}
                    pagination={false}
                    size="small"
                    showHeader={false}
                  />
            </Card>
          </Col>
        </Row>
          </TabPane>
        </Tabs>
        </Space>
      )}
    </motion.div>
  );
};

export default Analytics; 