import React from 'react';
import { Box, Button, Typography, Paper, TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
  },
  paper: {
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    borderRadius: Number(theme.shape.borderRadius) * 2,
    background: 'rgba(18, 24, 38, 0.7)',
    backdropFilter: 'blur(12px)',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    fontSize: '1.1rem',
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  }
}));

export const SignIn: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Box className={`${classes.container} fade-in`}>
      <Paper elevation={0} className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.title}>
          Welcome Back
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          Sign in to access the command center
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => window.location.href = '/'}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
