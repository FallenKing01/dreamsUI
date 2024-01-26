import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../css/error.css'; // You'll need to create a CSS file for styling

const ErrorAlert = ({ title, message, onClose }) => {
  const [countdown, setCountdown] = useState(7);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      onClose();
    };
  }, [onClose]);

  useEffect(() => {
    // Check if countdown has expired
    if (countdown === 0) {
      setIsVisible(false);
      onClose();
    }
  }, [countdown, onClose]);

  return (
    isVisible && (
      <div className={`error-alert ${isVisible ? 'visible' : ''}`}>
        <div className="error-header">
          <div className="error-circle"></div>
          <div className="error-title">{title}</div>
        </div>
        <div className="error-content">
          <p>An error occurred</p>
          <p>{message}</p>
        </div>
        <div className="countdown-bar" style={{ width: `${(countdown / 7) * 100}%` }}></div>
      </div>
    )
  );
};

ErrorAlert.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorAlert;
