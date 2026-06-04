import { useEffect } from 'react';
import { initializeLiveSocket } from '../core/server/socket';
import { useChiefToast } from '../features/chief/context/ChiefToastContext';
import type { EventUpdate } from '../types/hamel';

export function useBombNotification() {
  const { addNotification } = useChiefToast();

  useEffect(() => {
    const socket = initializeLiveSocket();

    const onEventUpdate = (e: EventUpdate) => {
      if (e.phase === 'struck') {
        // 💣 BOMB DROPPED — show the pop-up
        addNotification('approved', e.message ?? 'הפצצה הוטלה על היעד', new Date().toLocaleTimeString());
      } else if (e.phase === 'aborted') {
        addNotification('cancelled', e.message ?? 'השיגור בוטל', new Date().toLocaleTimeString());
      }
    };

    socket.on('event:update', onEventUpdate);
    
    return () => { 
      socket.off('event:update', onEventUpdate); 
    };
  }, [addNotification]);
}
