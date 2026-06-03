import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useDeviceLocation } from '../../core/store/atoms/locationAtom';
import GenericMap from '../map/components/GenericMap';
import { useMap } from '../map/MapProvider';
import { TopBar } from './components/TopBar';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    position: 'relative'
  },
}));

export const ChiefApp: React.FC = () => {
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
    </Box>
  );
};
