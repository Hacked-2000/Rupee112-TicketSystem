import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={overlayStyle}>
      <div className="spinner"></div>
      <style>
        {`
          .spinner {
            width: 60px;
            height: 60px;
            border: 6px solid #ccc;
            border-top: 6px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

export default LoadingSpinner;
