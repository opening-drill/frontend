import { atom, useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';


// Define the type for our location state
export type LocationState = {
  latitude: number | null; // Decimal degrees (WGS 84)
  longitude: number | null; // Decimal degrees (WGS 84)
  heading: number | null; // Degrees clockwise from true north (0-360)
  error: string | null;
  loading: boolean;
};

// Create the Jotai atom with initial state
export const locationAtom = atom<LocationState>({
  latitude: null,
  longitude: null,
  heading: null,
  error: null,
  loading: true,
});

/**
 * Custom hook to manage and retrieve device location.
 * Prompts the user for geolocation permissions automatically on mount.
 */
export function useDeviceLocation() {
  const [location, setLocation] = useAtom(locationAtom);

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshLocation = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocation((prev) => ({
        ...prev,
        error: 'הדפדפן שלך אינו תומך במיקום',
        loading: false,
      }));
      return;
    }

    if (window.isSecureContext === false) {
      setLocation((prev) => ({
        ...prev,
        error: 'נדרש חיבור מאובטח (HTTPS)',
        loading: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    let watchId: number;

    // Small delay ensures the "Loading..." UI flashes if the user clicks to retry
    const delayId = setTimeout(() => {
      watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'שגיאה לא ידועה באיתור המיקום';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'נא לאשר גישה למיקום בהגדרות הדפדפן';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'מידע על המיקום אינו זמין כעת';
            break;
          case error.TIMEOUT:
            errorMessage = 'פג הזמן לבקשת המיקום';
            break;
        }
        setLocation((prev) => ({ ...prev, error: errorMessage, loading: false }));
      },
      {
        enableHighAccuracy: false, // Low accuracy is much more reliable on mobile devices
        timeout: 10000,
        maximumAge: 5000,
      }
    );
    }, 400);

    // Listen for permission changes so we can auto-refresh if they grant it later
    let permissionStatus: PermissionStatus | null = null;
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          permissionStatus = status;
          status.onchange = () => {
            if (status.state === "granted") {
              setRefreshKey((prev) => prev + 1);
            }
          };
        })
        .catch(() => {
          // Ignored, some browsers don't support geolocation permission query fully
        });
    }

    // Cleanup the watcher when the component unmounts
    return () => {
      clearTimeout(delayId);
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [setLocation, refreshKey]);

  return { location, refreshLocation };
}
