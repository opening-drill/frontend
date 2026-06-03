import { useState, useEffect } from 'react';

export type DeviceType = 'commander' | 'base-ops';

/**
 * A mocked hook to determine device type for routing to the correct subapp.
 * In a real application, this could use user-agent parsing, a specific login role,
 * or mobile/desktop width breakpoints.
 */
export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('base-ops');

  useEffect(() => {
    // For demonstration purposes, we will use window width to mock the device.
    // E.g., mobile devices (< 768px) get 'commander' and desktop (>= 768px) get 'base-ops'
    const handleResize = () => {
      setDeviceType(window.innerWidth < 768 ? 'commander' : 'base-ops');
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}
