import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import GenericMap from '../map/components/GenericMap';
import { CoordinatePill } from './components/CoordinatePill';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    position: 'relative'
  },
}));

export const ChiefApp: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <CoordinatePill />
      <GenericMap />
    </Box>
  );
};
