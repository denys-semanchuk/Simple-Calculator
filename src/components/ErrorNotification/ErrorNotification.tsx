import React from 'react';
import './ErrorNotification.css';

interface ErrorNotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, show, onClose }) => {
  if (!show) return null;

  return (
    <div className="error-notification">
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default ErrorNotification;