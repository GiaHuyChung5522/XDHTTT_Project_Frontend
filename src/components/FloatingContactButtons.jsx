import React, { useState } from 'react';
import { Tooltip } from 'antd';
import './FloatingContactButtons.css';

const FloatingContactButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCall = () => {
    window.open('tel:1900123456', '_self');
  };

  const handleZalo = () => {
    window.open('https://zalo.me/1900123456', '_blank');
  };

  const handleMessenger = () => {
    window.open('https://m.me/7nfashion', '_blank');
  };

  return (
    <div className="floating-contact-buttons">
      <div className={`contact-buttons ${isExpanded ? 'expanded' : ''}`}>
        {/* Call Button */}
        <Tooltip title="Gọi điện thoại: 1900 123 456" placement="left">
          <button 
            className="contact-btn call-btn"
            onClick={handleCall}
            aria-label="Gọi điện thoại"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </button>
        </Tooltip>

        {/* Zalo Button */}
        <Tooltip title="Chat Zalo: 1900 123 456" placement="left">
          <button 
            className="contact-btn zalo-btn"
            onClick={handleZalo}
            aria-label="Chat Zalo"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
        </Tooltip>

        {/* Messenger Button */}
        <Tooltip title="Chat Facebook Messenger" placement="left">
          <button 
            className="contact-btn messenger-btn"
            onClick={handleMessenger}
            aria-label="Chat Messenger"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Toggle Button */}
      <button 
        className="toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className={`toggle-icon ${isExpanded ? 'rotated' : ''}`}
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </button>
    </div>
  );
};

export default FloatingContactButtons;
