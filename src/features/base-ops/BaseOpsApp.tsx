import React from 'react';
import { Box, Typography, AppBar, Toolbar, Grid, Paper, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { GenericMap } from '../map/components/GenericMap';
import HubIcon from '@mui/icons-material/Hub';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSetAtom } from 'jotai';
import { logoutAtom } from '../../core/store/authAtom';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: theme.palette.background.default,
  },
  appBar: {
    background: 'rgba(18, 24, 38, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
  dashboardGrid: {
    marginTop: theme.spacing(3),
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper,
    border: `1px solid rgba(255, 255, 255, 0.05)`,
    borderRadius: theme.shape.borderRadius,
  },
  mapContainer: {
    flexGrow: 1,
    minHeight: 400,
  }
}));

export const BaseOpsApp: React.FC = () => {
  const { classes } = useStyles();
  const logout = useSetAtom(logoutAtom);

  return (
    <Box className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar>
          <HubIcon sx={{ mr: 2, color: 'secondary.main' }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            Base of Operations
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => logout()}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box className={`${classes.content} fade-in`}>
        <Typography variant="h4" gutterBottom>
          Global Logistics & Overview
        </Typography>
        <Grid container spacing={3} className={classes.dashboardGrid}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" gutterBottom color="secondary.main">
                Status Reports
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All systems nominal. Awaiting further tactical data.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper className={classes.paper} elevation={0}>
              <Box className={classes.mapContainer}>
                <GenericMap />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
