import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Table, List, Avatar } from 'antd';
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
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Mock data with subtle colors
const mockStats = [
  {
    title: 'Tổng doanh thu',
    value: 234500000,
    prefix: '₫',
    suffix: '',
    precision: 0,
    trend: 'up',
    trendValue: 12.5,
    icon: <DollarOutlined />,
    color: '#3b82f6', // Blue
    bgColor: '#eff6ff',
  },
  {
    title: 'Đơn hàng mới',
    value: 1234,
    prefix: '',
    suffix: '',
    precision: 0,
    trend: 'up',
    trendValue: 8.3,
    icon: <ShoppingCartOutlined />,
    color: '#10b981', // Green
    bgColor: '#f0fdf4',
  },
  {
    title: 'Khách hàng',
    value: 5678,
    prefix: '',
    suffix: '',
    precision: 0,
    trend: 'down',
    trendValue: -2.1,
    icon: <UserOutlined />,
    color: '#8b5cf6', // Purple
    bgColor: '#faf5ff',
  },
  {
    title: 'Sản phẩm',
    value: 456,
    prefix: '',
    suffix: '',
    precision: 0,
    trend: 'up',
    trendValue: 15.7,
    icon: <TagOutlined />,
    color: '#f59e0b', // Orange
    bgColor: '#fffbeb',
  },
];

const mockOrders = [
  {
    key: '1',
    orderNumber: '#ORD-001',
    customer: 'Nguyễn Văn A',
    amount: 2500000,
    status: 'Đang xử lý',
    date: '2024-12-09',
  },
  {
    key: '2',
    orderNumber: '#ORD-002',
    customer: 'Trần Thị B',
    amount: 1800000,
    status: 'Đã giao hàng',
    date: '2024-12-09',
  },
  {
    key: '3',
    orderNumber: '#ORD-003',
    customer: 'Lê Văn C',
    amount: 3200000,
    status: 'Đã xác nhận',
    date: '2024-12-08',
  },
  {
    key: '4',
    orderNumber: '#ORD-004',
    customer: 'Phạm Thị D',
    amount: 1500000,
    status: 'Đang giao hàng',
    date: '2024-12-08',
  },
];

const mockTopProducts = [
  {
    name: 'Áo sơ mi nam trắng',
    sales: 156,
    revenue: 15600000,
    image: 'https://via.placeholder.com/40x40?text=Áo',
    growth: 12,
  },
  {
    name: 'Quần jeans nữ',
    sales: 134,
    revenue: 13400000,
    image: 'https://via.placeholder.com/40x40?text=Quần',
    growth: 8,
  },
  {
    name: 'Váy dạ hội',
    sales: 89,
    revenue: 22250000,
    image: 'https://via.placeholder.com/40x40?text=Váy',
    growth: -3,
  },
  {
    name: 'Áo khoác nam',
    sales: 76,
    revenue: 19000000,
    image: 'https://via.placeholder.com/40x40?text=Áo',
    growth: 15,
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
  { type: 'Hoàn thành', value: 68 },
  { type: 'Đang xử lý', value: 18 },
  { type: 'Đang giao', value: 10 },
  { type: 'Đã hủy', value: 4 },
];

const Dashboard: React.FC = () => {
  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => (
        <Text strong style={{ color: '#3b82f6' }}>{text}</Text>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Giá trị',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#059669' }}>
          ₫{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: { [key: string]: string } = {
          'Đang xử lý': '#f59e0b',
          'Đã xác nhận': '#3b82f6',
          'Đang giao hàng': '#8b5cf6',
          'Đã giao hàng': '#10b981',
        };
        return (
          <span style={{ 
            color: colors[status] || '#6b7280',
            fontWeight: '500',
          }}>
            {status}
          </span>
        );
      },
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <Text type="secondary">{date}</Text>
      ),
    },
  ];

  // Chart configs with subtle colors
  const revenueChartConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: '#3b82f6',
    point: {
      size: 4,
      shape: 'circle',
    },
    areaStyle: {
      fill: 'rgba(59,130,246,0.12)',
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
        fill: '#111827',
        opacity: 0.9,
        fontWeight: '500',
      },
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
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Stats Cards */}
        <Row gutter={[24, 24]}>
          {mockStats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div variants={itemVariants}>
                <Card 
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    height: '140px',
                  }}
                  styles={{ body: { padding: '20px', height: '100%' } }}
                >
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Text style={{ 
                          color: '#6b7280', 
                          fontSize: '14px', 
                          fontWeight: '500',
                          marginBottom: '8px',
                          display: 'block',
                        }}>
                          {stat.title}
                        </Text>
                        <div>
                          <Text style={{ 
                            color: '#111827', 
                            fontSize: '24px', 
                            fontWeight: '700',
                            lineHeight: 1,
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
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {React.cloneElement(stat.icon, { 
                          style: { fontSize: '18px', color: stat.color }
                        })}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {stat.trend === 'up' ? (
                        <RiseOutlined style={{ 
                          color: '#10b981', 
                          marginRight: 6, 
                          fontSize: '14px' 
                        }} />
                      ) : (
                        <FallOutlined style={{ 
                          color: '#ef4444', 
                          marginRight: 6, 
                          fontSize: '14px' 
                        }} />
                      )}
                      <Text style={{ 
                        color: stat.trend === 'up' ? '#10b981' : '#ef4444', 
                        fontSize: '13px', 
                        fontWeight: '500' 
                      }}>
                        {Math.abs(stat.trendValue)}%
                      </Text>
                      <Text style={{ 
                        color: '#6b7280', 
                        fontSize: '13px',
                        marginLeft: '4px',
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
          <Col xs={24} lg={16}>
            <motion.div variants={itemVariants}>
              <Card 
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#3b82f6' }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      Doanh thu theo tháng
                    </span>
                  </Space>
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
                styles={{ body: { padding: '20px' } }}
              >
                <Line {...revenueChartConfig} height={300} />
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} lg={8}>
            <motion.div variants={itemVariants}>
              <Card 
                title={
                  <Space>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#f59e0b',
                    }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      Trạng thái đơn hàng
                    </span>
                  </Space>
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
                styles={{ body: { padding: '20px' } }}
              >
                <Pie {...pieChartConfig} height={300} />
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Recent Orders */}
          <Col xs={24} lg={16}>
            <motion.div variants={itemVariants}>
              <Card 
                title={
                  <Space>
                    <ShoppingCartOutlined style={{ color: '#3b82f6' }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      Đơn hàng gần đây
                    </span>
                  </Space>
                }
                extra={
                  <a href="#" style={{ 
                    color: '#3b82f6',
                    fontWeight: '500',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}>
                    Xem tất cả →
                  </a>
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
                styles={{ body: { padding: '20px' } }}
              >
                <Table
                  columns={orderColumns}
                  dataSource={mockOrders}
                  pagination={false}
                  size="small"
                />
              </Card>
            </motion.div>
          </Col>

          {/* Top Products */}
          <Col xs={24} lg={8}>
            <motion.div variants={itemVariants}>
              <Card 
                title={
                  <Space>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      background: '#10b981',
                    }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      Sản phẩm bán chạy
                    </span>
                  </Space>
                }
                extra={
                  <a href="#" style={{ 
                    color: '#3b82f6',
                    fontWeight: '500',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}>
                    Xem tất cả →
                  </a>
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={mockTopProducts}
                  size="small"
                  renderItem={(item, index) => (
                    <List.Item style={{ 
                      padding: '12px 0',
                      borderBottom: index === mockTopProducts.length - 1 ? 'none' : '1px solid #f3f4f6'
                    }}>
                      <List.Item.Meta
                        avatar={
                          <div style={{ position: 'relative' }}>
                            <Avatar src={item.image} shape="square" size={44} />
                            <div style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: index === 0 ? '#f59e0b' : index === 1 ? '#10b981' : '#3b82f6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              color: 'white',
                              fontWeight: '600',
                            }}>
                              {index + 1}
                            </div>
                          </div>
                        }
                        title={
                          <div>
                            <Text strong style={{ fontSize: '14px', color: '#111827' }}>
                              {item.name}
                            </Text>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                              {item.growth > 0 ? (
                                <ArrowUpOutlined style={{ 
                                  color: '#10b981', 
                                  fontSize: '11px', 
                                  marginRight: '4px' 
                                }} />
                              ) : (
                                <ArrowDownOutlined style={{ 
                                  color: '#ef4444', 
                                  fontSize: '11px', 
                                  marginRight: '4px' 
                                }} />
                              )}
                              <Text style={{ 
                                fontSize: '11px',
                                color: item.growth > 0 ? '#10b981' : '#ef4444',
                                fontWeight: '500'
                              }}>
                                {Math.abs(item.growth)}%
                              </Text>
                            </div>
                          </div>
                        }
                        description={
                          <Space direction="vertical" size={2}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Đã bán: {item.sales} sản phẩm
                            </Text>
                            <Text strong style={{ color: '#059669', fontSize: '13px' }}>
                              ₫{item.revenue.toLocaleString()}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Category Performance */}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <motion.div variants={itemVariants}>
              <Card 
                title={
                  <Space>
                    <TagOutlined style={{ color: '#8b5cf6' }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                      Hiệu suất theo danh mục
                    </span>
                  </Space>
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Column {...categoryChartConfig} height={300} />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Space>
    </motion.div>
  );
};

export default Dashboard; 