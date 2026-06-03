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

export const LogIn: React.FC = () => {
  const { classes } = useStyles();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy function showing the username and password in console & alert
    console.log('Dummy Auth Success:', { username, password });
    alert(`נשלח לפונקציית התחברות:\nמשתמש: ${username}\nסיסמה: ${password}`);

    // Proceed to redirect
    window.location.href = '/';
  };

  return (
    <Box className={`${classes.container} fade-in`} dir="rtl">
      <Paper elevation={0} className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.title}>
          ברוכים הבאים
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          התחבר למרכז הבקרה
        </Typography>
        <form className={classes.form} onSubmit={handleLogin} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="שם משתמש"
            name="username"
            autoComplete="username"
            autoFocus
            slotProps={{ htmlInput: { maxLength: 25 } }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="סיסמה"
            type="password"
            id="password"
            autoComplete="current-password"
            slotProps={{ htmlInput: { maxLength: 25 } }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            התחבר
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
