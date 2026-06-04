import { OpenCameraButton } from './components/openCameraButton';

import { useEffect, useRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useDeviceLocation } from '../../core/store/atoms/locationAtom';
import GenericMap from '../map/components/GenericMap';
import { useMap } from '../map/MapProvider';
import { NotificationCenter } from './components/NotificationCenter';
import { TopBar } from './components/TopBar';

import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Box, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useAtomValue } from 'jotai';
import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lastMapInteractionAtom } from '../../core/store/atoms/mapInteractionAtom';
import { useBombNotification } from '../../hooks/useBombNotification';
import { ChiefToastProvider } from './context/ChiefToastContext';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100dvh',
    width: '100vw',
    overflow: 'hidden',
    position: 'relative',
  },
  cameraButtonContainer: {
    position: 'fixed',
    bottom: 55,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
      bottom: 30,
    }
  },
  recenterButtonContainer: {
    position: 'fixed',
    bottom: 55,
    left: 20, // using left here because RTL will flip it to physical right
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
      bottom: 30,
      left: 15,
    }
  },
  recenterCircle: {
    background: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: 'blur(12px)',
    border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`,
    color: theme.palette.text.primary,
    width: 56,
    height: 56,
    '&:hover': {
      background: alpha(theme.palette.background.paper, 0.95),
    },
    [theme.breakpoints.down('sm')]: {
      width: 48,
      height: 48,
    }
  },
  toastContainer: {
    position: 'fixed' as any,
    top: '90px !important', // Moved down to appear below the TopBar
    left: '50% !important',
    transform: 'translateX(-50%) !important',
    padding: '0 !important',
    width: '420px !important',
    maxWidth: '95vw !important',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // Override the native react-toastify variables for the progress bar color
    '--toastify-color-progress-light': 'rgba(255, 255, 255, 0.4)',
    '--toastify-color-progress-dark': 'rgba(255, 255, 255, 0.4)',
    '--toastify-color-progress-default': 'rgba(255, 255, 255, 0.4)',
    '--toastify-color-progress-success': '#2ecc71',
    '--toastify-color-progress-error': '#ff3b30',
    '& .Toastify__toast': {
      width: 'max-content !important', // Shrink-wrap the exact width of the ChiefToast card
      background: 'none !important',
      boxShadow: 'none !important',
      padding: '0 !important',
      marginBottom: '16px !important',
      borderRadius: '16px !important',
      overflow: 'visible !important',
      display: 'flex',
      justifyContent: 'center',
    },
    '& .Toastify__toast-body': {
      width: '100% !important',
      padding: '0 !important',
      margin: '0 !important',
      display: 'flex',
      justifyContent: 'center',
    },
    '& .Toastify__progress-bar': {
      height: '8px !important',
      bottom: '0 !important',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
      zIndex: 10,
    },
  },
  testControls: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    padding: '16px',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
  testButton: {
    fontWeight: 'bold',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '8px',
  },
}));

const ChiefAppContent: React.FC = () => {
  const { classes } = useStyles();
  const { location, refreshLocation } = useDeviceLocation();
  const { goToLocation } = useMap();
  
  // Initialize bomb drop socket listener
  useBombNotification();

  const handleRecenter = async () => {
    // Request compass permission for iOS 13+ devices
    // This must be triggered by a user gesture, so the Recenter button is the perfect place
    if (typeof (DeviceOrientationEvent as any) !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          // Trigger a re-render to ensure the listener is active
          refreshLocation();
        }
      } catch (err) {
        console.error('Error requesting compass permission:', err);
      }
    }

    if (location.error) {
      refreshLocation();
    } else if (location.longitude && location.latitude) {
      goToLocation([location.longitude, location.latitude]);
    }
  };

  const hasCenteredRef = useRef(false);
  const lastUpdateRef = useRef<number>(Date.now());
  const lastMapInteraction = useAtomValue(lastMapInteractionAtom);

  // Auto-center effect with interaction cooldown
  useEffect(() => {
    if (!location.latitude || !location.longitude) return;

    // Center the map immediately on first load
    if (!hasCenteredRef.current) {
      goToLocation([location.longitude, location.latitude], 19.5);
      hasCenteredRef.current = true;
      lastUpdateRef.current = Date.now();
      return;
    }

    // If we don't have a compass heading, we don't auto-track 
    // (per the requirement: "when there is a heading...")
    if (location.heading === null || location.heading === undefined) {
      return;
    }

    const checkAndTrack = () => {
      const now = Date.now();
      const timeSinceInteraction = now - lastMapInteraction;
      
      // Cooldown: wait 3 seconds after the user touches the map before resuming
      if (timeSinceInteraction >= 3000) {
        const timeSinceLastUpdate = now - lastUpdateRef.current;
        // Re-center every 1 second
        if (timeSinceLastUpdate >= 1000) {
          // Pass undefined for zoom so it pans smoothly without resetting the user's manual zoom
          goToLocation([location.longitude!, location.latitude!], undefined);
          lastUpdateRef.current = Date.now();
        }
      }
    };

    // Check immediately on every location state update
    checkAndTrack();

    // Also run an interval loop to continuously pull the map back 1 second after cooldown expires
    // even if location hasn't changed
    const intervalId = setInterval(checkAndTrack, 500);

    return () => clearInterval(intervalId);
  }, [location.latitude, location.longitude, location.heading, lastMapInteraction, goToLocation]);

  return (
    <Box className={classes.root}>
      <TopBar />
      <GenericMap />

      <Box className={classes.cameraButtonContainer}>
        <OpenCameraButton />
      </Box>

      <Box className={classes.recenterButtonContainer}>
        <IconButton 
          className={classes.recenterCircle} 
          onClick={handleRecenter}
          size="large"
        >
          <MyLocationIcon />
        </IconButton>
      </Box>
      <NotificationCenter />

      {/* Toast notifications container */}
      <ToastContainer
        className={classes.toastContainer}
        position="top-center"
        autoClose={false}
        transition={Slide}
        closeButton={false}
        limit={3}
      />
    </Box>
  );
};

export const ChiefApp: React.FC = () => {
  return (
    <ChiefToastProvider>
      <ChiefAppContent />
    </ChiefToastProvider>
  );
};
