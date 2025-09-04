 // src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo Provider để bọc toàn bộ app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Mảng lưu sản phẩm trong giỏ
  const [wishlistItems, setWishlistItems] = useState([]); // Mảng lưu sản phẩm yêu thích
  const [notifications, setNotifications] = useState([]); // Mảng thông báo

  // Load dữ liệu từ localStorage khi khởi tạo
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedWishlist = localStorage.getItem('wishlistItems');
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Lưu cart vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Lưu wishlist vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Thêm thông báo
  const addNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Tự động xóa thông báo sau duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  // Xóa thông báo
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        addNotification(`Đã cập nhật số lượng "${product.name}" trong giỏ hàng`, 'success');
        return updated;
      }
      const newItem = { ...product, quantity, addedAt: new Date().toISOString() };
      addNotification(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
      return [...prev, newItem];
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const item = prev.find(item => item.id === id);
      if (item) {
        addNotification(`Đã xóa "${item.name}" khỏi giỏ hàng`, 'info');
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Tăng số lượng
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Giảm số lượng
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Thêm vào yêu thích
  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        addNotification(`"${product.name}" đã có trong danh sách yêu thích`, 'warning');
        return prev;
      }
      const newItem = { ...product, addedAt: new Date().toISOString() };
      addNotification(`Đã thêm "${product.name}" vào yêu thích`, 'success');
      return [...prev, newItem];
    });
  };

  // Xóa khỏi yêu thích
  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => {
      const item = prev.find(item => item.id === id);
      if (item) {
        addNotification(`Đã xóa "${item.name}" khỏi yêu thích`, 'info');
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Kiểm tra sản phẩm có trong yêu thích không
  const isInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  // Tính tổng số lượng sản phẩm trong giỏ
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Tính tổng giá trị giỏ hàng
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    addNotification('Đã xóa toàn bộ giỏ hàng', 'info');
  };

  // Xóa toàn bộ yêu thích
  const clearWishlist = () => {
    setWishlistItems([]);
    addNotification('Đã xóa toàn bộ danh sách yêu thích', 'info');
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        wishlistItems,
        notifications,
        addToCart, 
        removeFromCart, 
        increaseQty, 
        decreaseQty,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getTotalItems,
        getTotalPrice,
        clearCart,
        clearWishlist,
        addNotification,
        removeNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 3. Custom hook để dùng CartContext
export const useCart = () => useContext(CartContext);
