import React, { createContext, useCallback, useContext, useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChiefToast } from '../components/ChiefToast';

export interface NotificationItem {
  id: string;
  type: 'approved' | 'cancelled';
  location: string;
  arrivalTime?: string;
  timestamp: string;
  read: boolean;
}

/** Context shape – no cooldown logic */
interface ChiefToastContextType {
  notifications: NotificationItem[];
  addNotification: (type: 'approved' | 'cancelled', location: string, arrivalTime?: string) => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
}

const ChiefToastContext = createContext<ChiefToastContextType | undefined>(undefined);

/** Toast stays visible for exactly 10 seconds and never blocks the UI */
const TOAST_DURATION = 10000; // ms

export const ChiefToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  
  const isCenterOpenRef = useRef(false);

  useEffect(() => {
    isCenterOpenRef.current = isNotificationCenterOpen;
    if (isNotificationCenterOpen) {
      toast.dismiss(); // Clear all visible popup toasts immediately
      toast.clearWaitingQueue(); // Clear any toasts that are waiting in the queue because of the limit
    }
  }, [isNotificationCenterOpen]);

  const addNotification = useCallback(
    (type: 'approved' | 'cancelled', location: string, arrivalTime?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const now = new Date();
      const timestamp = now.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const newItem: NotificationItem = {
        id,
        type,
        location,
        arrivalTime,
        timestamp,
        read: isCenterOpenRef.current, // Instantly read if center is open
      };

      // Add the newest toast on top of the stack
      setNotifications((prev) => [newItem, ...prev]);

      if (!isCenterOpenRef.current) {
        toast(
        ({ closeToast }) => {
          const handleClose = () => {
            // Marking as read when closed via 'X' on the toast popup
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            if (closeToast) closeToast();
          };
          return (
            <ChiefToast
              type={type}
              location={location}
              arrivalTime={arrivalTime}
              closeToast={handleClose}
              duration={TOAST_DURATION}
            />
          );
        },
        {
          toastId: id,
          autoClose: TOAST_DURATION,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          closeButton: false,
          icon: false,
          type: type === 'approved' ? 'success' : 'error',
        }
      );
      }
    },
    []
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    toast.dismiss();
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // If it's still an active toastify toast, dismiss it too
    toast.dismiss(id);
  }, []);

  return (
    <ChiefToastContext.Provider value={{ 
      notifications, 
      addNotification, 
      clearNotifications, 
      removeNotification,
      markAsRead,
      markAllAsRead,
      isNotificationCenterOpen,
      setIsNotificationCenterOpen
    }}>
      {children}
    </ChiefToastContext.Provider>
  );
};

export const useChiefToast = () => {
  const context = useContext(ChiefToastContext);
  if (!context) {
    throw new Error('useChiefToast must be used within a ChiefToastProvider');
  }
  return context;
};
