import HubIcon from "@mui/icons-material/Hub";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, Button, Paper, Toolbar, Typography } from "@mui/material";
import React from "react";
import { makeStyles } from "tss-react/mui";
import GenericMap from "../map/components/GenericMap";
import { useMap } from "../map/MapProvider";
import { LOCATIONS } from "../map/utils/mapUtils";
import { useSetAtom } from "jotai";
import { logoutAtom } from "../../core/store/authAtom";
import { useHamelSocket } from "../../hooks/useHamelSocket";
import { useAircraftSocket } from "../../hooks/useAircraftSocket";

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: theme.palette.background.default,
  },
  appBar: {
    background: "rgba(18, 24, 38, 0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  dashboardGrid: {
    marginTop: theme.spacing(3),
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: theme.palette.background.paper,
    border: `1px solid rgba(255, 255, 255, 0.05)`,
    borderRadius: theme.shape.borderRadius,
  },
  mapContainer: {
    flexGrow: 1,
    minHeight: 400,
  },
}));

export const BaseOpsApp: React.FC = () => {
  const { classes } = useStyles();
  const { goToLocation } = useMap();
  const logout = useSetAtom(logoutAtom);

  // Initialize socket listeners
  useHamelSocket();
  useAircraftSocket();

  return (
    <Box className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            AIRcraft
          </Typography>
          <Button
            onClick={() => {
              goToLocation(LOCATIONS.telAviv.coords, 19.5);
            }}
          >
            go-to
          </Button>
          <HubIcon sx={{ mr: 2, color: "secondary.main" }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: "bold", flexGrow: 1 }}
          >
            Base of Operations
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
      <Box
        sx={{ padding: "0px !important" }}
        className={`${classes.content} pa fade-in`}
      >
        <Paper className={classes.paper} elevation={0}>
          <Box className={classes.mapContainer}>
            <GenericMap />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
