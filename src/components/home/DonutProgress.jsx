import React from 'react';

const DonutProgress = ({ value, max, label, sublabels }) => {
  const percentage = (value / max) * 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-progress">
      <div className="donut-header">
        <h3>{label}</h3>
        <div className="donut-navigation">
          <button className="nav-btn">‹</button>
          <button className="nav-btn">›</button>
        </div>
      </div>
      
      <div className="donut-content">
        <div className="donut-chart">
          <svg width="150" height="150" viewBox="0 0 150 150">
            {/* Background circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 75 75)"
            />
          </svg>
          
          <div className="donut-center">
            <div className="progress-text">
              <span className="progress-value">{value}</span>
              <span className="progress-max">/{max}</span>
            </div>
            <div className="progress-label">Hoàn thành</div>
          </div>
        </div>
        
        <div className="donut-goals">
          <h4>Mục tiêu</h4>
          {sublabels.map((goal, index) => (
            <div key={index} className="goal-item">
              <div className="goal-info">
                <span className="goal-label">{goal.label}</span>
                <span className="goal-progress">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <div className="goal-bar">
                <div 
                  className="goal-fill"
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutProgress;
