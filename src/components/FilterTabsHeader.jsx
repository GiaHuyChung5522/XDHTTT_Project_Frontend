import React from 'react';
import './FilterTabsHeader.css';

const FilterTabsHeader = ({ title, options = [], value, onChange, total }) => {
  return (
    <div className="filter-tabs-header">
      <div className="filter-tabs-header__title">
        <h2>{title}</h2>
        {total && <span className="filter-tabs-header__total">({total} sản phẩm)</span>}
      </div>
      
      {options.length > 0 && (
        <div className="filter-tabs-header__tabs">
          <button
            className={`filter-tabs-header__tab ${!value ? 'active' : ''}`}
            onClick={() => onChange('')}
          >
            Tất cả
          </button>
          {options.map((option) => (
            <button
              key={option}
              className={`filter-tabs-header__tab ${value === option ? 'active' : ''}`}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterTabsHeader;
