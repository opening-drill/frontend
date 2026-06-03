import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { GenericMap } from '../map/components/GenericMap';
import { OpenCameraButton } from './components/openCameraButton';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    height: '100vh',
    position: 'relative',
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 55,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
  },
}));

export const ChiefApp: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <GenericMap />

      <Box className={classes.cameraButtonContainer}>
        <OpenCameraButton />
      </Box>
    </Box>
  );
};

