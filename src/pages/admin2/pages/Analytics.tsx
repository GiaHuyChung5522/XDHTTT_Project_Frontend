import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Typography, Space, Select, DatePicker, Button, Tabs } from 'antd';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import { motion } from 'framer-motion';
import {
  BarChartOutlined,
  ShoppingOutlined,
  UserOutlined,
  TeamOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../../../services/adminService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Function to get analytics data from backend API
const getAnalyticsData = async () => {
  try {
    console.log('🔄 Loading analytics data from backend...');
    const dashboardStats = await adminService.getDashboardStats();
    const recentOrders = await adminService.getRecentOrders(100);
    
    console.log('📊 Analytics data loaded:', { dashboardStats, recentOrders });
    
    return {
      dashboardStats: dashboardStats.data || {},
      recentOrders: recentOrders.data || []
    };
  } catch (error) {
    console.error('❌ Error loading analytics data:', error);
    return {
      dashboardStats: {},
      recentOrders: []
    };
  }
};

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [dateRange, setDateRange] = useState<any>([dayjs().subtract(30, 'day'), dayjs()]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      console.error('❌ Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  // Mock data for charts
  const revenueData = [
    { month: 'Tháng 1', revenue: 12000000 },
    { month: 'Tháng 2', revenue: 15000000 },
    { month: 'Tháng 3', revenue: 18000000 },
    { month: 'Tháng 4', revenue: 22000000 },
    { month: 'Tháng 5', revenue: 25000000 },
    { month: 'Tháng 6', revenue: 28000000 },
  ];

  const userData = [
    { month: 'Tháng 1', users: 120 },
    { month: 'Tháng 2', users: 150 },
    { month: 'Tháng 3', users: 180 },
    { month: 'Tháng 4', users: 220 },
    { month: 'Tháng 5', users: 250 },
    { month: 'Tháng 6', users: 280 },
  ];

  const orderStatusData = [
    { type: 'Hoàn thành', value: 45 },
    { type: 'Đang xử lý', value: 25 },
    { type: 'Chờ xác nhận', value: 20 },
    { type: 'Đã hủy', value: 10 },
  ];

  const userDistributionData = [
    { type: 'Admin', value: 5 },
    { type: 'User', value: 95 },
  ];

  // Chart configurations
  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: '#6366f1',
    areaStyle: {
      fill: 'rgba(99, 102, 241, 0.2)',
    },
    yAxis: {
      label: {
        formatter: (value: string) => `${(parseInt(value) / 1000000).toFixed(0)}M`,
      },
    },
  };

  const userConfig = {
    data: userData,
    xField: 'month',
    yField: 'users',
    color: '#10b981',
  };

  const orderStatusConfig = {
    data: orderStatusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
    label: {
      type: 'outer',
      content: (item: any) => `${item.type}: ${item.value}%`,
    },
  };

  const userDistributionConfig = {
    data: userDistributionData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#6366f1', '#10b981'],
    label: {
      type: 'outer',
      content: (item: any) => `${item.type}: ${item.value}%`,
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Đang tải dữ liệu analytics...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                  📊 Analytics Dashboard
                </Title>
                <Text type="secondary">
                  Phân tích dữ liệu và thống kê hệ thống
                </Text>
              </div>
              <Space>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  style={{ width: 300 }}
                />
                <Button type="primary" icon={<DownloadOutlined />}>
                  Xuất báo cáo
                </Button>
                <Button icon={<PrinterOutlined />}>
                  In báo cáo
                </Button>
              </Space>
            </div>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]}>
          {[
            {
              title: 'Tổng doanh thu',
              value: analyticsData.dashboardStats?.totalRevenue || 0,
              prefix: '₫',
              color: '#10b981',
              icon: <BarChartOutlined />,
            },
            {
              title: 'Tổng đơn hàng',
              value: analyticsData.dashboardStats?.totalOrders || 0,
              color: '#3b82f6',
              icon: <ShoppingOutlined />,
            },
            {
              title: 'Tổng người dùng',
              value: analyticsData.dashboardStats?.totalUsers || 0,
              color: '#f59e0b',
              icon: <UserOutlined />,
            },
            {
              title: 'Đơn hàng chờ xử lý',
              value: analyticsData.dashboardStats?.pendingOrders || 0,
              color: '#ef4444',
              icon: <TeamOutlined />,
            },
          ].map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        {stat.title}
                      </Text>
                      <div style={{ marginTop: '8px' }}>
                        <Statistic
                          value={stat.value}
                          prefix={stat.prefix}
                          valueStyle={{ color: stat.color, fontSize: '24px', fontWeight: 'bold' }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${stat.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Charts */}
        <Tabs 
          defaultActiveKey="revenue" 
          style={{ background: 'white', borderRadius: '16px', padding: '24px' }}
          items={[
            {
              key: 'revenue',
              label: 'Doanh thu',
              children: (
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
                      styles={{ body: { padding: 0 } }}
                    >
                      <Area {...revenueConfig} height={300} />
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
                      styles={{ body: { padding: 0 } }}
                    >
                      <Pie {...orderStatusConfig} height={300} />
                    </Card>
                  </Col>
                </Row>
              )
            },
            {
              key: 'users',
              label: 'Người dùng',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={16}>
                    <Card
                      title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <UserOutlined style={{ marginRight: 8, color: '#3b82f6' }} />
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>Người dùng mới</span>
                        </div>
                      }
                      style={{ border: 'none', boxShadow: 'none' }}
                      styles={{ body: { padding: 0 } }}
                    >
                      <Column {...userConfig} height={300} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card
                      title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <TeamOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>Phân bố người dùng</span>
                        </div>
                      }
                      style={{ border: 'none', boxShadow: 'none' }}
                      styles={{ body: { padding: 0 } }}
                    >
                      <Pie {...userDistributionConfig} height={300} />
                    </Card>
                  </Col>
                </Row>
              )
            }
          ]}
        />
      </Space>
    </div>
  );
};

export default Analytics;