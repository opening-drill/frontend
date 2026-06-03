import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  },
  paper: {
    padding: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
    textAlign: 'center',
    borderRadius: Number(theme.shape.borderRadius) * 2,
    background: 'rgba(18, 24, 38, 0.7)',
    backdropFilter: 'blur(12px)',
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  description: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
    lineHeight: 1.6,
  },
  button: {
    padding: theme.spacing(1.5, 4),
    fontSize: '1.1rem',
  }
}));

export const Onboarding: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Box className={`${classes.container} fade-in`}>
      <Paper elevation={0} className={classes.paper}>
        <Typography component="h1" variant="h3" className={classes.title}>
          System Initialization
        </Typography>
        <Typography variant="body1" className={classes.description}>
          Welcome to the new operations platform. We are configuring your workspace 
          and establishing secure connections. Please proceed to your designated dashboard.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => window.location.href = '/'}
        >
          Enter Workspace
        </Button>
      </Paper>
    </Box>
  );
};
