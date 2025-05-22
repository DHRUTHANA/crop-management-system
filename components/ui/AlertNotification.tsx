import React from 'react';

interface AlertNotificationProps {
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  onClose?: () => void;
}

const typeStyles = {
  warning: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
      </svg>
    ),
  },
  success: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
};

const AlertNotification: React.FC<AlertNotificationProps> = ({ type, message, onClose }) => {
  const styles = typeStyles[type] || typeStyles.info;

  return (
    <div className={`${styles.bg} ${styles.text} px-4 py-3 rounded-md flex items-center shadow-md mb-4`}>
      {styles.icon}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className={`${styles.text} focus:outline-none ml-4`}
          aria-label="Close alert"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertNotification;
