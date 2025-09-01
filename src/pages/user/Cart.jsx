import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingCartOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons';
import { Button, Empty, message, Modal, Input, Divider } from 'antd';
import './cart.css';

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n || 0));

export default function Cart() {
  const { cartItems, addToCart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 500000 ? 0 : 30000; // Miễn phí ship cho đơn > 500k
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // Giảm 10% nếu có coupon
  const total = subtotal + shippingFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon({ code: couponCode, discount: 0.1 });
      message.success('Áp dụng mã giảm giá thành công!');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    message.info('Đã xóa mã giảm giá');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Giỏ hàng đang trống!');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleRemoveItem = (itemId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        removeFromCart(itemId);
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="cart-empty-content">
            <Empty
              image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
              description="Giỏ hàng của bạn đang trống"
            >
              <Button 
                type="primary" 
                size="large"
                onClick={handleContinueShopping}
                icon={<ArrowLeftOutlined />}
              >
                Tiếp tục mua sắm
              </Button>
            </Empty>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">
            <ShoppingCartOutlined /> Giỏ hàng ({cartItems.length} sản phẩm)
          </h1>
          <Button 
            type="link" 
            onClick={handleContinueShopping}
            icon={<ArrowLeftOutlined />}
          >
            Tiếp tục mua sắm
          </Button>
        </div>

        <div className="cart-content">
          <div className="cart-main">
            {/* Danh sách sản phẩm */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image || '/src/assets/img/sanpham1.jpg'} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">₫{item.price?.toLocaleString()}</p>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <Button 
                          type="text" 
                          icon={<MinusOutlined />}
                          onClick={() => decreaseQty(item.id)}
                          disabled={item.quantity <= 1}
                        />
                        <span className="quantity">{item.quantity}</span>
                        <Button 
                          type="text" 
                          icon={<PlusOutlined />}
                          onClick={() => increaseQty(item.id)}
                        />
                      </div>
                      
                      <div className="cart-item-total">
                        ₫{(item.price * item.quantity).toLocaleString()}
                      </div>
                      
                      <Button 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mã giảm giá */}
            <div className="coupon-section">
              <h3>Mã giảm giá</h3>
              <div className="coupon-input">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onPressEnter={handleApplyCoupon}
                />
                <Button 
                  type="primary"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim()}
                >
                  Áp dụng
                </Button>
              </div>
              {appliedCoupon && (
                <div className="applied-coupon">
                  <span>Đã áp dụng: {appliedCoupon.code}</span>
                  <Button type="link" onClick={handleRemoveCoupon}>
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>
              
              <div className="summary-item">
                <span>Tạm tính:</span>
                <span>₫{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="summary-item">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee === 0 ? 'Miễn phí' : `₫${shippingFee.toLocaleString()}`}</span>
              </div>
              
              {appliedCoupon && (
                <div className="summary-item discount">
                  <span>Giảm giá ({appliedCoupon.code}):</span>
                  <span>-₫{discount.toLocaleString()}</span>
                </div>
              )}
              
              <Divider />
              
              <div className="summary-total">
                <span>Tổng cộng:</span>
                <span className="total-amount">₫{total.toLocaleString()}</span>
              </div>
              
              {shippingFee > 0 && (
                <div className="free-shipping-note">
                  Mua thêm ₫{(500000 - subtotal).toLocaleString()} để được miễn phí vận chuyển
                </div>
              )}
              
              <Button 
                type="primary" 
                size="large" 
                block
                onClick={handleCheckout}
                className="checkout-btn"
              >
                Tiến hành thanh toán
              </Button>
              
              <div className="secure-checkout">
                <span>🔒 Thanh toán an toàn</span>
                <span>✓ Giao hàng miễn phí</span>
                <span>✓ Đổi trả 30 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
