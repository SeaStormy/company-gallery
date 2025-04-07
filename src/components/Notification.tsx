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
  const [isMobile, setIsMobile] = useState(false);
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
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
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

  // Calculate animation duration based on content length and device
  const getAnimationDuration = () => {
    if (!contentRef.current) return 20;

    const contentLength = notification.text.length;
    // Base speed: 1 character per 0.2 seconds
    const baseSpeed = contentLength * 0.2;
    // Add extra time for mobile to make it more readable
    const mobileFactor = isMobile ? 1.5 : 1;
    // Add extra time for longer messages
    const lengthFactor = contentLength > 50 ? 1.3 : 1;

    return Math.max(15, Math.min(60, baseSpeed * mobileFactor * lengthFactor));
  };

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
            ? ({
                position: 'absolute',
                whiteSpace: 'nowrap',
                '--marquee-duration': `${getAnimationDuration()}s`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {notification.text}
      </div>
    </div>
  );
};

export default Notification;
