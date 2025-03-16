import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../css/error.css'; // Use the same CSS file or create a new one if needed

const ReviewError = ({ title, message, onClose, duration = 7 }) => {
  const [countdown, setCountdown] = useState(duration);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId); // Only clear the interval
    };
  }, []);

  useEffect(() => {
    // Check if countdown has expired
    if (countdown === 0) {
      setIsVisible(false);
      onClose(); // Call onClose when the countdown reaches 0
    }
  }, [countdown, onClose]);

  return (
    isVisible && (
      <div className={`error-alert-review ${isVisible ? 'visible' : ''}`}>
        <div className="error-header">
          <div className="error-circle"></div>
          <div className="error-title">{title}</div>
        </div>
        <div className="error-content">
          <p>{message}</p>
        </div>
        <div className="countdown-bar" style={{ width: `${(countdown / duration) * 100}%` }}></div>
      </div>
    )
  );
};

ReviewError.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number, // Optional duration prop, default to 7 seconds
};

export default ReviewError;
