// Mock data cho Admin Dashboard
export const adminStats = {
  totalUsers: 1250,
  totalProducts: 89,
  totalOrders: 456,
  totalRevenue: 12500000,
  monthlyGrowth: 15.5,
  activeUsers: 890
};

export const recentOrders = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    product: "Laptop Dell XPS 13",
    amount: 25000000,
    status: "completed",
    date: "2024-01-15"
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    product: "MacBook Pro M2",
    amount: 45000000,
    status: "pending",
    date: "2024-01-14"
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    product: "Laptop Asus ROG",
    amount: 32000000,
    status: "processing",
    date: "2024-01-13"
  },
  {
    id: 4,
    customerName: "Phạm Thị D",
    product: "Laptop HP Pavilion",
    amount: 18000000,
    status: "completed",
    date: "2024-01-12"
  }
];

export const topProducts = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    sales: 45,
    revenue: 1125000000,
    image: "/src/assets/img/sanpham1.jpg"
  },
  {
    id: 2,
    name: "MacBook Pro M2",
    sales: 32,
    revenue: 1440000000,
    image: "/src/assets/img/sanpham1.jpg"
  },
  {
    id: 3,
    name: "Laptop Asus ROG",
    sales: 28,
    revenue: 896000000,
    image: "/src/assets/img/sanpham1.jpg"
  }
];

export const userAnalytics = {
  newUsers: [120, 150, 180, 200, 250, 300, 280],
  activeUsers: [800, 850, 900, 950, 1000, 1050, 1100],
  labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"]
};

export const productCategories = [
  { name: "Laptop Gaming", count: 25, percentage: 28 },
  { name: "Laptop Văn phòng", count: 35, percentage: 39 },
  { name: "Laptop Đồ họa", count: 15, percentage: 17 },
  { name: "Phụ kiện", count: 14, percentage: 16 }
];
