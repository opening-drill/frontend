import HubIcon from '@mui/icons-material/Hub';
import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, Button, Dialog, DialogActions, DialogTitle, Grid, Paper, Stack, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';

import { useSetAtom } from 'jotai';
import { approveAttackRequest } from '../../core/server/api/approveAttackRequest';
import { logoutAtom } from '../../core/store/authAtom';
import { useAircraftSocket } from '../../hooks/useAircraftSocket';
import { useHamelSocket } from '../../hooks/useHamelSocket';
import type { AlertData, RecommendationPush } from '../../types/alertTypes';
import type { Drone } from '../base-ops/BaseOpsApp';
import GenericMap from '../map/components/GenericMap';
import { useMap } from '../map/MapProvider';
import { LOCATIONS } from '../map/utils/mapUtils';
import { AircraftTable } from './components/aircraft-table/AircraftTable';
import AttackCardList from './components/open-alerts/OpenAlerts';


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
    display: 'flex',
    flexDirection: 'column',
  },
  dashboardGrid: {
    marginTop: theme.spacing(1),

  },
  paper: {
    padding: theme.spacing(1),
    height: 'calc(100vh - 100px)',
    background: theme.palette.background.paper,
    border: `1px solid rgba(255, 255, 255, 0.05)`,
    borderRadius: theme.shape.borderRadius,
  },
  mapContainer: {
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexGrow: 1,
    minHeight: 400,
  },
}));

export const AlertsApp: React.FC = () => {
  const { classes } = useStyles();

  // Initialize socket connections
  useAircraftSocket();
  useHamelSocket();

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

  const handleAccept = (alert: AlertData) => {
    setSelectedAlert(alert);
    setOpenConfirm(true);
  };

  const confirm = (alert: RecommendationPush) => {
    if (!selectedAlert) return;
    approveAttackRequest({
      eventId: alert.event_id,
      aircraftId: alert.recommended_aircraft_id,
      start: { latitude: alert.target.lat, longitude: alert.target.lng },
      end: { latitude: alert.target.lat, longitude: alert.target.lng },
      urgency: alert.urgency_level
    });

    alerts.splice(alerts.findIndex(a => a.event_id === alert.event_id), 1);
    setOpenConfirm(false);
    setSelectedAlert(null);
  };

  const handleDecline = (alert: AlertData) => {
    alerts.splice(alerts.findIndex(a => a.event_id === alert.event_id), 1);
  };

  const handleChooseAnother = () => {
    setIsAircraftTableOpen(true)
  };

  const cancel = () => {
    setOpenConfirm(false);
    setSelectedAlert(null);
  };

  const [isAircraftTableOpen, setIsAircraftTableOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [selectedAlert, setSelectedAlert] = React.useState<AlertData | null>(null);
  useHamelSocket();
  useAircraftSocket();

  const [drones, setDrones] = useState<Drone[]>([
    { id: 1, coords: [34.7915, 31.2518], name: "רחפן א'" },
    { id: 2, coords: [34.6152, 31.515], name: "רחפן ב'" },
  ]);

  const { goToLocation } = useMap();
  const logout = useSetAtom(logoutAtom);

  return (
    <Box className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Stack direction={'row'} sx={{ alignItems: 'center' }}>
            <HubIcon sx={{ mr: 2, color: 'secondary.main' }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              Aircraft
            </Typography>
            <Button
              onClick={() => {
                goToLocation(LOCATIONS.telAviv.coords, 19.5);
              }}
            >
              go-to
            </Button>

            <Button
              onClick={() => {
                setDrones((prevDrones) =>
                  prevDrones.map((drone) => ({
                    ...drone,

                    coords: [
                      drone.coords[0] + 0.001,
                      drone.coords[1] + 0.001,
                    ],
                  }))
                );
              }}
            >
              move
            </Button>
          </Stack>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => logout()}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box className={`${classes.content} fade-in`}>
        <Grid container spacing={3} className={classes.dashboardGrid}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={classes.paper} elevation={0}>
              <h3>Open Alerts ({alerts.length})</h3>
              <AttackCardList
                alerts={alerts}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onChooseAnother={handleChooseAnother}
                setAlert={setSelectedAlert}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box className={classes.mapContainer}>
              <GenericMap drones={drones} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Dialog maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              width: '95vw',
              height: '90vh',
              maxWidth: 'none',
              maxHeight: 'none',
            },
          },
        }}
        open={isAircraftTableOpen} onClose={() => setIsAircraftTableOpen(false)}>
        <AircraftTable setIsAircraftTableOpen={setIsAircraftTableOpen} handleAccept={handleAccept} alert={selectedAlert} />
      </Dialog>
      <Dialog open={openConfirm} onClose={cancel}>
        <DialogTitle>Are you sure you want to attack?</DialogTitle>

        <DialogActions>
          <Button onClick={cancel}>No</Button>
          <Button onClick={() => selectedAlert ? confirm(selectedAlert) : undefined} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
