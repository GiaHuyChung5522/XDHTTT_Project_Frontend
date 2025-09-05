import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircleOutlined, 
  HomeOutlined, 
  ShoppingOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Button, Card, Steps, Divider, Alert } from 'antd';
import './order-success.css';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    navigate('/');
    return null;
  }

  const steps = [
    {
      title: 'Đặt hàng thành công',
      description: 'Đơn hàng đã được tạo',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Xác nhận đơn hàng',
      description: 'Shop sẽ liên hệ xác nhận',
      icon: <PhoneOutlined />,
    },
    {
      title: 'Giao hàng',
      description: 'Đơn hàng sẽ được giao trong 2-3 ngày',
      icon: <ShoppingOutlined />,
    },
  ];

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cash':
        return 'Thanh toán tiền mặt khi nhận hàng';
      case 'bank':
        return 'Chuyển khoản ngân hàng';
      case 'card':
        return 'Thẻ tín dụng/Ghi nợ';
      default:
        return 'Chưa xác định';
    }
  };

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-header">
          <div className="success-icon">
            <CheckCircleOutlined />
          </div>
          <h1>Đặt hàng thành công!</h1>
          <p>Cảm ơn bạn đã mua sắm tại Gr7 UTH</p>
        </div>

        <div className="success-content">
          <div className="success-main">
            <Card className="order-info-card">
              <h3>Thông tin đơn hàng</h3>
              
              <div className="order-details">
                <div className="detail-row">
                  <span className="label">Mã đơn hàng:</span>
                  <span className="value order-id">{order.orderId}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Ngày đặt:</span>
                  <span className="value">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Tổng tiền:</span>
                  <span className="value total-amount">₫{order.total.toLocaleString()}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Phương thức thanh toán:</span>
                  <span className="value">{getPaymentMethodText(order.paymentMethod)}</span>
                </div>
              </div>

              <Divider />

              <div className="customer-info">
                <h4>Thông tin giao hàng</h4>
                <p><strong>Tên:</strong> {order.customerInfo.name}</p>
                <p><strong>Số điện thoại:</strong> {order.customerInfo.phone}</p>
                <p><strong>Địa chỉ:</strong> {order.customerInfo.address}, {order.customerInfo.ward}, {order.customerInfo.district}, {order.customerInfo.city}</p>
                {order.customerInfo.note && (
                  <p><strong>Ghi chú:</strong> {order.customerInfo.note}</p>
                )}
              </div>

              <Divider />

              <div className="order-items">
                <h4>Sản phẩm đã đặt ({order.items.length})</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image || '/src/assets/img/sanpham1.jpg'} alt={item.name} />
                    <div className="item-info">
                      <h5>{item.name}</h5>
                      <p>Số lượng: {item.quantity}</p>
                      <p className="item-price">₫{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="next-steps-card">
              <h3>Những bước tiếp theo</h3>
              <Steps 
                direction="vertical" 
                current={0} 
                items={steps}
                className="success-steps"
              />
            </Card>

            {/* Payment Status */}
            {order.paymentStatus === 'paid' ? (
              <Alert
                message="Thanh toán thành công"
                description={
                  <div>
                    <p>Đơn hàng của bạn đã được thanh toán thành công!</p>
                    {order.paymentDetails && (
                      <div className="payment-details">
                        {order.paymentMethod === 'card' && (
                          <>
                            <p><strong>Phương thức:</strong> Thẻ tín dụng/ghi nợ</p>
                            <p><strong>Loại thẻ:</strong> {order.paymentDetails.cardType}</p>
                            <p><strong>Số thẻ:</strong> **** **** **** {order.paymentDetails.cardLast4}</p>
                            <p><strong>Mã giao dịch:</strong> {order.paymentDetails.transactionId}</p>
                          </>
                        )}
                        {order.paymentMethod === 'bank' && (
                          <>
                            <p><strong>Phương thức:</strong> Chuyển khoản ngân hàng</p>
                            <p><strong>Ngân hàng:</strong> {order.paymentDetails.bankName}</p>
                            <p><strong>Số tài khoản:</strong> {order.paymentDetails.accountNumber}</p>
                            <p><strong>Mã giao dịch:</strong> {order.paymentDetails.transactionId}</p>
                          </>
                        )}
                        {order.paymentMethod === 'cash' && (
                          <p><strong>Phương thức:</strong> Thanh toán khi nhận hàng (COD)</p>
                        )}
                      </div>
                    )}
                  </div>
                }
                type="success"
                showIcon
                className="payment-alert"
              />
            ) : order.paymentMethod === 'bank' ? (
              <Alert
                message="Hướng dẫn thanh toán"
                description={
                  <div>
                    <p>Vui lòng chuyển khoản theo thông tin sau:</p>
                    <div className="bank-details">
                      <p><strong>Ngân hàng:</strong> Vietcombank</p>
                      <p><strong>Số tài khoản:</strong> 1234567890</p>
                      <p><strong>Chủ tài khoản:</strong> CÔNG TY 7N FASHION</p>
                      <p><strong>Số tiền:</strong> ₫{order.total.toLocaleString()}</p>
                      <p><strong>Nội dung:</strong> Thanh toan don hang {order.orderId}</p>
                    </div>
                    <p className="note">Lưu ý: Vui lòng chuyển khoản trong vòng 24h để đơn hàng được xử lý nhanh chóng.</p>
                  </div>
                }
                type="info"
                showIcon
                className="payment-alert"
              />
            ) : order.paymentMethod === 'cash' ? (
              <Alert
                message="Thanh toán khi nhận hàng"
                description={
                  <div>
                    <p>Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng.</p>
                    <p><strong>Số tiền cần thanh toán:</strong> ₫{order.total.toLocaleString()}</p>
                    <p className="note">Lưu ý: Vui lòng chuẩn bị đúng số tiền để giao dịch được thuận tiện.</p>
                  </div>
                }
                type="info"
                showIcon
                className="payment-alert"
              />
            ) : null}
          </div>

          <div className="success-sidebar">
            <Card className="contact-card">
              <h3>Liên hệ hỗ trợ</h3>
              
              <div className="contact-info">
                <div className="contact-item">
                  <PhoneOutlined className="contact-icon" />
                  <div>
                    <h4>Hotline</h4>
                    <p>1900 1234</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <MailOutlined className="contact-icon" />
                  <div>
                    <h4>Email</h4>
                    <p>support@7nfashion.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <ClockCircleOutlined className="contact-icon" />
                  <div>
                    <h4>Giờ làm việc</h4>
                    <p>8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="actions-card">
              <h3>Bạn có thể làm gì tiếp theo?</h3>
              
              <div className="action-buttons">
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/')}
                >
                  Về trang chủ
                </Button>
                
                <Button 
                  size="large" 
                  block
                  icon={<EyeOutlined />}
                  onClick={() => navigate('/orders')}
                >
                  Xem đơn hàng của tôi
                </Button>
                
                <Button 
                  size="large" 
                  block
                  icon={<ShoppingOutlined />}
                  onClick={() => navigate('/products')}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
