import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../services/api';

interface NotificationProps {
  onHeightChange: (height: number) => void;
}

const Notification: React.FC<NotificationProps> = ({ onHeightChange }) => {
  const [notification, setNotification] = useState<{
    text: string;
    isActive: boolean;
  } | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(`${API_URL}/api/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.notification?.isActive) {
            setNotification(data.notification);
          }
        }
      } catch (error) {
        console.error('Error fetching notification:', error);
      }
    };

    fetchNotification();
  }, []);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.offsetWidth;
      setShouldScroll(contentWidth > containerWidth);
      onHeightChange(notification?.isActive ? 40 : 0);
    }
  }, [notification, onHeightChange]);

  if (!notification?.isActive) return null;

  return (
    <div
      ref={containerRef}
      className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap relative"
      style={{ height: '40px' }}
    >
      <div
        ref={contentRef}
        className={`inline-block ${
          shouldScroll ? 'animate-marquee' : 'text-center w-full'
        }`}
        style={
          shouldScroll
            ? {
                position: 'absolute',
                whiteSpace: 'nowrap',
                animation: 'marquee 20s linear infinite',
                paddingLeft: '100%',
              }
            : undefined
        }
      >
        {notification.text}
      </div>
    </div>
  );
};

export default Notification;
