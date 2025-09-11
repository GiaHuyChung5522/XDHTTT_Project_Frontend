// services/products.js
import { api } from '../lib/api';

// Category mapping để chuyển đổi tên category sang categoryId
const categoryMap = {
  'Laptop văn phòng': 'CAT-001',
  'Laptop gaming': 'CAT-002', 
  'Laptop đồ họa': 'CAT-003',
  'Laptop sinh viên': 'CAT-004'
};

// Helper function to handle API response
const handleApiResponse = (response) => {
  if (!response) {
    throw new Error('No response received');
  }
  
  // Handle different response structures
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response.data) {
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [response.data];
  }
  
  return [response];
};

// Helper function to transform product data
const transformProduct = (product, index = 0) => ({
  id: product._id || product.id || index.toString(),
  name: product.name || 'Unnamed Product',
  price: product.price || 0,
  image: product.imageUrl || product.image || '/laptop-fallback.png',
  description: product.description || '',
  brand: product.brand || '',
  model: product.model || '',
  stock: product.stock || 0,
  category: product.categoryId || 'Unknown',
  isActive: product.isActive !== false,
  isOnPromotion: product.isOnPromotion || false,
  discountPercentage: product.discountPercentage || 0,
  specifications: product.specifications || {},
  sub_images: product.sub_images || [],
  configurations: product.configurations || [],
  combos: product.combos || [],
  createdAt: product.createdAt || new Date().toISOString(),
  updatedAt: product.updatedAt || new Date().toISOString(),
});

// Mock data fallback khi backend không chạy
const mockProducts = [
  {
    _id: 'mock-1',
    name: 'Laptop Gaming ASUS ROG Strix G15',
    price: 25990000,
    originalPrice: 28990000,
    discount: 10,
    category: 'Laptop gaming',
    brand: 'ASUS',
    imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+Gaming',
    stock: 15,
    rating: 4.8,
    reviews: 156,
    specifications: {
      cpu: 'Intel Core i7-12700H',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      gpu: 'RTX 3060 6GB',
      display: '15.6" FHD 144Hz'
    },
    sub_images: [
      'https://via.placeholder.com/300x200?text=Image+1',
      'https://via.placeholder.com/300x200?text=Image+2'
    ],
    configurations: [
      { name: 'RAM 16GB', price: 0 },
      { name: 'RAM 32GB', price: 2000000 }
    ],
    combos: [
      { name: 'Combo Gaming', price: 500000, items: ['Chuột gaming', 'Bàn phím cơ'] }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-2',
    name: 'Laptop Văn phòng Dell Inspiron 15',
    price: 18990000,
    originalPrice: 20990000,
    discount: 9,
    category: 'Laptop văn phòng',
    brand: 'Dell',
    imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+Office',
    stock: 8,
    rating: 4.5,
    reviews: 89,
    specifications: {
      cpu: 'Intel Core i5-1235U',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      gpu: 'Intel Iris Xe',
      display: '15.6" FHD'
    },
    sub_images: [
      'https://via.placeholder.com/300x200?text=Image+1',
      'https://via.placeholder.com/300x200?text=Image+2'
    ],
    configurations: [
      { name: 'RAM 8GB', price: 0 },
      { name: 'RAM 16GB', price: 1500000 }
    ],
    combos: [
      { name: 'Combo Văn phòng', price: 300000, items: ['Chuột không dây', 'Túi đựng laptop'] }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-3',
    name: 'Laptop Gaming MSI Katana GF66',
    price: 22990000,
    originalPrice: 25990000,
    discount: 11,
    category: 'Laptop gaming',
    brand: 'MSI',
    imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+MSI',
    stock: 12,
    rating: 4.7,
    reviews: 203,
    specifications: {
      cpu: 'Intel Core i7-11800H',
      ram: '16GB DDR4',
      storage: '1TB SSD',
      gpu: 'RTX 3050 Ti 4GB',
      display: '15.6" FHD 144Hz'
    },
    sub_images: [
      'https://via.placeholder.com/300x200?text=Image+1',
      'https://via.placeholder.com/300x200?text=Image+2'
    ],
    configurations: [
      { name: 'RAM 16GB', price: 0 },
      { name: 'RAM 32GB', price: 2500000 }
    ],
    combos: [
      { name: 'Combo Gaming Pro', price: 800000, items: ['Chuột gaming', 'Bàn phím cơ', 'Tai nghe gaming'] }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getProducts = async (params = {}) => {
  try {
    console.log('🔄 Loading products from backend...', params);
    
    // Chuyển đổi category name sang categoryId nếu có
    const apiParams = { ...params };
    if (params.category && categoryMap[params.category]) {
      apiParams.categoryId = categoryMap[params.category];
      delete apiParams.category;
    }
    
    const response = await api.get('/api/public/product/filter', { params: apiParams });
    console.log('📦 Products response:', response);
    
    const productsData = handleApiResponse(response);
    console.log('📦 Products data structure:', productsData);
    
    // Transform backend data to frontend format
    const transformedProducts = productsData.map(transformProduct);

    return {
      success: true,
      data: transformedProducts,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: transformedProducts.length,
        totalPages: Math.ceil(transformedProducts.length / (params.limit || 10))
      }
    };
  } catch (error) {
    console.error('❌ Error loading products:', error);
    
    // Fallback to mock data when backend is not available
    console.log('🔄 Using mock data as fallback...');
    
    let filteredProducts = [...mockProducts];
    
    // Apply filters to mock data
    if (params.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }
    
    if (params.brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === params.brand);
    }
    
    if (params.q) {
      const searchTerm = params.q.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedProducts,
      pagination: {
        page: page,
        limit: limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      }
    };
  }
};

export const getProductById = async (id) => {
  try {
    console.log('🔄 Loading product by ID:', id);
    
    // Validate ID format
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid product ID');
    }
    
    // Try direct API call first
    try {
      const response = await api.get(`/api/public/product/${id}`);
      console.log('📦 Direct product response:', response);
      
      if (response && response.data) {
        const transformedProduct = transformProduct(response.data);
        console.log('📦 Transformed product:', transformedProduct);
        
        return {
          success: true,
          data: transformedProduct
        };
      }
    } catch (directError) {
      console.log('⚠️ Direct API failed, trying filter API...', directError.message);
    }
    
    // Fallback: Use public filter API to get product by ID
    const response = await api.get(`/api/public/product/filter?page=1&limit=1000`);
    console.log('📦 Product response:', response);
    
    const productsData = handleApiResponse(response);
    console.log('📦 Products data after handleApiResponse:', productsData);
    
    const product = productsData.find(p => p._id === id || p.id === id);
    console.log('📦 Found product:', product);
    
    if (!product) {
      throw new Error(`Product with ID "${id}" not found`);
    }

    const transformedProduct = transformProduct(product);
    console.log('📦 Transformed product:', transformedProduct);

    return {
      success: true,
      data: transformedProduct
    };
  } catch (error) {
    console.error('❌ Error loading product:', error);
    
    // Fallback to mock data when backend is not available
    console.log('🔄 Using mock data as fallback for product ID:', id);
    
    const mockProduct = mockProducts.find(p => p._id === id);
    if (mockProduct) {
      return {
        success: true,
        data: mockProduct
      };
    }
    
    // Return a more helpful error message
    throw new Error(`Sản phẩm với ID "${id}" không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn.`);
  }
};

export const searchProducts = async (query, params = {}) => {
  try {
    console.log('🔄 Searching products:', query, params);
    
    const searchParams = {
      ...params,
      q: query
    };
    
    const response = await api.get('/api/product/filter', { params: searchParams });
    console.log('📦 Search response:', response);
    
    const productsData = handleApiResponse(response);
    
    // Transform backend data to frontend format
    const transformedProducts = productsData.map(transformProduct);

    return {
      success: true,
      data: transformedProducts,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: transformedProducts.length,
        totalPages: Math.ceil(transformedProducts.length / (params.limit || 10))
      }
    };
  } catch (error) {
    console.error('❌ Error searching products:', error);
    throw new Error(`Không thể tìm kiếm sản phẩm: ${error.message}`);
  }
};

export const getProductsByCategory = async (category, params = {}) => {
  try {
    console.log('🔄 Loading products by category:', category, params);
    
    const categoryParams = {
      ...params,
      categoryId: categoryMap[category] || category
    };
    
    const response = await api.get('/api/product/filter', { params: categoryParams });
    console.log('📦 Category products response:', response);
    
    const productsData = handleApiResponse(response);
    
    // Transform backend data to frontend format
    const transformedProducts = productsData.map(transformProduct);

    return {
      success: true,
      data: transformedProducts,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: transformedProducts.length,
        totalPages: Math.ceil(transformedProducts.length / (params.limit || 10))
      }
    };
  } catch (error) {
    console.error('❌ Error loading products by category:', error);
    throw new Error(`Không thể tải sản phẩm theo danh mục: ${error.message}`);
  }
};

export const getFeaturedProducts = async (limit = 8) => {
  try {
    console.log('🔄 Loading featured products...');
    
    const response = await api.get(`/api/product?limit=${limit}&featured=true`);
    console.log('📦 Featured products response:', response);
    
    const productsData = handleApiResponse(response);
    
    // Transform backend data to frontend format
    const transformedProducts = productsData.map(transformProduct);

    return {
      success: true,
      data: transformedProducts
    };
  } catch (error) {
    console.error('❌ Error loading featured products:', error);
    throw new Error(`Không thể tải sản phẩm nổi bật: ${error.message}`);
  }
};

export const getPromotionProducts = async (limit = 8) => {
  try {
    console.log('🔄 Loading promotion products...');
    
    const response = await api.get(`/api/product?limit=${limit}&promotion=true`);
    console.log('📦 Promotion products response:', response);
    
    const productsData = handleApiResponse(response);
    
    // Transform backend data to frontend format
    const transformedProducts = productsData.map(transformProduct);

    return {
      success: true,
      data: transformedProducts
    };
  } catch (error) {
    console.error('❌ Error loading promotion products:', error);
    throw new Error(`Không thể tải sản phẩm khuyến mãi: ${error.message}`);
  }
};