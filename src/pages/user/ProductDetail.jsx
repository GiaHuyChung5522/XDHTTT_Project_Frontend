import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../services/products";
import { useCart } from "../../context/CartContext";
import { message } from 'antd';
import './ProductDetail.css';

const FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const { addToCart, addToWishlist, isInWishlist } = useCart();

  // Mock data cho demo
  const mockProduct = {
    id: id || '1',
    name: 'Gigabyte G6 MF-H2VN853KH i7-13620H RAM 16GB SSD 512GB RTX 4050 16" FHD+ 165Hz',
    price: 22990000,
    originalPrice: 25990000,
    images: [
      'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Gigabyte+G6+Front',
      'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Gigabyte+G6+Side',
      'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Gigabyte+G6+Back',
      'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Gigabyte+G6+Keyboard',
      'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Gigabyte+G6+Screen',
      'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Gigabyte+G6+Ports'
    ],
    rating: 0,
    reviews: 0,
    warranty: 'Bảo Hành 24 tháng Gigabyte Việt Nam',
    condition: 'New 100%',
    specifications: {
      cpu: 'Intel Core i7-13620H',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      graphics: 'RTX 4050',
      screen: '16" FHD+ 165Hz',
      os: 'Windows 11 Home'
    },
    configurations: [
      {
        id: 1,
        name: 'Lenovo LOQ 15ARP9 83JC00HXVN Ryzen 5 7235HS RAM 12GB SSD 512GB RTX 3050 6GB 15.6" FHD 144Hz',
        price: 18290000,
        warranty: 'Bảo Hành 24 tháng chính hãng Lenovo Việt Nam',
        condition: 'New 100%'
      },
      {
        id: 2,
        name: 'Gigabyte Gaming A16 GA6H CMHH2VN893SH i5-13420H RAM 16GB SSD 512GB RTX™ 4050 16" FHD+ 165Hz',
        price: 22990000,
        warranty: 'Bảo Hành 24 tháng Gigabyte Việt Nam',
        condition: 'New 100%'
      }
    ],
    combos: [
      {
        id: 1,
        name: 'DAREU EH416 MIRROR | Tai nghe Gaming có dây LED RGB',
        price: 356250,
        checked: false
      },
      {
        id: 2,
        name: 'Giá Đỡ Laptop Đa Năng Z34',
        price: 0,
        checked: false
      }
    ]
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    
    // Simulate API call
    setTimeout(() => {
      if (!alive) return;
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);

    return () => {
      alive = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    const selectedProduct = selectedConfig === 0 ? product : product.configurations[selectedConfig - 1];
    addToCart({
      ...selectedProduct,
      image: product.images[selectedImage]
    });
    message.success('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  const handleConsultation = () => {
    if (!phoneNumber.trim()) {
      message.warning('Vui lòng nhập số điện thoại');
      return;
    }
    message.success('Đã gửi thông tin tư vấn! Chúng tôi sẽ liên hệ lại sớm nhất.');
    setPhoneNumber('');
  };

  const handleComboChange = (comboId) => {
    setProduct(prev => ({
      ...prev,
      combos: prev.combos.map(combo => 
        combo.id === comboId ? { ...combo, checked: !combo.checked } : combo
      )
    }));
  };

  const getTotalPrice = () => {
    const basePrice = selectedConfig === 0 ? product.price : product.configurations[selectedConfig - 1].price;
    const comboPrice = product.combos
      .filter(combo => combo.checked)
      .reduce((total, combo) => total + combo.price, 0);
    return basePrice + comboPrice;
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-buttons"></div>
          </div>
        </div>
      </div>
    );
  }

  if (err || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          <h2>Không tìm thấy sản phẩm</h2>
          <p>{err || "Sản phẩm không tồn tại hoặc đã bị xóa."}</p>
          <Link to="/" className="btn-primary">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Social Media Sidebar */}
      <div className="social-sidebar">
        <a href="#" className="social-btn youtube" title="YouTube">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <a href="#" className="social-btn facebook" title="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="#" className="social-btn tiktok" title="TikTok">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        </a>
      </div>

      <div className="product-detail-content">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              onError={(e) => { e.target.src = FALLBACK_IMG; }}
            />
          </div>
          
          <div className="thumbnail-gallery">
            {product.images.map((img, index) => (
              <div 
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={img} 
                  alt={`${product.name} ${index + 1}`}
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn" title="Xem video">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <button className="action-btn" title="Xem gallery">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
            <button className="action-btn" title="360° view">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
            <button className="action-btn" title="So sánh">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 6H5V5h4v4zm11-6h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 6h-4V5h4v4zM9 15H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6H5v-4h4v4zm11-6h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6h-4v-4h4v4z"/>
              </svg>
            </button>
            <button 
              className={`action-btn wishlist ${isInWishlist(product.id) ? 'active' : ''}`}
              onClick={handleAddToWishlist}
              title="Yêu thích"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-status">
            <span className="condition">{product.condition}</span>
            <span className="warranty">- {product.warranty}</span>
          </div>

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < product.rating ? 'filled' : ''}`}>★</span>
              ))}
            </div>
            <span className="rating-text">{product.rating}|{product.reviews} đánh giá</span>
          </div>

          {/* Flash Sale Timer */}
          <div className="flash-sale">
            <div className="flash-sale-header">
              <span className="flash-sale-label">FLASH SALE</span>
              <span className="flash-sale-timer">KẾT THÚC TRONG</span>
            </div>
            <div className="countdown-timer">
              <div className="timer-item">
                <span className="timer-number">10</span>
                <span className="timer-label">NGÀY</span>
              </div>
              <div className="timer-item">
                <span className="timer-number">10</span>
                <span className="timer-label">GIỜ</span>
              </div>
              <div className="timer-item">
                <span className="timer-number">0</span>
                <span className="timer-label">PHÚT</span>
              </div>
              <div className="timer-item">
                <span className="timer-number">50</span>
                <span className="timer-label">GIÂY</span>
              </div>
            </div>
          </div>

          <div className="product-price">
            <span className="current-price">{getTotalPrice().toLocaleString()}₫</span>
            {product.originalPrice && (
              <span className="original-price">{product.originalPrice.toLocaleString()}₫</span>
            )}
          </div>

          <button className="showroom-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Xem địa chỉ showroom
          </button>

          {/* Configuration Selection */}
          <div className="configuration-section">
            <h3>Chọn cấu hình:</h3>
            <div className="config-options">
              {product.configurations.map((config, index) => (
                <div 
                  key={config.id}
                  className={`config-option ${selectedConfig === index + 1 ? 'selected' : ''}`}
                  onClick={() => setSelectedConfig(index + 1)}
                >
                  <div className="config-info">
                    <h4>{config.name}</h4>
                    <p>{config.condition} - {config.warranty}</p>
                  </div>
                  <div className="config-price">{config.price.toLocaleString()}₫</div>
                </div>
              ))}
            </div>
          </div>

          {/* Promotional Offers */}
          <div className="promotional-offers">
            <div className="offer-section">
              <h4>ƯU ĐÃI</h4>
              <ul>
                <li>✓ Gói 15 ngày bao test.</li>
                <li>✓ Balo Gigabyte</li>
                <li>✓ Chuột không dây và lót chuột</li>
                <li>✓ Gói cài đặt Windows và phần mềm trọn đời</li>
              </ul>
            </div>
            
            <div className="offer-section">
              <h4>TRỢ GIÁ 5%</h4>
              <ul>
                <li>✓ Khi mua phụ kiện theo máy.</li>
                <li>✓ Khi mua RAM và SSD nâng cấp thêm.</li>
                <li>✓ Khi sử dụng dịch vụ sửa chữa sau bảo hành (tùy từng khung giá)</li>
              </ul>
            </div>
          </div>

          {/* Purchase Buttons */}
          <div className="purchase-buttons">
            <button className="btn-buy-now" onClick={handleAddToCart}>
              MUA NGAY
            </button>
            <p className="delivery-info">(Giao tận nơi hoặc nhận tại cửa hàng)</p>
            
            <button className="btn-installment">
              TRẢ GÓP
            </button>
            <p className="installment-info">(Thủ tục nhanh chóng nhận máy ngay)</p>
            
            <button className="btn-card-installment">
              TRẢ GÓP QUA THẺ
            </button>
            <p className="card-info">Visa, Mastercard, JCB, Amex</p>
          </div>

          {/* Consultation */}
          <div className="consultation-section">
            <input
              type="tel"
              placeholder="Để lại số điện thoại để được tư vấn"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-input"
            />
            <button className="btn-consult" onClick={handleConsultation}>
              GỬI
            </button>
          </div>

          {/* Combo Section */}
          <div className="combo-section">
            <h3>Mua theo combo</h3>
            {product.combos.map((combo) => (
              <div key={combo.id} className="combo-item">
                <label className="combo-checkbox">
                  <input
                    type="checkbox"
                    checked={combo.checked}
                    onChange={() => handleComboChange(combo.id)}
                  />
                  <span className="combo-name">{combo.name}</span>
                  {combo.price > 0 && (
                    <span className="combo-price">{combo.price.toLocaleString()}₫</span>
                  )}
                </label>
              </div>
            ))}
          </div>

          {/* Warranty & Delivery */}
          <div className="warranty-delivery">
            <a href="#" className="warranty-link">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Bảo hành toàn diện
            </a>
            <a href="#" className="delivery-link">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              Giao hàng toàn quốc
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}