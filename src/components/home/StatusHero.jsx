import React from 'react';
import StatusCard from './StatusCard';
import './StatusHero.css';

const StatusHero = ({ metrics }) => {
  const statusItems = [
    {
      title: 'Đơn hàng cần giao',
      count: metrics.ordersToShip.count,
      total: metrics.ordersToShip.total,
      subtext: metrics.ordersToShip.subtext,
      icon: '🚚',
      intent: 'primary',
              onClick: () => window.location.href = '/admin/orders/processing?filter=to_ship',
      action: 'In nhãn'
    },
    {
      title: 'Hàng trả lại',
      count: metrics.returns.count,
      total: metrics.returns.total,
      subtext: metrics.returns.subtext,
      icon: '↩️',
      intent: 'warning',
              onClick: () => window.location.href = '/admin/orders/returns?filter=pending',
      action: 'Xử lý'
    },
    {
      title: 'Sản phẩm bị từ chối',
      count: metrics.rejectedProducts.count,
      total: metrics.rejectedProducts.total,
      subtext: metrics.rejectedProducts.subtext,
      icon: '❌',
      intent: 'danger',
              onClick: () => window.location.href = '/admin/products/rejected',
      action: 'Duyệt'
    },
    {
      title: 'Còn ít',
      count: metrics.lowStock.count,
      total: metrics.lowStock.total,
      subtext: metrics.lowStock.subtext,
      icon: '⚠️',
      intent: 'warning',
              onClick: () => window.location.href = '/admin/products/inventory?filter=low_stock',
      action: 'Nhập hàng'
    },
    {
      title: 'Đánh giá tiêu cực',
      count: metrics.negativeReviews.count,
      total: metrics.negativeReviews.total,
      subtext: metrics.negativeReviews.subtext,
      icon: '😞',
      intent: 'danger',
              onClick: () => window.location.href = '/admin/orders/disputes',
      action: 'Xử lý'
    },
    {
      title: 'Đơn chờ xác nhận',
      count: metrics.pendingOrders.count,
      total: metrics.pendingOrders.total,
      subtext: metrics.pendingOrders.subtext,
      icon: '⏳',
      intent: 'info',
              onClick: () => window.location.href = '/admin/orders/pending',
      action: 'Xác nhận'
    }
  ];

  return (
    <div className="status-hero">
      <div className="status-hero-grid">
        {statusItems.map((item, index) => (
          <StatusCard
            key={index}
            {...item}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusHero;
