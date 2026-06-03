import React from 'react';
import { Box, Typography, AppBar, Toolbar, Grid, Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { GenericMap } from '../map/components/GenericMap';
import HubIcon from '@mui/icons-material/Hub';
import AttackCardList from './components/open-alerts/OpenAlerts';
import type { AlertData } from '../../types/hamel';

const useStyles = makeStyles()((theme) => ({
  root: {
    overflow: 'hidden',
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
  },
  paper: {
    padding: theme.spacing(2),
    height: '100%',
    overflowY: 'auto',
    background: theme.palette.background.paper,
    border: `1px solid rgba(255, 255, 255, 0.05)`,
    borderRadius: theme.shape.borderRadius,
  },
  mapContainer: {
    height: '500px',
    display: 'flex',
    flexGrow: 1,
    minHeight: 400, 
  },
}));

export const AlertsApp: React.FC = () => {
  const { classes } = useStyles();

  const handleAccept = (alert: AlertData) => {
    console.log("ACCEPT", alert.event_id);
  };

  const handleDecline = (alert: AlertData) => {
    console.log("DECLINE", alert.event_id);
  };

  const handleChooseAnother = (alert: AlertData) => {
    console.log(
      "CHANGE AIRCRAFT",
      alert.event_id,
      alert.recommended_aircraft_id
    );
  };
  const alerts: AlertData[] = [
  {
    event_id: "evt-001",
    received_alert_time: "2026-06-03T14:32:10Z",

    target: {
      lat: 31.7683,
      lng: 35.2137,
      name: "Enemy Tank Column",
    },

    image_url:
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6",

    recommended_aircraft_id: "aircraft-f16-01",
    aircraft_type: "F-16",

    urgency_level: "critical",

    rationale:
      "Fastest available aircraft with sufficient payload.",
  },
  {
    event_id: "evt-002",
    received_alert_time: "2026-06-03T14:35:22Z",

    target: {
      lat: 32.0853,
      lng: 34.7818,
      name: "Missile Launcher",
    },

    image_url:
      "https://images.unsplash.com/photo-1548013146-72479768bada",

    recommended_aircraft_id: "aircraft-heron-03",
    aircraft_type: "Heron UAV",

    urgency_level: "critical",

    rationale:
      "Persistent surveillance recommended before strike.",
  },
];
  return (
    <Box className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar>
          <HubIcon sx={{ mr: 2, color: 'secondary.main' }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            Base of Operations
          </Typography>
        </Toolbar>
      </AppBar>
      <Box className={`${classes.content} fade-in`}>
        <Typography variant="h4" gutterBottom>
          Global Logistics & Overview
        </Typography>
        <Grid container spacing={3} className={classes.dashboardGrid}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={classes.paper} elevation={0}>
              <h1>Open Alerts ({alerts.length})</h1>
              <AttackCardList
                alerts={alerts}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onChooseAnother={handleChooseAnother}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box className={classes.mapContainer}>
              <GenericMap />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
