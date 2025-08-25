import React from 'react';

const TrendLine = ({ series, interval }) => {
  // Mock chart - sẽ thay thế bằng Chart.js hoặc Recharts sau
  const maxValue = Math.max(...series[0].data.map(d => d.y));
  const minValue = Math.min(...series[0].data.map(d => d.y));
  const range = maxValue - minValue;

  return (
    <div className="trend-line">
      <div className="chart-container">
        <div className="chart-y-axis">
          <span>{Math.round(maxValue / 1000000)}M</span>
          <span>{Math.round((maxValue + minValue) / 2 / 1000000)}M</span>
          <span>{Math.round(minValue / 1000000)}M</span>
        </div>
        
        <div className="chart-area">
          <svg width="100%" height="200" viewBox="0 0 400 200">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={series[0].data.map((d, i) => 
                `${(i * 400) / (series[0].data.length - 1)},${200 - ((d.y - minValue) / range) * 180}`
              ).join(' ')}
            />
            {series[0].data.map((d, i) => (
              <circle
                key={i}
                cx={(i * 400) / (series[0].data.length - 1)}
                cy={200 - ((d.y - minValue) / range) * 180}
                r="4"
                fill="#3b82f6"
              />
            ))}
          </svg>
        </div>
        
        <div className="chart-x-axis">
          {series[0].data.map((d, i) => (
            <span key={i} className="x-label">{d.x}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendLine;
