// Date Utilities - Skeleton
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('vi-VN');
};

export const getDateRange = (days: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
};

export const getMonthRange = (months: number) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - months);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
};
