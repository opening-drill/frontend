import React from 'react';
import { Box, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { GenericMap } from '../map/components/GenericMap';
import { CoordinatePill } from './components/CoordinatePill';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChiefToastProvider, useChiefToast } from './context/ChiefToastContext';
  
const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    position: 'relative'
  },
  toastContainer: {
    position: 'fixed' as any,
    top: '24px !important',
    left: '50% !important',
    transform: 'translateX(-50%) !important',
    padding: '0 !important',
    width: '340px !important',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .Toastify__toast': {
      width: '100% !important',
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
  const { addNotification, cooldownRemaining } = useChiefToast();
  const isCooldownActive = cooldownRemaining > 0;

  const triggerApproved = () => {
    addNotification('approved', '123747,777886', '13:56:20');
  };

  const triggerCancelled = () => {
    addNotification('cancelled', '123747,777886');
  };

  return (
    <Box className={classes.root}>
      <CoordinatePill />
      <GenericMap />

      {/* Floating panel with test buttons */}
      <Box className={classes.testControls}>
        <Button
          variant="contained"
          color="success"
          onClick={triggerApproved}
          className={classes.testButton}
          disabled={isCooldownActive}
        >
          {isCooldownActive ? `המתן ${cooldownRemaining} ש'` : 'שגר דיווח: אושר'}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={triggerCancelled}
          className={classes.testButton}
          disabled={isCooldownActive}
        >
          {isCooldownActive ? `המתן ${cooldownRemaining} ש'` : 'שגר דיווח: בוטל'}
        </Button>
      </Box>

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
