import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../services/api';
import { useTranslation } from 'react-i18next';

interface NotificationProps {
  text?: { [key: string]: string };
  isVisible?: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  text,
  isVisible,
  onClose,
}) => {
  const { i18n } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <p>{text?.[i18n.language] || 'Default notification text'}</p>
        <button onClick={onClose} className="ml-4">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
