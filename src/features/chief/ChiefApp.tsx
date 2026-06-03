import { Box, Typography, AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { GenericMap } from '../map/components/GenericMap';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import MapIcon from '@mui/icons-material/Map';

const drawerWidth = 240;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
}));

export const ChiefApp: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <GenericMap />
    </Box>
  );
};
