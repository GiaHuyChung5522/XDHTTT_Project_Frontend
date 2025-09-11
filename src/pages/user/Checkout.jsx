import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import PaymentIntegration from '../../components/PaymentIntegration';
import { 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { 
  Button, 
  Form, 
  Input, 
  Select, 
  Radio, 
  Checkbox, 
  message, 
  Steps,
  Card,
  Divider,
  Modal,
  Alert
} from 'antd';
import './checkout.css';

const { TextArea } = Input;
const { Option } = Select;

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n || 0));

export default function Checkout() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const steps = [
    {
      title: 'Thông tin giao hàng',
      icon: <UserOutlined />,
    },
    {
      title: 'Phương thức thanh toán',
      icon: <CreditCardOutlined />,
    },
    {
      title: 'Xác nhận đơn hàng',
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['name', 'phone', 'address', 'city', 'district', 'ward']);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      // Validate payment method specific fields
      if (paymentMethod === 'card') {
        await form.validateFields(['cardNumber', 'cardHolder', 'expiry', 'cvv']);
      }
      
      // Simulate payment processing
      message.loading('Đang xử lý thanh toán...', 0);
      
      // Simulate different processing times based on payment method
      const processingTime = paymentMethod === 'card' ? 3000 : 
                           paymentMethod === 'bank' ? 2000 : 1000;
      
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Simulate payment success/failure (90% success rate for demo)
      const paymentSuccess = Math.random() > 0.1;
      
      if (!paymentSuccess) {
        message.destroy();
        message.error('Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức khác.');
        return;
      }
      
      message.destroy();
      message.success('Thanh toán thành công!');
      
      // Create order data
      const orderData = {
        orderId: 'DH' + Date.now().toString().slice(-7),
        customerInfo: form.getFieldsValue(),
        items: cartItems,
        paymentMethod,
        paymentStatus: 'paid',
        subtotal,
        shippingFee,
        total,
        status: paymentMethod === 'cash' ? 'pending' : 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentDetails: paymentMethod === 'card' ? {
          cardLast4: form.getFieldValue('cardNumber')?.slice(-4),
          cardType: 'Visa', // Demo
          transactionId: 'TXN' + Date.now().toString().slice(-8)
        } : paymentMethod === 'bank' ? {
          bankName: 'Vietcombank',
          accountNumber: '1234567890',
          transactionId: 'BANK' + Date.now().toString().slice(-8)
        } : null
      };

      // ✅ Gọi API tạo đơn hàng thật
      const result = await orderService.createOrder(orderData);
      
      if (result.success) {
        setOrderData(result.data);
        
        // Nếu là VNPay, mở payment modal
        if (paymentMethod === 'vnpay' && result.paymentUrl) {
          setShowPaymentModal(true);
        } else {
          // Các phương thức khác, xử lý thành công ngay
          handleOrderSuccess(result.data);
        }
      } else {
        // Fallback với local data
        setOrderData(orderData);
        handleOrderSuccess(orderData);
      }
      
    } catch (error) {
      message.destroy();
      if (error.errorFields) {
        message.error('Vui lòng kiểm tra lại thông tin thanh toán');
      } else {
        message.error('Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSuccess = (order) => {
    message.destroy();
    message.success('Đặt hàng thành công!');
    
    // Save to localStorage for backup
    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    // Clear cart after successful order
    cartItems.forEach(item => removeFromCart(item.id));
    
    navigate('/order-success', { state: { order } });
  };

  const handlePaymentSuccess = (order) => {
    setShowPaymentModal(false);
    handleOrderSuccess(order);
  };

  const handlePaymentFailure = (error) => {
    setShowPaymentModal(false);
    message.error('Thanh toán thất bại: ' + error.message);
  };

  const renderShippingInfo = () => (
    <div className="checkout-section">
      <h3>Thông tin giao hàng</h3>
      
      <Form form={form} layout="vertical" className="checkout-form">
        <div className="form-row">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            className="form-item"
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^0\d{9,10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
            className="form-item"
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item
            name="city"
            label="Tỉnh/Thành phố"
            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
            className="form-item"
          >
            <Select placeholder="Chọn tỉnh/thành phố">
              <Option value="hanoi">Hà Nội</Option>
              <Option value="hcm">TP. Hồ Chí Minh</Option>
              <Option value="danang">Đà Nẵng</Option>
              <Option value="haiphong">Hải Phòng</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
            className="form-item"
          >
            <Select placeholder="Chọn quận/huyện">
              <Option value="baidinh">Ba Đình</Option>
              <Option value="hoankiem">Hoàn Kiếm</Option>
              <Option value="tayho">Tây Hồ</Option>
              <Option value="longbien">Long Biên</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item
            name="ward"
            label="Phường/Xã"
            rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
            className="form-item"
          >
            <Select placeholder="Chọn phường/xã">
              <Option value="phuctan">Phúc Tân</Option>
              <Option value="dongxuan">Đồng Xuân</Option>
              <Option value="hangma">Hàng Mã</Option>
              <Option value="hangdao">Hàng Đào</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Địa chỉ chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
            className="form-item"
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, tên đường" />
          </Form.Item>
        </div>

        <Form.Item name="note" label="Ghi chú (không bắt buộc)">
          <TextArea rows={3} placeholder="Ghi chú về đơn hàng..." />
        </Form.Item>
      </Form>
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="checkout-section">
      <h3>Phương thức thanh toán</h3>
      
      <Radio.Group 
        value={paymentMethod} 
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="payment-methods"
      >
        <Card className="payment-method-card">
          <Radio value="cash">
            <div className="payment-method-content">
              <DollarOutlined className="payment-icon" />
              <div>
                <h4>Thanh toán tiền mặt</h4>
                <p>Thanh toán khi nhận hàng (COD)</p>
              </div>
            </div>
          </Radio>
        </Card>

        <Card className="payment-method-card">
          <Radio value="bank">
            <div className="payment-method-content">
              <BankOutlined className="payment-icon" />
              <div>
                <h4>Chuyển khoản ngân hàng</h4>
                <p>Chuyển khoản qua tài khoản ngân hàng</p>
              </div>
            </div>
          </Radio>
        </Card>

        <Card className="payment-method-card">
          <Radio value="card">
            <div className="payment-method-content">
              <CreditCardOutlined className="payment-icon" />
              <div>
                <h4>Thẻ tín dụng/Ghi nợ</h4>
                <p>Thanh toán qua thẻ Visa, Mastercard</p>
              </div>
            </div>
          </Radio>
        </Card>

        <Card className="payment-method-card">
          <Radio value="vnpay">
            <div className="payment-method-content">
              <div className="payment-icon" style={{ fontSize: '24px', color: '#1ba8ff' }}>📱</div>
              <div>
                <h4>VNPay</h4>
                <p>Thanh toán qua VNPay - An toàn và tiện lợi</p>
              </div>
            </div>
          </Radio>
        </Card>
      </Radio.Group>

      {paymentMethod === 'bank' && (
        <Alert
          message="Thông tin chuyển khoản"
          description={
            <div>
              <p><strong>Ngân hàng:</strong> Vietcombank</p>
              <p><strong>Số tài khoản:</strong> 1234567890</p>
              <p><strong>Chủ tài khoản:</strong> CÔNG TY 7N FASHION</p>
              <p><strong>Nội dung:</strong> Thanh toan don hang [Mã đơn hàng]</p>
            </div>
          }
          type="info"
          showIcon
          className="bank-info"
        />
      )}

      {paymentMethod === 'vnpay' && (
        <Alert
          message="Thanh toán VNPay"
          description={
            <div>
              <p>• Thanh toán an toàn qua VNPay</p>
              <p>• Hỗ trợ thẻ ATM, Internet Banking</p>
              <p>• Xác nhận thanh toán ngay lập tức</p>
              <p>• Miễn phí phí giao dịch</p>
            </div>
          }
          type="info"
          showIcon
          className="vnpay-info"
        />
      )}

      {paymentMethod === 'card' && (
        <div className="card-payment-form">
          <h4>Thông tin thẻ</h4>
          <Alert
            message="Demo Mode"
            description="Đây là chế độ demo. Thông tin thẻ sẽ không được xử lý thực tế."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <div className="form-row">
            <Form.Item 
              name="cardNumber" 
              label="Số thẻ" 
              className="form-item"
              rules={[
                { required: true, message: 'Vui lòng nhập số thẻ' },
                { pattern: /^[0-9\s]{16,19}$/, message: 'Số thẻ không hợp lệ' }
              ]}
            >
              <Input 
                placeholder="1234 5678 9012 3456" 
                maxLength={19}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                  e.target.value = value;
                }}
              />
            </Form.Item>
            <Form.Item 
              name="cardHolder" 
              label="Chủ thẻ" 
              className="form-item"
              rules={[
                { required: true, message: 'Vui lòng nhập tên chủ thẻ' },
                { min: 2, message: 'Tên chủ thẻ phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input placeholder="NGUYEN VAN A" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item 
              name="expiry" 
              label="Ngày hết hạn" 
              className="form-item"
              rules={[
                { required: true, message: 'Vui lòng nhập ngày hết hạn' },
                { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Định dạng MM/YY' }
              ]}
            >
              <Input 
                placeholder="MM/YY" 
                maxLength={5}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                  }
                  e.target.value = value;
                }}
              />
            </Form.Item>
            <Form.Item 
              name="cvv" 
              label="CVV" 
              className="form-item"
              rules={[
                { required: true, message: 'Vui lòng nhập CVV' },
                { pattern: /^[0-9]{3,4}$/, message: 'CVV phải có 3-4 số' }
              ]}
            >
              <Input 
                placeholder="123" 
                maxLength={4}
                type="password"
              />
            </Form.Item>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrderSummary = () => (
    <div className="checkout-section">
      <h3>Xác nhận đơn hàng</h3>
      
      <div className="order-summary">
        <div className="order-items">
          <h4>Sản phẩm đã chọn ({cartItems.length})</h4>
          {cartItems.map((item) => (
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

        <Divider />

        <div className="order-total">
          <div className="total-row">
            <span>Tạm tính:</span>
            <span>₫{subtotal.toLocaleString()}</span>
          </div>
          <div className="total-row">
            <span>Phí vận chuyển:</span>
            <span>{shippingFee === 0 ? 'Miễn phí' : `₫${shippingFee.toLocaleString()}`}</span>
          </div>
          <Divider />
          <div className="total-row total-final">
            <span>Tổng cộng:</span>
            <span className="final-amount">₫{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="order-info">
          <h4>Thông tin giao hàng</h4>
          <p><strong>Tên:</strong> {form.getFieldValue('name')}</p>
          <p><strong>SĐT:</strong> {form.getFieldValue('phone')}</p>
          <p><strong>Địa chỉ:</strong> {form.getFieldValue('address')}, {form.getFieldValue('ward')}, {form.getFieldValue('district')}, {form.getFieldValue('city')}</p>
        </div>

        <div className="order-info">
          <h4>Phương thức thanh toán</h4>
          <p>
            {paymentMethod === 'cash' && 'Thanh toán tiền mặt khi nhận hàng'}
            {paymentMethod === 'bank' && 'Chuyển khoản ngân hàng'}
            {paymentMethod === 'card' && 'Thẻ tín dụng/Ghi nợ'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderShippingInfo();
      case 1:
        return renderPaymentMethod();
      case 2:
        return renderOrderSummary();
      default:
        return null;
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <Button 
            type="link" 
            onClick={() => navigate('/cart')}
            icon={<ArrowLeftOutlined />}
          >
            Quay lại giỏ hàng
          </Button>
          <h1>Thanh toán</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            <Steps current={currentStep} items={steps} className="checkout-steps" />
            
            <div className="checkout-form-container">
              {renderStepContent()}
            </div>

            <div className="checkout-actions">
              {currentStep > 0 && (
                <Button onClick={handlePrev} size="large">
                  Quay lại
                </Button>
              )}
              
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={handleNext} size="large">
                  Tiếp tục
                </Button>
              )}
              
              {currentStep === steps.length - 1 && (
                <Button 
                  type="primary" 
                  onClick={handlePlaceOrder} 
                  size="large"
                  loading={loading}
                  icon={<LockOutlined />}
                >
                  Đặt hàng
                </Button>
              )}
            </div>
          </div>

          <div className="checkout-sidebar">
            <Card title="Tóm tắt đơn hàng" className="summary-card">
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image || '/src/assets/img/sanpham1.jpg'} alt={item.name} />
                    <div>
                      <h5>{item.name}</h5>
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                    <span>₫{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <Divider />
              
              <div className="summary-total">
                <div className="total-row">
                  <span>Tạm tính:</span>
                  <span>₫{subtotal.toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : `₫${shippingFee.toLocaleString()}`}</span>
                </div>
                <Divider />
                <div className="total-row total-final">
                  <span>Tổng cộng:</span>
                  <span className="final-amount">₫{total.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Payment Integration Modal */}
      <PaymentIntegration
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderData={orderData}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    </div>
  );
}
