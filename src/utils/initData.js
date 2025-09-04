// Utility functions to initialize and manage localStorage data

export const initializeLocalStorageData = () => {
  // Initialize orders if not exists
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }

  // Initialize users if not exists
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }

  // Initialize products if not exists
  if (!localStorage.getItem('products')) {
    const sampleProducts = [
      {
        id: 'PRD-001',
        name: 'Lenovo Lecoo Pro 14 2025 Ryzen 7 H 255 RAM 32GB SSD 1TB',
        category: 'Laptop',
        price: 15990000,
        stock: 10,
        image: 'https://via.placeholder.com/300x200?text=Lenovo+Laptop',
        description: 'Laptop Lenovo cao cấp với cấu hình mạnh mẽ',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'PRD-002',
        name: 'Gigabyte G6 MF-H2VN853KH RAM 16GB SSD 512GB',
        category: 'Laptop',
        price: 22990000,
        stock: 5,
        image: 'https://via.placeholder.com/300x200?text=Gigabyte+Laptop',
        description: 'Laptop gaming Gigabyte với hiệu năng cao',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'PRD-003',
        name: 'Acer Shadow AMD Ryzen 7 8745H RAM 16GB SSD 1TB RTX',
        category: 'Laptop',
        price: 23890000,
        stock: 8,
        image: 'https://via.placeholder.com/300x200?text=Acer+Laptop',
        description: 'Laptop Acer với card đồ họa RTX mạnh mẽ',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('products', JSON.stringify(sampleProducts));
  }

  // Initialize cart if not exists
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
};

export const getSafeString = (value) => {
  return value || '';
};

export const getSafeNumber = (value) => {
  return value || 0;
};

export const getSafeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

export const getSafeObject = (value) => {
  return value && typeof value === 'object' ? value : {};
};
