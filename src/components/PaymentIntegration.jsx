// components/PaymentIntegration.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Steps, Alert, Spin, Typography, Space, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { paymentService } from '../services/paymentService';

const { Title, Text } = Typography;
const { Step } = Steps;

const PaymentIntegration = ({ 
  visible, 
  onClose, 
  orderData, 
  onPaymentSuccess, 
  onPaymentFailure 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    {
      title: 'Xác nhận đơn hàng',
      description: 'Kiểm tra thông tin đơn hàng'
    },
    {
      title: 'Chọn phương thức thanh toán',
      description: 'Chọn cách thức thanh toán phù hợp'
    },
    {
      title: 'Thanh toán',
      description: 'Thực hiện thanh toán'
    },
    {
      title: 'Hoàn thành',
      description: 'Đơn hàng đã được xử lý'
    }
  ];

  useEffect(() => {
    if (visible && orderData) {
      setCurrentStep(0);
      setPaymentUrl(null);
      setPaymentStatus(null);
      setError(null);
    }
  }, [visible, orderData]);

  const handlePaymentMethodSelect = async (method) => {
    if (!orderData) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Processing payment for method:', method);

      if (method === 'VNPAY') {
        // Tạo VNPay payment URL
        const response = await paymentService.createPaymentUrl(
          orderData.id || orderData._id,
          orderData.total
        );

        if (response.url) {
          setPaymentUrl(response.url);
          setCurrentStep(2);
          
          // Mở VNPay trong tab mới
          const paymentWindow = window.open(
            response.url,
            'vnpay_payment',
            'width=800,height=600,scrollbars=yes,resizable=yes'
          );

          // Theo dõi payment window
          const checkClosed = setInterval(() => {
            if (paymentWindow.closed) {
              clearInterval(checkClosed);
              handlePaymentWindowClosed();
            }
          }, 1000);
        } else {
          throw new Error('Không thể tạo URL thanh toán');
        }
      } else {
        // Các phương thức thanh toán khác (COD, Transfer, etc.)
        setCurrentStep(3);
        setPaymentStatus('success');
        
        // Simulate payment success
        setTimeout(() => {
          onPaymentSuccess?.(orderData);
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      setError(error.message);
      onPaymentFailure?.(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentWindowClosed = async () => {
    setLoading(true);
    
    try {
      // Kiểm tra trạng thái thanh toán
      const statusResponse = await paymentService.checkPaymentStatus(
        orderData.id || orderData._id
      );

      if (statusResponse.success) {
        setPaymentStatus('success');
        setCurrentStep(3);
        onPaymentSuccess?.(orderData);
      } else {
        setPaymentStatus('failed');
        setCurrentStep(2);
        onPaymentFailure?.(new Error('Thanh toán thất bại'));
      }
    } catch (error) {
      console.error('❌ Error checking payment status:', error);
      setPaymentStatus('failed');
      setError('Không thể xác nhận trạng thái thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = () => {
    setCurrentStep(1);
    setPaymentStatus(null);
    setError(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Title level={4}>Thông tin đơn hàng</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text><strong>Mã đơn hàng:</strong> {orderData?.id || orderData?._id}</Text>
              <Text><strong>Tổng tiền:</strong> {paymentService.formatAmount(orderData?.total || 0)}</Text>
              <Text><strong>Số sản phẩm:</strong> {orderData?.items?.length || 0}</Text>
            </Space>
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Button type="primary" onClick={() => setCurrentStep(1)}>
                Tiếp tục
              </Button>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <Title level={4}>Chọn phương thức thanh toán</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              {paymentService.getPaymentMethods().map(method => (
                <Button
                  key={method.value}
                  size="large"
                  style={{ width: '100%', height: 60, textAlign: 'left' }}
                  onClick={() => handlePaymentMethodSelect(method.value)}
                  loading={loading}
                >
                  <Space>
                    <span style={{ fontSize: 20 }}>{method.icon}</span>
                    <div>
                      <div><strong>{method.label}</strong></div>
                      <div style={{ fontSize: 12, color: '#666' }}>{method.description}</div>
                    </div>
                  </Space>
                </Button>
              ))}
            </Space>
          </div>
        );

      case 2:
        return (
          <div>
            <Title level={4}>Đang xử lý thanh toán</Title>
            {paymentUrl ? (
              <div>
                <Alert
                  message="Đang chuyển hướng đến VNPay"
                  description="Vui lòng hoàn tất thanh toán trong cửa sổ mới"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <div style={{ textAlign: 'center' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 16 }}>
                    <Text>Đang chờ xác nhận thanh toán...</Text>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text>Đang xử lý thanh toán...</Text>
                </div>
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  message="Thanh toán thất bại"
                  description={error || 'Có lỗi xảy ra trong quá trình thanh toán'}
                  type="error"
                  showIcon
                  action={
                    <Button size="small" onClick={handleRetryPayment}>
                      Thử lại
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div style={{ textAlign: 'center' }}>
            {paymentStatus === 'success' ? (
              <div>
                <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
                <Title level={3} style={{ color: '#52c41a' }}>Thanh toán thành công!</Title>
                <Text>Đơn hàng của bạn đã được xử lý thành công.</Text>
                <div style={{ marginTop: 16 }}>
                  <Button type="primary" onClick={onClose}>
                    Đóng
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f', marginBottom: 16 }} />
                <Title level={3} style={{ color: '#ff4d4f' }}>Thanh toán thất bại</Title>
                <Text>Có lỗi xảy ra trong quá trình thanh toán.</Text>
                <div style={{ marginTop: 16 }}>
                  <Button onClick={handleRetryPayment}>
                    Thử lại
                  </Button>
                  <Button type="primary" onClick={onClose} style={{ marginLeft: 8 }}>
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title="Thanh toán đơn hàng"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div>
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} description={step.description} />
          ))}
        </Steps>

        {renderStepContent()}
      </div>
    </Modal>
  );
};

export default PaymentIntegration;
