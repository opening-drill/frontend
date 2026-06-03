import { useEffect, useRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useDeviceLocation } from '../../core/store/atoms/locationAtom';
import GenericMap from '../map/components/GenericMap';
import { useMap } from '../map/MapProvider';
import { NotificationCenter } from './components/NotificationCenter';
import { TopBar } from './components/TopBar';

import { Box } from '@mui/material';
import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChiefToastProvider } from './context/ChiefToastContext';
  
const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    position: 'relative'
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
  const { location } = useDeviceLocation();
  const { goToLocation } = useMap();

  const lastUpdateRef = useRef<number>(0);

  // Throttled effect to track location movements and heading
  useEffect(() => {
    if (location.latitude && location.longitude) {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateRef.current;
      let timeoutId: ReturnType<typeof setTimeout>;

      const executeUpdate = () => {
        goToLocation([location.longitude!, location.latitude!], 19.5, location.heading ?? undefined);
        lastUpdateRef.current = Date.now();
      };

      if (timeSinceLastUpdate >= 1000) {
        executeUpdate();
      } else {
        timeoutId = setTimeout(executeUpdate, 1000 - timeSinceLastUpdate);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [location.latitude, location.longitude, location.heading, goToLocation]);

  return (
    <Box className={classes.root}>
      <TopBar />
      <GenericMap />
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
