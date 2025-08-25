import React from 'react';

const StatusCard = ({ title, count, total, subtext, icon, intent, onClick, action }) => {
  const getIntentColor = (intent) => {
    switch (intent) {
      case 'primary': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      case 'info': return '#06b6d4';
      case 'success': return '#10b981';
      default: return '#6b7280';
    }
  };

  const isCompleted = count === 0;

  return (
    <div 
      className={`status-card ${isCompleted ? 'completed' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="status-card-header">
        <span className="status-icon" style={{ color: getIntentColor(intent) }}>
          {icon}
        </span>
        <div className="status-count">
          <span className="count-number">{count}</span>
          {total > 0 && <span className="count-total">/{total}</span>}
        </div>
      </div>
      
      <div className="status-card-content">
        <h4 className="status-title">{title}</h4>
        <p className="status-subtext">{subtext}</p>
      </div>
      
      {!isCompleted && action && (
        <button 
          className="status-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {action}
        </button>
      )}
      
      {isCompleted && (
        <div className="status-completed-badge">
          ✅ Hoàn thành
        </div>
      )}
    </div>
  );
};

export default StatusCard;
