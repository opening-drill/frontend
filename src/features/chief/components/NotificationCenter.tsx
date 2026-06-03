import { Box, Button, SwipeableDrawer, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useChiefToast } from '../context/ChiefToastContext';
import { ChiefToast } from './ChiefToast';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const useStyles = makeStyles()((theme) => ({
  drawerPaper: {
    height: '80%',
    backgroundColor: 'rgba(18, 24, 38, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    direction: 'rtl',
  },
  header: {
    padding: theme.spacing(3, 2, 2, 2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.25rem',
  },
  clearAllBtn: {
    color: '#ff3b30',
    borderColor: 'rgba(255, 59, 48, 0.5)',
    '&:hover': {
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      borderColor: '#ff3b30',
    }
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  emptyState: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: theme.spacing(4),
  },
  dragHandleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    }
  },
  dragHandle: {
    width: 48,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  toastWrapper: {
    width: '100%',
    maxWidth: '400px',
  }
}));

export const NotificationCenter: React.FC = () => {
  const { classes } = useStyles();
  const { 
    notifications, 
    removeNotification, 
    clearNotifications,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    markAllAsRead
  } = useChiefToast();

  const handleOpen = () => setIsNotificationCenterOpen(true);
  const handleClose = () => setIsNotificationCenterOpen(false);

  // Mark all as read when the drawer is opened
  useEffect(() => {
    if (isNotificationCenterOpen) {
      markAllAsRead();
    }
  }, [isNotificationCenterOpen, markAllAsRead]);

  return (
    <SwipeableDrawer
      anchor="top"
      open={isNotificationCenterOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      classes={{ paper: classes.drawerPaper }}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      <Box className={classes.header}>
        <Typography className={classes.headerTitle}>מרכז התראות</Typography>
        {notifications.length > 0 && (
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<DeleteSweepIcon sx={{ ml: 1, mr: -0.5 }} />}
            className={classes.clearAllBtn}
            onClick={clearNotifications}
          >
            נקה הכל
          </Button>
        )}
      </Box>

      <Box className={classes.content}>
        {notifications.length === 0 ? (
          <Typography className={classes.emptyState}>אין התראות חדשות</Typography>
        ) : (
          notifications.map((n) => (
            <Box key={n.id} className={classes.toastWrapper}>
              <ChiefToast
                type={n.type}
                location={n.location}
                arrivalTime={n.arrivalTime}
                timestamp={n.timestamp}
                closeToast={() => removeNotification(n.id)}
              />
            </Box>
          ))
        )}
      </Box>

      {/* iOS style drag handle at the bottom */}
      <Box className={classes.dragHandleContainer}>
        <Box className={classes.dragHandle} />
      </Box>
    </SwipeableDrawer>
  );
};
