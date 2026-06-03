import React, { createContext, useContext, useState, useCallback } from 'react';
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
  markAsRead: (id: string) => void;
}

const ChiefToastContext = createContext<ChiefToastContextType | undefined>(undefined);

/** Toast stays visible for exactly 10 seconds and never blocks the UI */
const TOAST_DURATION = 10000; // ms

export const ChiefToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

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
        read: false,
      };

      // Add the newest toast on top of the stack
      setNotifications((prev) => [newItem, ...prev]);

      // Show toast – no cooldown, auto‑close after 10 s, custom progress bar inside component
      toast(
        ({ closeToast }) => (
          <ChiefToast
            type={type}
            location={location}
            arrivalTime={arrivalTime}
            closeToast={closeToast}
            duration={TOAST_DURATION}
          />
        ),
        {
          toastId: id,
          autoClose: TOAST_DURATION,
          hideProgressBar: true, // we render our own progress bar
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          closeButton: false,
        }
      );
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

  return (
    <ChiefToastContext.Provider value={{ notifications, addNotification, clearNotifications, markAsRead }}>
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
