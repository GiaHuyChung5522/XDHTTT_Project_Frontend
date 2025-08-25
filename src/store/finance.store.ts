// Finance Store - Skeleton
interface FinanceMetrics {
  revenue: number;
  profit: number;
  orders: number;
}

interface FinanceStore {
  dailyMetrics: FinanceMetrics;
  monthlyMetrics: FinanceMetrics;
  loading: boolean;
  fetchDailyMetrics: () => Promise<void>;
  fetchMonthlyMetrics: () => Promise<void>;
}

export const useFinanceStore = () => ({
  dailyMetrics: { revenue: 0, profit: 0, orders: 0 },
  monthlyMetrics: { revenue: 0, profit: 0, orders: 0 },
  loading: false,
  fetchDailyMetrics: async () => {
    console.log('Fetching daily metrics...');
  },
  fetchMonthlyMetrics: async () => {
    console.log('Fetching monthly metrics...');
  }
});
