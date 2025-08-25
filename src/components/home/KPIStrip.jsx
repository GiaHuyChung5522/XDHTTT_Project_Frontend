import React from 'react';

const KPIStrip = ({ data }) => {
  return (
    <div className="kpi-strip">
      {data.map((kpi, index) => (
        <div key={index} className="kpi-card" title={kpi.tooltip}>
          <div className="kpi-label">{kpi.label}</div>
          <div className="kpi-value">{kpi.value}</div>
          {kpi.delta && (
            <div className={`kpi-delta ${kpi.delta.startsWith('+') ? 'positive' : 'negative'}`}>
              {kpi.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPIStrip;
