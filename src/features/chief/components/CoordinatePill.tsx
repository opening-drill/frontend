import React from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';
import { useDeviceLocation } from '../../../core/store/atoms/locationAtom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const useStyles = makeStyles()((theme) => ({
  pill: {
    position: 'absolute',
    top: theme.spacing(2),
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    background: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: 'blur(12px)',
    border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
    borderRadius: 50,
    padding: theme.spacing(2.5, 5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    minWidth: 'min(400px, 90vw)',
    maxWidth: '90vw',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 2),
      '& .MuiTypography-root': {
        fontSize: '1.1rem',
      }
    },
    gap: theme.spacing(2),
    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`,
    color: theme.palette.text.primary,
    direction: 'rtl',
  },
  error: {
    color: theme.palette.error.main,
  },
  loading: {
    color: theme.palette.text.secondary,
  }
}));

export const CoordinatePill: React.FC = () => {
  const { classes } = useStyles();
  const { location, refreshLocation } = useDeviceLocation();

  return (
    <Box 
      className={classes.pill}
      onClick={location.error ? refreshLocation : undefined}
      sx={{ cursor: location.error ? 'pointer' : 'default' }}
    >
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
  );
};
