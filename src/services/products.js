

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

// SECTION: Get Products - Lấy danh sách sản phẩm từ Backend
/**
 * ✅ Tích hợp với Backend API:
 * - GET /product - Lấy tất cả sản phẩm
 * - GET /product/filter - Lọc theo brand, category, pagination
 * - GET /product/categories - Lấy danh mục
 * - GET /product/brands - Lấy thương hiệu
 */
export async function getProducts({
  page = 1,
  limit = 20,
  q = '',
  sort = 'id',
  order = 'asc',
  brand = '',
  category = ''
} = {}) {
  try {
    // ✅ Nếu có filter (brand/category), dùng endpoint /product/filter
    if (brand || category) {
      const params = { page, limit };
      if (brand) params.brand = brand;
      if (category) params.category = category;
      
      const response = await api.get('/product/filter', params);
      
      // ✅ Backend trả về: { data, total, page, limit, totalPages }
      return {
        items: response.data || [],
        total: response.total || 0,
        page: response.page || page,
        limit: response.limit || limit,
        totalPages: response.totalPages || 0
      };
    }
    
    // ✅ Nếu không có filter, dùng endpoint /product (lấy tất cả)
    const response = await api.get('/product');
    
    // ✅ Backend trả về mảng sản phẩm trực tiếp
    const items = Array.isArray(response) ? response : [];
    
    // ✅ Nếu không có sản phẩm từ Backend, dùng mock data
    if (items.length === 0) {
      console.log("🔄 Backend trả về array rỗng, sử dụng mock data");
      return filterAndPaginateProducts(mockProducts, { page, limit, q, sort, order });
    }
    
    console.log("✅ Sử dụng dữ liệu thật từ Backend:", items.length, "sản phẩm");
    console.log("🔍 Cấu trúc sản phẩm đầu tiên:", items[0]);
    
    // ✅ Filter local nếu có search query
    let filteredItems = items;
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredItems = items.filter(product => 
        (product.name || '').toLowerCase().includes(searchTerm) ||
        (product.description || '').toLowerCase().includes(searchTerm)
      );
    }
    
    // ✅ Pagination local
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    return {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      limit,
      totalPages: Math.ceil(filteredItems.length / limit)
    };
  } catch (error) {
    console.warn('Backend API không khả dụng, sử dụng mock data:', error.message);
    
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

// SECTION: Categories & Brands - Lấy danh mục và thương hiệu từ Backend
/**
 * ✅ Lấy danh sách categories từ Backend
 * GET /product/categories
 */
export async function getCategories() {
  try {
    const response = await api.get('/product/categories');
    // ✅ Backend trả về mảng categories trực tiếp
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.warn('Backend API không khả dụng, sử dụng mock categories:', error.message);
    // Mock categories fallback
    return ['Laptop', 'Desktop', 'Accessories', 'Gaming'];
  }
}

/**
 * ✅ Lấy danh sách brands từ Backend
 * GET /product/brands
 */
export async function getBrands(category = '') {
  try {
    const params = category ? { category } : {};
    const response = await api.get('/product/brands', params);
    // ✅ Backend trả về mảng brands trực tiếp
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.warn('Backend API không khả dụng, sử dụng mock brands:', error.message);
    // Mock brands fallback
    return ['Lenovo', 'ASUS', 'MSI', 'Dell', 'HP', 'Acer'];
  }
}
