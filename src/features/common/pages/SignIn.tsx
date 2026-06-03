import React, { useState } from 'react';
import { Box, Button, Typography, Paper, TextField, Alert, CircularProgress } from '@mui/material';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { tokenAtom, userAtom } from '../../../core/store/authAtom';
import { loginRequest } from '../../../core/server/api/appRequests';

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
  const navigate = useNavigate();

  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  const [username, setUsername] = useState('1234567@idf.il');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginRequest({ username, password });
      
      // Store token and user data in Jotai atoms
      setToken(response.token);
      setUser(response.user);
      
      // Navigate to operational screen
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Error logging in. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={`${classes.container} fade-in`}>
      <Paper elevation={0} className={classes.paper}>
        <Typography component="h1" variant="h4" className={classes.title}>
          Welcome Back
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          Sign in to access the command center
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }} variant="outlined">
            {error}
          </Alert>
        )}

        <form className={classes.form} onSubmit={handleSubmit} noValidate>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'inherit' }} />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
