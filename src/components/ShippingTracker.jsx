import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Timeline, 
  Avatar, 
  Typography, 
  Space, 
  Button, 
  Modal, 
  Descriptions, 
  Tag,
  Progress,
  Divider,
  Row,
  Col
} from 'antd';
import {
  TruckOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ShippingTracker = ({ orderId, orderStatus, onRefresh }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock tracking data - trong thực tế sẽ gọi API
  const mockTrackingData = {
    orderId: orderId,
    shipper: {
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      avatar: null
    },
    currentLocation: {
      address: '123 Đường ABC, Quận 1, TP.HCM',
      coordinates: [10.7769, 106.7009],
      timestamp: new Date().toISOString()
    },
    estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    progress: 75, // 75% completed
    timeline: [
      {
        id: 1,
        status: 'confirmed',
        title: 'Đơn hàng đã được xác nhận',
        description: 'Đơn hàng đã được xác nhận và đang được chuẩn bị',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        location: 'Kho hàng chính',
        completed: true
      },
      {
        id: 2,
        status: 'packed',
        title: 'Đơn hàng đã được đóng gói',
        description: 'Sản phẩm đã được đóng gói cẩn thận và sẵn sàng giao hàng',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        location: 'Kho hàng chính',
        completed: true
      },
      {
        id: 3,
        status: 'picked_up',
        title: 'Shipper đã nhận hàng',
        description: 'Shipper đã nhận hàng và bắt đầu giao hàng',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: 'Kho hàng chính',
        completed: true
      },
      {
        id: 4,
        status: 'in_transit',
        title: 'Đang giao hàng',
        description: 'Shipper đang trên đường giao hàng đến địa chỉ của bạn',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        location: 'Đang di chuyển',
        completed: true,
        current: true
      },
      {
        id: 5,
        status: 'delivered',
        title: 'Giao hàng thành công',
        description: 'Đơn hàng đã được giao thành công',
        timestamp: null,
        location: 'Địa chỉ giao hàng',
        completed: false
      }
    ]
  };

  useEffect(() => {
    if (orderStatus === 'shipped') {
      loadTrackingData();
    }
  }, [orderId, orderStatus]);

  const loadTrackingData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTrackingData(mockTrackingData);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'packed':
      case 'picked_up':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in_transit':
        return <TruckOutlined style={{ color: '#1890ff' }} />;
      case 'delivered':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusColor = (status, completed, current) => {
    if (completed) return 'green';
    if (current) return 'blue';
    return 'gray';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const getEstimatedTime = () => {
    if (!trackingData?.estimatedDelivery) return '';
    const now = new Date();
    const delivery = new Date(trackingData.estimatedDelivery);
    const diff = delivery - now;
    
    if (diff <= 0) return 'Đã đến giờ giao hàng';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `Còn ${hours} giờ ${minutes} phút`;
    } else {
      return `Còn ${minutes} phút`;
    }
  };

  if (orderStatus !== 'shipped' || !trackingData) {
    return null;
  }

  return (
    <div className="shipping-tracker">
      <Card 
        title={
          <Space>
            <TruckOutlined />
            <span>Theo dõi giao hàng</span>
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadTrackingData}
              loading={loading}
              size="small"
            >
              Làm mới
            </Button>
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => setModalVisible(true)}
              size="small"
            >
              Xem chi tiết
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        {/* Progress Bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>Tiến độ giao hàng</Text>
            <Text type="secondary">{trackingData.progress}%</Text>
          </div>
          <Progress 
            percent={trackingData.progress} 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            showInfo={false}
          />
        </div>

        {/* Current Status */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={64} 
                icon={<UserOutlined />}
                style={{ marginBottom: 8 }}
              />
              <div>
                <Text strong>{trackingData.shipper.name}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Shipper
                </Text>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Text strong>Thời gian dự kiến</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {getEstimatedTime()}
              </Text>
              <br />
              <br />
              <Text strong>Vị trí hiện tại</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {trackingData.currentLocation.address}
              </Text>
            </div>
          </Col>
        </Row>

        {/* Timeline */}
        <Timeline
          items={trackingData.timeline.map((item) => ({
            dot: getStatusIcon(item.status),
            color: getStatusColor(item.status, item.completed, item.current),
            children: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Text strong>{item.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.description}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      <EnvironmentOutlined style={{ marginRight: 4 }} />
                      {item.location}
                    </Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {formatTime(item.timestamp)}
                    </Text>
                    {item.current && (
                      <div>
                        <Tag color="blue" size="small">Hiện tại</Tag>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
          }))}
        />
      </Card>

      {/* Detailed Modal */}
      <Modal
        title={`Chi tiết theo dõi giao hàng - ${orderId}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <div>
          {/* Shipper Info */}
          <Card size="small" title="Thông tin shipper" style={{ marginBottom: 16 }}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Tên">
                <Space>
                  <Avatar icon={<UserOutlined />} size="small" />
                  {trackingData.shipper.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Space>
                  <PhoneOutlined />
                  {trackingData.shipper.phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color="blue">Đang giao hàng</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Current Location */}
          <Card size="small" title="Vị trí hiện tại" style={{ marginBottom: 16 }}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Địa chỉ">
                <Space>
                  <EnvironmentOutlined />
                  {trackingData.currentLocation.address}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {formatTime(trackingData.currentLocation.timestamp)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Delivery Info */}
          <Card size="small" title="Thông tin giao hàng">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Thời gian dự kiến">
                {formatTime(trackingData.estimatedDelivery)}
              </Descriptions.Item>
              <Descriptions.Item label="Tiến độ">
                <Progress percent={trackingData.progress} size="small" />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default ShippingTracker;
