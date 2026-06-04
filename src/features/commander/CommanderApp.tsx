import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import MapIcon from "@mui/icons-material/Map";
import SecurityIcon from "@mui/icons-material/Security";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { logoutAtom } from "../../core/store/authAtom";
import { useAircraftSocket } from "../../hooks/useAircraftSocket";
import { useHamelSocket } from "../../hooks/useHamelSocket";
import type { Drone } from "../base-ops/BaseOpsApp";
import GenericMap from "../map/components/GenericMap";

const drawerWidth = 240;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "rgba(18, 24, 38, 0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.background.default,
    borderRight: `1px solid rgba(255, 255, 255, 0.08)`,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    marginTop: 64, // Appbar height
  },
  mapWrapper: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
  },
}));

export const CommanderApp: React.FC = () => {
  const { classes } = useStyles();
  const logout = useSetAtom(logoutAtom);
  const [drones] = useState<Drone[]>([
    { id: 1, coords: [34.7915, 31.2518], name: "רחפן א'" },
    { id: 2, coords: [34.6152, 31.515], name: "רחפן ב'" },
  ]);

  // Initialize socket listeners
  useHamelSocket();
  useAircraftSocket();

  return (
    <Box className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar>
          <SecurityIcon sx={{ mr: 2, color: "primary.main" }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Commander Control Center
          </Typography>
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
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2 }}>
          <List>
            {["Dashboard", "Units", "Tactical Map"].map((text, index) => (
              <ListItem disablePadding key={text}>
                <ListItemButton>
                  <ListItemIcon sx={{ color: "primary.main" }}>
                    {index === 0 ? (
                      <DashboardIcon />
                    ) : index === 1 ? (
                      <SecurityIcon />
                    ) : (
                      <MapIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" className={`${classes.content} fade-in`}>
        <Typography variant="h4" gutterBottom>
          Tactical Overview
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome to the Commander interface. Manage your units and oversee
          operations below.
        </Typography>
        <Box className={classes.mapWrapper}>
          <GenericMap drones={drones} />
        </Box>
      </Box>
    </Box>
  );
};
