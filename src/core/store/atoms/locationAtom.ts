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
        setLocation((prev) => ({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          // Preserve the compass heading if GPS doesn't provide one
          heading: position.coords.heading !== null && !isNaN(position.coords.heading) 
            ? position.coords.heading 
            : prev.heading,
          error: null,
          loading: false,
        }));
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
        enableHighAccuracy: true, // Required for actual device location instead of a random cell tower
        timeout: 15000,
        maximumAge: 2000,
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

    // Compass heading fallback for stationary devices
    const handleOrientation = (event: any) => {
      let compassHeading: number | null = null;
      if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        // iOS devices
        compassHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null && event.alpha !== undefined) {
        // Android devices
        // Alpha increases counter-clockwise, so we subtract from 360 for true heading
        compassHeading = 360 - event.alpha;
      }

      if (compassHeading !== null) {
        setLocation((prev) => {
          // Only trigger a state update if heading changed by at least 2 degrees to avoid render thrashing
          if (prev.heading === null || Math.abs(prev.heading - compassHeading!) > 2) {
            return { ...prev, heading: compassHeading };
          }
          return prev;
        });
      }
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation);
    window.addEventListener("deviceorientation", handleOrientation);

    // Cleanup the watcher when the component unmounts
    return () => {
      clearTimeout(delayId);
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [setLocation, refreshKey]);

  return { location, refreshLocation };
}
