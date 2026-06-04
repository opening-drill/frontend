import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Box, Typography, IconButton, Badge } from '@mui/material';
import { alpha } from '@mui/material/styles';
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { useDeviceLocation } from '../../../core/store/atoms/locationAtom';
import { useMap } from '../../map/MapProvider';
import { useChiefToast } from '../context/ChiefToastContext';

const useStyles = makeStyles()((theme) => ({
  topBarContainer: {
    position: 'absolute',
    top: theme.spacing(2),
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    width: '90vw',
    maxWidth: '600px',
    // Using ltr so the first element is on the left and last is on the right
    direction: 'ltr',
  },
  circle: {
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
  pill: {
    background: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: 'blur(12px)',
    border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
    borderRadius: 50,
    padding: theme.spacing(2.5, 5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    flex: 1,
    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`,
    color: theme.palette.text.primary,
    direction: 'rtl',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 2),
      '& .MuiTypography-root': {
        fontSize: '1.1rem',
      }
    },
  },
  error: {
    color: theme.palette.error.main,
  },
  loading: {
    color: theme.palette.text.secondary,
  }
}));

export const TopBar: React.FC = () => {
  const { classes } = useStyles();
  const { location, refreshLocation } = useDeviceLocation();
  const { goToLocation } = useMap();
  const { notifications, setIsNotificationCenterOpen } = useChiefToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRecenter = () => {
    if (location.error) {
      refreshLocation();
    } else if (location.longitude && location.latitude) {
      goToLocation([location.longitude, location.latitude]);
    }
  };

  return (
    <Box className={classes.topBarContainer}>
      <IconButton 
        className={classes.circle}
        onClick={() => setIsNotificationCenterOpen(true)}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      <Box className={classes.pill}>
        <LocationOnIcon color="primary" fontSize="large" />
        {location.loading ? (
          <Typography variant="h5" className={classes.loading}>מאתר מיקום...</Typography>
        ) : location.error ? (
          <Typography variant="h5" className={classes.error}>שגיאה באיתור מיקום</Typography>
        ) : (
          <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: '0.05em' }}>
            {location.latitude?.toFixed(5)}°, {location.longitude?.toFixed(5)}°
          </Typography>
        )}
      </Box>

      <IconButton 
        className={classes.circle}
        onClick={handleRecenter}
      >
        <MyLocationIcon />
      </IconButton>
    </Box>
  );
};
