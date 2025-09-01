// services/products.js
import { api } from '../lib/api';

// Mock data fallback khi API không hoạt động
const mockProducts = [
  {
    id: 1,
    name: "Lenovo IdeaPad 5 Pro 14 GT",
    price: 26190000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "Ryzen AI 9 365 RAM 32GB SSD 1TB 14"
  },
  {
    id: 2,
    name: "Gigabyte Gaming A16",
    price: 22990000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "GA6H CMH2VN893SH i5-13420H RAM 16GB"
  },
  {
    id: 3,
    name: "Lenovo Legion R7000",
    price: 22990000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "2024 Ryzen 7 8745H RAM 16GB SSD 512GB"
  },
  {
    id: 4,
    name: "Lenovo IdeaPad 5 Pro 16 GT",
    price: 23900000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "2025 Ultra 5 225H RAM 32GB SSD 1TB"
  },
  {
    id: 5,
    name: "Lenovo IdeaPad 5 Pro 16 GT",
    price: 23900000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "2025 Ultra 5 225H RAM 32GB SSD 1TB"
  },
  {
    id: 6,
    name: "Lenovo IdeaPad 5 Pro 16 GT",
    price: 23900000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "2025 Ultra 5 225H RAM 32GB SSD 1TB"
  },
  {
    id: 7,
    name: "Lenovo Legion Slim 5",
    price: 26890000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "R7000P 2024 Ryzen 7 8845H RAM 16GB"
  },
  {
    id: 8,
    name: "ASUS ROG Strix G16",
    price: 28990000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "Gaming Laptop Intel Core i7-13650HX"
  },
  {
    id: 9,
    name: "MSI Katana 15",
    price: 24990000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "Gaming Laptop Intel Core i5-13420H"
  },
  {
    id: 10,
    name: "Dell Inspiron 15",
    price: 19990000,
    image: "https://tanphat.com.vn/media/product/3115_acer_aspire_a514_56p_gray_a8.jpg",
    description: "Intel Core i5-1235U RAM 8GB SSD 512GB"
  }
];

// Mock function để filter và paginate data
function filterAndPaginateProducts(products, { page = 1, limit = 20, q = '', sort = 'id', order = 'asc' }) {
  let filtered = [...products];
  
  // Filter by search query
  if (q) {
    const searchTerm = q.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sort];
    let bVal = b[sort];
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (order === 'desc') {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  });
  
  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filtered.slice(startIndex, endIndex);
  
  return {
    items,
    total: filtered.length,
    page,
    limit
  };
}

/**
 * Hỗ trợ cả 2 kiểu API:
 * - json-server style: trả mảng + header X-Total-Count
 * - custom style: trả { data, meta }
 */
export async function getProducts({
  page = 1,
  limit = 20,
  q = '',
  sort = 'id',
  order = 'asc',
} = {}) {
  try {
    // Thử gọi API thật trước
    const params = { _page: page, _limit: limit, _sort: sort, _order: order };
    if (q) params.q = q;

    const { data, headers } = await api.getWithHeaders('/product', params);

    const items =
      Array.isArray(data) ? data
      : Array.isArray(data?.data) ? data.data
      : [];

    const total = Number(
      headers.get('x-total-count') ??
      (Array.isArray(data) ? data.length : data?.meta?.total ?? 0)
    );

    return { items, page, limit, total };
  } catch (error) {
    console.warn('API không khả dụng, sử dụng mock data:', error.message);
    
    // Fallback to mock data
    return filterAndPaginateProducts(mockProducts, { page, limit, q, sort, order });
  }
}

export async function getProductById(id) {
  try {
    return await api.get(`/product/${id}`);
  } catch (error) {
    console.warn('API không khả dụng, sử dụng mock data:', error.message);
    
    // Fallback to mock data
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }
    return product;
  }
}

// CRUD cho Admin (api.* trả body trực tiếp, KHÔNG có .data)
export async function createProduct(payload) {
  try {
    return await api.post('/product', payload);
  } catch (error) {
    console.warn('API không khả dụng:', error.message);
    // Mock response
    return { id: Date.now(), ...payload };
  }
}

export async function updateProduct(id, payload) {
  try {
    return await api.put(`/product/${id}`, payload);
  } catch (error) {
    console.warn('API không khả dụng:', error.message);
    // Mock response
    return { id, ...payload };
  }
}

export async function patchProduct(id, payload) {
  try {
    return await api.patch(`/product/${id}`, payload);
  } catch (error) {
    console.warn('API không khả dụng:', error.message);
    // Mock response
    return { id, ...payload };
  }
}

export async function deleteProduct(id) {
  try {
    return await api.delete(`/product/${id}`);
  } catch (error) {
    console.warn('API không khả dụng:', error.message);
    // Mock response
    return { success: true };
  }
}
