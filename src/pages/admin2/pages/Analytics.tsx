import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { 
  BarChartOutlined, 
  DollarOutlined, 
  ShoppingCartOutlined, 
  UserOutlined,
  RiseOutlined,
  EyeOutlined,
  HeartOutlined,
  StarOutlined 
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const Analytics: React.FC = () => {
  // Mock data for charts
  const revenueData = [
    { month: 'T1', revenue: 45000000, orders: 234 },
    { month: 'T2', revenue: 52000000, orders: 267 },
    { month: 'T3', revenue: 48000000, orders: 245 },
    { month: 'T4', revenue: 61000000, orders: 312 },
    { month: 'T5', revenue: 55000000, orders: 289 },
    { month: 'T6', revenue: 67000000, orders: 356 },
    { month: 'T7', revenue: 72000000, orders: 378 },
    { month: 'T8', revenue: 68000000, orders: 334 },
    { month: 'T9', revenue: 74000000, orders: 389 },
    { month: 'T10', revenue: 78000000, orders: 412 },
    { month: 'T11', revenue: 82000000, orders: 445 },
    { month: 'T12', revenue: 89000000, orders: 487 },
  ];

  const categoryData = [
    { category: 'Áo nam', revenue: 25000000 },
    { category: 'Áo nữ', revenue: 32000000 },
    { category: 'Quần jeans', revenue: 18000000 },
    { category: 'Váy đầm', revenue: 15000000 },
    { category: 'Phụ kiện', revenue: 12000000 },
    { category: 'Giày dép', revenue: 20000000 },
  ];

  const trafficData = [
    { source: 'Tìm kiếm Google', percentage: 45, visitors: 15678 },
    { source: 'Facebook', percentage: 25, visitors: 8723 },
    { source: 'Trực tiếp', percentage: 15, visitors: 5234 },
    { source: 'Email', percentage: 10, visitors: 3489 },
    { source: 'Khác', percentage: 5, visitors: 1743 },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    smooth: true,
    color: '#3b82f6',
    point: { size: 4, shape: 'circle' },
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#3b82f6 1:#3b82f6',
      fillOpacity: 0.1,
    },
  };

  const categoryConfig = {
    data: categoryData,
    xField: 'category',
    yField: 'revenue',
    color: '#10b981',
    label: {
      position: 'middle' as const,
      style: { fill: '#FFFFFF', opacity: 0.8, fontWeight: '500' },
    },
  };

  const trafficConfig = {
    data: trafficData,
    angleField: 'percentage',
    colorField: 'source',
    radius: 0.8,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
    label: {
      type: 'outer',
      content: '{name}: {percentage}%',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* KPI Cards */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Doanh thu tháng này"
                value={89000000}
                precision={0}
                prefix="₫"
                suffix={
                  <span style={{ color: '#10b981', fontSize: '12px' }}>
                    <RiseOutlined /> +12.5%
                  </span>
                }
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Đơn hàng mới"
                value={487}
                prefix={<ShoppingCartOutlined style={{ color: '#3b82f6' }} />}
                suffix={
                  <span style={{ color: '#10b981', fontSize: '12px' }}>
                    <RiseOutlined /> +8.3%
                  </span>
                }
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Lượt truy cập"
                value={34867}
                prefix={<EyeOutlined style={{ color: '#8b5cf6' }} />}
                suffix={
                  <span style={{ color: '#10b981', fontSize: '12px' }}>
                    <RiseOutlined /> +15.2%
                  </span>
                }
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <Statistic
                title="Tỷ lệ chuyển đổi"
                value={3.4}
                precision={1}
                suffix="%"
                prefix={<StarOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: '700' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Row 1 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    Doanh thu theo tháng
                  </span>
                </Space>
              }
              style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Line {...revenueConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
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
                    Nguồn traffic
                  </span>
                </Space>
              }
              style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Pie {...trafficConfig} height={300} />
            </Card>
          </Col>
        </Row>

        {/* Charts Row 2 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <DollarOutlined style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    Doanh thu theo danh mục
                  </span>
                </Space>
              }
              style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Column {...categoryConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <UserOutlined style={{ color: '#8b5cf6' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    Thống kê khách hàng
                  </span>
                </Space>
              }
              style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ padding: '20px 0' }}>
                <Row gutter={[16, 24]}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: '700', 
                        color: '#3b82f6',
                        marginBottom: '8px' 
                      }}>
                        5,678
                      </div>
                      <Text type="secondary">Tổng khách hàng</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: '700', 
                        color: '#10b981',
                        marginBottom: '8px' 
                      }}>
                        234
                      </div>
                      <Text type="secondary">Khách hàng mới</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: '700', 
                        color: '#f59e0b',
                        marginBottom: '8px' 
                      }}>
                        1,456
                      </div>
                      <Text type="secondary">Khách VIP</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: '700', 
                        color: '#8b5cf6',
                        marginBottom: '8px' 
                      }}>
                        67%
                      </div>
                      <Text type="secondary">Tỷ lệ quay lại</Text>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Performance Metrics */}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card
              title={
                <Space>
                  <RiseOutlined style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    Chỉ số hiệu suất
                  </span>
                </Space>
              }
              style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <HeartOutlined style={{ fontSize: '24px', color: '#ef4444', marginBottom: '12px' }} />
                    <Title level={4} style={{ margin: '8px 0 4px', color: '#111827' }}>2.3M</Title>
                    <Text type="secondary">Tổng lượt thích</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text style={{ color: '#10b981', fontSize: '12px' }}>
                        <RiseOutlined /> +18.5%
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <EyeOutlined style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '12px' }} />
                    <Title level={4} style={{ margin: '8px 0 4px', color: '#111827' }}>156K</Title>
                    <Text type="secondary">Pageviews</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text style={{ color: '#10b981', fontSize: '12px' }}>
                        <RiseOutlined /> +12.3%
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <StarOutlined style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '12px' }} />
                    <Title level={4} style={{ margin: '8px 0 4px', color: '#111827' }}>4.8</Title>
                    <Text type="secondary">Đánh giá trung bình</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text style={{ color: '#10b981', fontSize: '12px' }}>
                        <RiseOutlined /> +0.3
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <ShoppingCartOutlined style={{ fontSize: '24px', color: '#8b5cf6', marginBottom: '12px' }} />
                    <Title level={4} style={{ margin: '8px 0 4px', color: '#111827' }}>₫2.1M</Title>
                    <Text type="secondary">Giá trị đơn TB</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text style={{ color: '#10b981', fontSize: '12px' }}>
                        <RiseOutlined /> +5.7%
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Space>
    </motion.div>
  );
};

export default Analytics; 