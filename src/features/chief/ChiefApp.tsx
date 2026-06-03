import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { GenericMap } from '../map/components/GenericMap';
import { OpenCameraButton } from './components/openCameraButton';
import { CoordinatePill } from './components/CoordinatePill';

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
}));

export const ChiefApp: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <CoordinatePill />
      <GenericMap />

      <Box className={classes.cameraButtonContainer}>
        <OpenCameraButton />
      </Box>
    </Box>
  );
};

