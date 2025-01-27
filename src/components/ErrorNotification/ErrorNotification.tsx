import React from 'react';
import './ErrorNotification.css';
import { useTheme } from 'context/ThemeContext';

interface ErrorNotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, show, onClose }) => {
  const { theme } = useTheme();
  if (!show) return null;

  return (
    <div className={`error-notification ${theme}`}>
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default ErrorNotification;