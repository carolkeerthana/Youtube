import React, { useEffect } from 'react';
import './CustomNotification.css'; // Style this component as per your design

const CustomNotification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Adjust the timer duration (in milliseconds) as needed

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="custom-notification">
      <p>{message}</p>
    </div>
  );
};

export default CustomNotification;
