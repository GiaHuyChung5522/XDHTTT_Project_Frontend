import React from 'react';
import ProductCard from '../../components/ProductCard';

const ProductDemo = () => {
  const sampleProducts = [
    {
      id: 1,
      name: "Lenovo Lecoo Pro 14 2025 Ryzen 7 H 255 RAM 32GB SSD 1TB 14\"",
      price: 15990000,
      image: "https://via.placeholder.com/300x200?text=Lenovo+Laptop",
      badge: "Sẵn Hàng Tại Showroom",
      specifications: {
        cpu: "AMD Ryzen 7 H 255",
        ram: "32GB DDR5 4800MHz",
        screen: "14\" 2.8K (2880x1800) OLED",
        graphics: "AMD Radeon™ 780M"
      }
    },
    {
      id: 2,
      name: "Gigabyte G6 MF-H2VN853KH RAM 16GB SSD 512GB",
      price: 22990000,
      image: "https://via.placeholder.com/300x200?text=Gigabyte+Laptop",
      badge: "BH 24 tháng Gigabyte VN",
      specifications: {
        cpu: "Intel Core i7-12700H",
        ram: "16GB DDR4 3200MHz",
        screen: "15.6\" FHD (1920x1080) IPS",
        graphics: "NVIDIA GeForce RTX 4060"
      }
    },
    {
      id: 3,
      name: "Acer Shadow AMD Ryzen 7 8745H RAM 16GB SSD 1TB RTX",
      price: 23890000,
      image: "https://via.placeholder.com/300x200?text=Acer+Laptop",
      badge: "Sẵn Hàng Tại Showroom",
      specifications: {
        cpu: "AMD Ryzen 7 8745H",
        ram: "16GB DDR5 4800MHz",
        screen: "15.6\" FHD (1920x1080) IPS",
        graphics: "NVIDIA GeForce RTX 4060"
      }
    },
    {
      id: 4,
      name: "Lenovo Lecoo Fighter 7000 RAM 16GB SSD 1TB",
      price: 27990000,
      image: "https://via.placeholder.com/300x200?text=Lenovo+Fighter",
      badge: "Sẵn Hàng Tại Showroom",
      specifications: {
        cpu: "Intel Core i7-13700H",
        ram: "16GB DDR5 4800MHz",
        screen: "16\" WUXGA (1920x1200) IPS",
        graphics: "NVIDIA GeForce RTX 4070"
      }
    },
    {
      id: 5,
      name: "Lenovo IdeaPad Slim 5 2025 Ryzen 7 H 255 RAM 24GB SSD 1TB",
      price: 18490000,
      image: "https://via.placeholder.com/300x200?text=IdeaPad+Slim",
      badge: "Sẵn Hàng Tại Showroom",
      specifications: {
        cpu: "AMD Ryzen 7 H 255",
        ram: "24GB DDR5 4800MHz",
        screen: "14\" 2.8K (2880x1800) OLED",
        graphics: "AMD Radeon™ 780M"
      }
    }
  ];

  const handleLike = (product) => {
    console.log('Like product:', product.name);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product.name);
  };

  const handleCompare = (product) => {
    console.log('Compare product:', product.name);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Demo Giao Diện Sản Phẩm Mới
      </h1>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {sampleProducts.map((product) => (
          <ProductCard
            key={product.id}
            badge={product.badge}
            image={product.image}
            name={product.name}
            price={product.price}
            version="1 phiên bản"
            specifications={product.specifications}
            isLiked={false}
            onLike={() => handleLike(product)}
            onAddToCart={() => handleAddToCart(product)}
            onCompare={() => handleCompare(product)}
          />
        ))}
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        maxWidth: '800px',
        margin: '40px auto 0'
      }}>
        <h2>Hướng dẫn sử dụng:</h2>
        <ul>
          <li><strong>Hover vào sản phẩm:</strong> Hiển thị thông số chi tiết và nút hành động</li>
          <li><strong>Nút trái tim:</strong> Thêm vào yêu thích</li>
          <li><strong>Nút giỏ hàng (🛒):</strong> Thêm vào giỏ hàng</li>
          <li><strong>Nút so sánh (⚖️):</strong> So sánh sản phẩm</li>
          <li><strong>Badge:</strong> Hiển thị trạng thái sản phẩm (có sẵn, bảo hành, v.v.)</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDemo;
