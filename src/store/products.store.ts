// Products Store - Skeleton
// TODO: Install Zustand: npm install zustand

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface ProductsStore {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
}

// Mock store for now - replace with Zustand later
export const useProductsStore = () => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    console.log('Fetching products...');
  },
  addProduct: async (product: Product) => {
    console.log('Adding product:', product);
  }
});
